const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');
const { STATE_TOKENS } = require('@services/google-app.service');
const asyncMiddleware = require('./async.middlewares');

const verifyOAuth2Callback = async (req, res, next) => {
  const { state } = req.query;
  const { requesterId, token } = JSON.parse(state);

  const storedToken = STATE_TOKENS[requesterId];

  if (!requesterId || !token || !storedToken)
    throw new CustomError(errorCodes.UNAUTHORIZED);

  if (STATE_TOKENS[requesterId] !== token)
    throw new CustomError(errorCodes.FORBIDDEN, 'Invalid state token');

  delete STATE_TOKENS[requesterId];

  return next();
};

module.exports = {
  oAuth2CallbackVerification: asyncMiddleware(verifyOAuth2Callback)
};
