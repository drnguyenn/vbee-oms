const router = require('express').Router();

const {
  oAuth2CallbackValidator
} = require('@validators/google-app.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const {
  oAuth2CallbackVerification
} = require('@middlewares/google-app.middlewares');

const GoogleAppController = require('@controllers/google-app.controller');

router.get(
  '/google/oauth2callback',
  oAuth2CallbackValidator,
  oAuth2CallbackVerification,
  asyncMiddleware(GoogleAppController.getAndStoreNewTokens)
);

module.exports = router;
