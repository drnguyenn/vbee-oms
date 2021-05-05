const crypto = require('crypto');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');
const asyncMiddleware = require('./async.middlewares');

const signatureVerification = async (req, res, next) => {
  const { GITHUB_WEBHOOK_SECRET } = process.env;
  const signatureHeaderKey = 'x-hub-signature-256';
  const signatureHashAlgorithm = 'sha256';

  const hmac = crypto.createHmac(signatureHashAlgorithm, GITHUB_WEBHOOK_SECRET);
  hmac.update(req.rawBody);

  const calculatedSignature = `${signatureHashAlgorithm}=${hmac.digest('hex')}`;
  const githubSignature = req.headers[signatureHeaderKey];

  if (
    githubSignature.length !== calculatedSignature.length ||
    !crypto.timingSafeEqual(
      Buffer.from(githubSignature),
      Buffer.from(calculatedSignature)
    )
  )
    throw new CustomError(errorCodes.FORBIDDEN, 'Invalid signature');

  return next();
};

module.exports = {
  signatureVerification: asyncMiddleware(signatureVerification)
};
