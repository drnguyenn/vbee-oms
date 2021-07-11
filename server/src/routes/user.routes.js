const router = require('express').Router();

const asyncMiddleware = require('@middlewares/async.middlewares');

const { auth, systemAdminCheck } = require('@middlewares/auth.middlewares');
const {
  createUserValidator,
  searchUsersValidator,
  updateUserValidator
} = require('@validators/user.validators');

const UserController = require('@controllers/user.controller');

router.get(
  '/users/:id',
  auth,
  systemAdminCheck,
  asyncMiddleware(UserController.getUser)
);

router.get(
  '/users',
  auth,
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

router.patch(
  '/users/:id',
  auth,
  systemAdminCheck,
  updateUserValidator,
  asyncMiddleware(UserController.updateUser)
);

router.delete(
  '/users/:id',
  auth,
  systemAdminCheck,
  asyncMiddleware(UserController.deleteUser)
);

router.delete(
  '/users/:id/clusters',
  auth,
  systemAdminCheck,
  asyncMiddleware(UserController.removeUserFromAllClusters)
);

router.delete(
  '/users/:id/repositories',
  auth,
  systemAdminCheck,
  asyncMiddleware(UserController.removeUserFromAllRepositories)
);

router.delete(
  '/users/:id/services',
  auth,
  systemAdminCheck,
  asyncMiddleware(UserController.removeUserFromAllServices)
);

module.exports = router;
