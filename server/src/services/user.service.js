const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const UserDao = require('@daos/user.dao');

const GhAppInstallationService = require('@services/gh-app-installation.service');
const { sendMail } = require('@services/mail.service');

const { generateRandomString } = require('@utils/random.utils');
const { getAccountRegistrationEmailTemplate } = require('@utils/mail.utils');
const GithubUtils = require('@utils/github.utils');
const { parseBoolean } = require('@utils');

const { JWT_SECRET_KEY, JWT_EXPIRATION_TIME } = require('@configs');

const { GOOGLE_APP_USER_EMAIL } = process.env;

const get = async (condition, projection) => {
  const user = await UserDao.findOne(condition, projection);

  if (!user) throw new CustomError(errorCodes.NOT_FOUND, 'User not found');

  return user;
};

const create = async (
  requesterId,
  { email, username, role, fullName, githubUsername }
) => {
  if (email && (await UserDao.findOne({ email })))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Email has already been taken'
    );

  if (username && (await UserDao.findOne({ username })))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Username has already been taken'
    );

  if (await UserDao.findOne({ githubUsername }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `A user with the GitHub username "${githubUsername}" already exists`
    );

  let ghAppInstallationToken;

  const ghAppInstallations = await GhAppInstallationService.search();
  if (ghAppInstallations.length)
    ghAppInstallationToken =
      await GhAppInstallationService.getGhAppInstallationToken(
        ghAppInstallations[0]._id
      );

  let githubId, name, githubEmail;

  const response = await GithubUtils.user.getUser(
    ghAppInstallationToken,
    githubUsername
  );

  if (response.status) {
    if (response.status < 400) {
      ({ id: githubId, name, email: githubEmail } = response.data);

      const user = await UserDao.findOne({ githubId });
      if (user)
        throw new CustomError(
          errorCodes.CONFLICT,
          `A GitHub user with the username "${githubUsername}" has the same GitHub ID
          "${githubId}" with a user that holds the GitHub username"${user.githubUsername}"
          stored in the system. This occurs because the user may have changed his
          username on GitHub and the data between Vbee OMS and GitHub is not in sync.
          To resolve this issue, please ask the mentioned user to update his GitHub
          username in Vbee OMS or execute data synchronization and then perform
          this action again.`
        );
    } else {
      const { message } = response.data;
      throw new CustomError(
        response.status,
        response.status === 404
          ? `GitHub username "${githubUsername}" not found`
          : message
      );
    }
  }

  const receiverEmail = email || githubEmail || GOOGLE_APP_USER_EMAIL;
  const accountUsername = username || `${githubUsername}-${Date.now()}`;

  const salt = generateSalt(10);
  const password = generateRandomString(16);
  const hashedPassword = await hashBcrypt(password, salt);

  await sendMail(requesterId, {
    receiverEmails: receiverEmail,
    subject: 'Vbee OMS Account Registration',
    htmlContent: getAccountRegistrationEmailTemplate(
      email || githubEmail || '',
      password,
      accountUsername,
      githubId,
      githubUsername,
      role
    )
  });

  const user = await UserDao.create({
    email: email || githubEmail || undefined,
    username: accountUsername,
    password: hashedPassword,
    role,
    fullName: fullName || name || '',
    githubId,
    githubUsername
  });

  return omitPasswordField(user._doc);
};

const update = async (condition, data) => {
  const user = await UserDao.update(condition, data);

  return user;
};

const remove = async condition => {
  const user = await UserDao.remove(condition);

  if (!user) throw new CustomError(errorCodes.NOT_FOUND, 'User not found');

  return user;
};

const search = async (
  condition,
  projection = '-password -createdAt -updatedAt'
) => {
  if (condition.q) {
    if (parseBoolean(condition.githubSearch)) {
      let ghAppInstallationToken;

      const ghAppInstallations = await GhAppInstallationService.search();
      if (ghAppInstallations.length)
        ghAppInstallationToken =
          await GhAppInstallationService.getGhAppInstallationToken(
            ghAppInstallations[0]._id
          );

      const getGitHubUsers = async () => {
        const users = await GithubUtils.search.searchUsers(
          ghAppInstallationToken,
          condition.q
        );

        return users.map(({ id, login, htmlUrl }) => ({
          source: 'GitHub',
          githubId: id,
          githubUsername: login,
          url: htmlUrl
        }));
      };

      const getVbeeOMSUsers = async () => {
        const users = await UserDao.search(condition.q, projection);

        return users.map(({ _doc: { preferences, role, ...rest } }) => ({
          source: 'Vbee OMS',
          ...rest
        }));
      };

      const users = await Promise.all([getGitHubUsers(), getVbeeOMSUsers()]);

      return users;
    }

    const users = await UserDao.search(condition.q, projection);
    return users;
  }

  const users = await UserDao.findAll(condition, projection);
  return users;
};

const login = async (email, password) => {
  const user = await UserDao.findOne({ email });
  if (!user) throw new CustomError(errorCodes.INVALID_CREDENTIALS);

  const isCorrectPassword = await compareBcrypt(password, user.password);
  if (!isCorrectPassword) throw new CustomError(errorCodes.INVALID_CREDENTIALS);

  const accessToken = await generateAccessToken(user._id);
  return accessToken;
};

const generateAccessToken = async userId => {
  const accessToken = await jwt.sign({ userId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRATION_TIME
  });
  return accessToken;
};

const verifyAccessToken = async accessToken => {
  const data = jwt.verify(accessToken, JWT_SECRET_KEY);
  const { userId } = data;

  const user = await UserDao.findOne(userId);
  return user;
};

const generateSalt = rounds => bcrypt.genSaltSync(rounds);

const hashBcrypt = (text, salt) => {
  const hashedBcrypt = new Promise((resolve, reject) => {
    bcrypt.hash(text, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedBcrypt;
};

const compareBcrypt = async (data, hashed) => {
  const isCorrect = await new Promise((resolve, reject) => {
    bcrypt.compare(data, hashed, (err, same) => {
      if (err) reject(err);
      resolve(same);
    });
  });
  return isCorrect;
};

const omitPasswordField = ({ password, ...rest }) => ({ ...rest });

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  login,
  verifyAccessToken
};
