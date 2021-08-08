const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const UserDao = require('@daos/user.dao');
const ClusterMemberDao = require('@daos/cluster-member.dao');
const ServiceMemberDao = require('@daos/service-member.dao');
const RepositoryMemberDao = require('@daos/repository-member.dao');

const GhAppInstallationService = require('@services/gh-app-installation.service');
const { removeMember } = require('@services/repository.service');
const { sendMail } = require('@services/mail.service');

const {
  generateSalt,
  hashBcrypt,
  omitPasswordField
} = require('@utils/user.utils');
const { generateRandomString } = require('@utils/random.utils');
const { getAccountRegistrationEmailTemplate } = require('@utils/mail.utils');
const GithubUtils = require('@utils/github.utils');
const { parseBoolean } = require('@utils');

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
  const condition = [{ githubUsername }];
  if (email) condition.push({ email });
  if (username) condition.push({ username });

  let user = await UserDao.findOne({ $or: condition });

  if (user) {
    if (email === user.email)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Email has already been taken'
      );

    if (username === user.username)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Username has already been taken'
      );

    if (githubUsername === user.githubUsername)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `A user with the GitHub username "${githubUsername}" already exists`
      );
  }

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

      user = await UserDao.findOne({ githubId });
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

  user = await UserDao.create({
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

const update = async (requester, condition, data) => {
  let user = await get(condition);

  if (user.username === process.env.INITIAL_ADMIN_USERNAME)
    throw new CustomError(
      errorCodes.FORBIDDEN,
      'Can not alter the initial administrator account'
    );

  user = await UserDao.update(condition, data);

  return user;
};

const remove = async (requester, condition) => {
  const user = await get(condition);

  if (user.username === process.env.INITIAL_ADMIN_USERNAME)
    throw new CustomError(
      errorCodes.FORBIDDEN,
      'Can not delete the initial administrator account'
    );

  if (requester._id === user._id)
    throw new CustomError(
      errorCodes.UNPROCESSABLE_ENTITY,
      'Can not delete your own account'
    );

  await removeUserFromAllRepositories(condition);
  await removeUserFromAllClusters(condition);
  await removeUserFromAllServices(condition);
  await UserDao.remove(condition);

  return user;
};

const search = async (
  condition,
  projection = '-password -preferences -createdAt -updatedAt'
) => {
  const { vbeeSearch = true, githubSearch = false, ...others } = condition;

  if (condition.q) {
    const promises = [];

    if (parseBoolean(vbeeSearch)) {
      const getVbeeOMSUsers = async () => {
        const users = await UserDao.search(condition.q, projection);

        return users.map(({ _doc: { preferences, role, ...rest } }) => ({
          source: 'Vbee OMS',
          ...rest
        }));
      };

      promises.push(getVbeeOMSUsers());
    }

    if (parseBoolean(githubSearch)) {
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

        return users.map(({ id, login, htmlUrl, avatarUrl }) => ({
          source: 'GitHub',
          githubId: id,
          githubUsername: login,
          url: htmlUrl,
          avatarUrl
        }));
      };

      promises.push(getGitHubUsers());
    }

    if (promises.length) {
      const users = await Promise.all(promises);

      return users.flat();
    }

    return [];
  }

  const users = await UserDao.findAll({ ...others }, projection);
  return users;
};

const countAll = async () => {
  const userCount = await UserDao.countAll();
  return userCount;
};

const removeUserFromAllClusters = async condition => {
  const user = await get(condition);

  await ClusterMemberDao.removeMany({ user: user._id });

  return { statusCode: 200 };
};

const removeUserFromAllRepositories = async condition => {
  const user = await get(condition);

  const members = await RepositoryMemberDao.findAll(
    { user: user._id },
    'repository'
  );

  await Promise.all(
    members.map(async ({ repository }) => {
      return removeMember(
        repository._id,
        condition,
        await GhAppInstallationService.getGhAppInstallationToken({
          githubId: repository.ghAppInstallationId
        })
      );
    })
  );

  return { statusCode: 200 };
};

const removeUserFromAllServices = async condition => {
  const user = await get(condition);

  await ServiceMemberDao.removeMany({ user: user._id });

  return { statusCode: 200 };
};

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  countAll,
  removeUserFromAllClusters,
  removeUserFromAllRepositories,
  removeUserFromAllServices
};
