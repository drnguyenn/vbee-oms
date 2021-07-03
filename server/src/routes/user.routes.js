const router = require('express').Router();

const asyncMiddleware = require('@middlewares/async.middlewares');

const { auth, systemAdminCheck } = require('@middlewares/user.middlewares');
const {
  loginValidator,
  createUserValidator,
  searchUsersValidator
} = require('@validators/user.validators');

const UserController = require('@controllers/user.controller');

router.post(
  '/auth/login',
  loginValidator,
  asyncMiddleware(UserController.login)
);

router.get(
  '/auth/verify',
  auth,
  asyncMiddleware(UserController.verifyAccessToken)
);

router.get(
  '/users',
  auth,
  systemAdminCheck,
  searchUsersValidator,
  asyncMiddleware(UserController.searchUsers)
);

router.post(
  '/users',
  auth,
  systemAdminCheck,
  createUserValidator,
  asyncMiddleware(UserController.createUser)
);

module.exports = router;
