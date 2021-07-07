const router = require('express').Router();

const asyncMiddleware = require('@middlewares/async.middlewares');

const { auth } = require('@middlewares/auth.middlewares');

const { loginValidator } = require('@validators/auth.validators');

const AuthController = require('@controllers/auth.controller');

router.post(
  '/auth/login',
  loginValidator,
  asyncMiddleware(AuthController.login)
);

router.get(
  '/auth/verify',
  auth,
  asyncMiddleware(AuthController.verifyAccessToken)
);

module.exports = router;
