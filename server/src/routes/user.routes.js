const router = require('express').Router();

const asyncMiddleware = require('../middlewares/async.middlewares');

const { auth, systemAdminCheck } = require('../middlewares/user.middlewares');
const {
  loginValidator,
  registerValidator,
  searchUsersValidator
} = require('../validators/user.validators');

const UserController = require('../controllers/user.controller');

router.post(
  '/auth/register',
  auth,
  systemAdminCheck,
  registerValidator,
  asyncMiddleware(UserController.register)
);

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

module.exports = router;
