const router = require('express').Router();

const {
  createGhAppInstallationValidator,
  updateGhAppInstallationValidator
} = require('@validators/gh-app-installation.validators');
const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth } = require('@middlewares/auth.middlewares');

const GhAppInstallationController = require('@controllers/gh-app-installation.controller');

router.get(
  '/gh-app-installations/:id',
  auth,
  asyncMiddleware(GhAppInstallationController.getGhAppInstallation)
);

router.post(
  '/gh-app-installations',
  auth,
  createGhAppInstallationValidator,
  asyncMiddleware(GhAppInstallationController.createGhAppInstallation)
);

router.put(
  '/gh-app-installations/:id',
  auth,
  updateGhAppInstallationValidator,
  asyncMiddleware(GhAppInstallationController.updateGhAppInstallation)
);

router.delete(
  '/gh-app-installations/:id',
  auth,
  asyncMiddleware(GhAppInstallationController.deleteGhAppInstallation)
);

module.exports = router;
