const router = require('express').Router();

const {
  searchRepositoriesValidator,
  createRepositoryValidator,
  updateRepositoryValidator,
  addMemberValidator,
  updateMemberValidator,
  updatePRReviewProtectionValidator
} = require('@validators/repository.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/user.middlewares');
const {
  ghAppInstallationToken
} = require('@middlewares/gh-app-installation.middlewares');

const RepositoryController = require('@controllers/repository.controller');

router.get(
  '/repositories/:id',
  auth,
  asyncMiddleware(RepositoryController.getRepository)
);

router.get(
  '/repositories',
  auth,
  systemAdminCheck,
  searchRepositoriesValidator,
  asyncMiddleware(RepositoryController.searchRepositories)
);

router.post(
  '/repositories',
  auth,
  createRepositoryValidator,
  asyncMiddleware(RepositoryController.createRepository)
);

router.put(
  '/repositories/:id',
  auth,
  updateRepositoryValidator,
  asyncMiddleware(RepositoryController.updateRepository)
);

router.delete(
  '/repositories/:id',
  auth,
  asyncMiddleware(RepositoryController.deleteRepository)
);

router.post(
  '/repositories/:id/members/:userId',
  auth,
  addMemberValidator,
  ghAppInstallationToken,
  asyncMiddleware(RepositoryController.addMember)
);

router.put(
  '/repositories/:id/members/:userId',
  auth,
  updateMemberValidator,
  ghAppInstallationToken,
  asyncMiddleware(RepositoryController.updateMember)
);

router.delete(
  '/repositories/:id/members/:userId',
  auth,
  ghAppInstallationToken,
  asyncMiddleware(RepositoryController.removeMember)
);

router.delete(
  '/repositories/members/:userId',
  auth,
  asyncMiddleware(RepositoryController.removeMemberFromAllRepositories)
);

router.patch(
  '/repositories/:id/branches/:branch/protection/required-pull-request-reviews',
  auth,
  updatePRReviewProtectionValidator,
  ghAppInstallationToken,
  asyncMiddleware(RepositoryController.updatePRReviewProtection)
);

module.exports = router;
