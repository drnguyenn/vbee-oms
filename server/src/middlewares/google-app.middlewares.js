const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');
const { STATE_TOKENS } = require('@services/google-app.service');
const asyncMiddleware = require('./async.middlewares');

const verifyOAuth2Callback = async (req, res, next) => {
  const { state } = req.query;
  const { userId, token } = JSON.parse(state);

  const storedToken = STATE_TOKENS[userId];

  if (!userId || !token || !storedToken)
    throw new CustomError(errorCodes.UNAUTHORIZED);

  if (STATE_TOKENS[userId] !== token)
    throw new CustomError(errorCodes.FORBIDDEN, 'Invalid state token');

  delete STATE_TOKENS[userId];

  return next();
};

module.exports = {
  oAuth2CallbackVerification: asyncMiddleware(verifyOAuth2Callback)
};
