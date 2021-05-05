/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customAxios = require('@customs/axios.custom');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const UserDao = require('@daos/user.dao');
const { generateRandomString } = require('@utils/random.utils');

const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = require('@configs');
const { GITHUB_API } = require('@constants');

const get = async (condition, projection) => {
  const user = await UserDao.findOne(condition, projection);

  if (!user) throw new CustomError(errorCodes.NOT_FOUND, 'User not found');

  return user;
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

const register = async ({
  email,
  username,
  password,
  role,
  fullName,
  githubId,
  githubUsername
}) => {
  if (await UserDao.findOne({ email }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Email has already been taken'
    );

  if (await UserDao.findOne({ username }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Username has already been taken'
    );

  const salt = generateSalt(10);
  password = password || generateRandomString(16);
  password = await hashBcrypt(password, salt);

  if (!githubId) {
    try {
      const response = await customAxios({
        method: 'GET',
        url: `${GITHUB_API.BASE_URL}/users/${githubUsername}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: GITHUB_API.HEADERS.ACCEPT
        }
      });

      githubId = response.data.id;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  const user = await UserDao.create({
    email,
    username,
    password,
    role,
    fullName,
    githubId,
    githubUsername
  });

  return omitPasswordField(user._doc);
};

const generateAccessToken = async userId => {
  const accessToken = await jwt.sign({ userId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_TIME
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
  update,
  remove,
  login,
  register,
  verifyAccessToken
};
