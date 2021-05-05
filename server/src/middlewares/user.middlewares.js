const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');
const UserService = require('@services/user.service');
const asyncMiddleware = require('./async.middlewares');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(errorCodes.UNAUTHORIZED);

  const [tokenType, accessToken] = authorization.split(' ');

  if (tokenType !== 'Bearer') throw new CustomError(errorCodes.UNAUTHORIZED);

  const user = await UserService.verifyAccessToken(accessToken);

  if (!user) throw new CustomError(errorCodes.UNAUTHORIZED);

  req.user = user;
  if (['/auth/logout', '/auth/verify'].includes(req.path)) {
    req.accessToken = accessToken;
  }

  return next();
};

const systemAdminCheck = async (req, res, next) => {
  if (req.user.role !== 'admin') throw new CustomError(errorCodes.FORBIDDEN);

  return next();
};

module.exports = {
  auth: asyncMiddleware(auth),
  systemAdminCheck: asyncMiddleware(systemAdminCheck)
};
