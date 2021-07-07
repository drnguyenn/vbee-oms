const jwt = require('jsonwebtoken');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const UserDao = require('@daos/user.dao');

const { compareBcrypt } = require('@utils/user.utils');

const { JWT_SECRET_KEY, JWT_EXPIRATION_TIME } = require('@configs');

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

module.exports = {
  login,
  verifyAccessToken
};
