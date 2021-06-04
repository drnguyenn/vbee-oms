const router = require('express').Router();

const {
  searchServersValidator,
  createServerValidator,
  updateServerValidator
} = require('@validators/server.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/user.middlewares');

const ServerController = require('@controllers/server.controller');

router.get('/servers/:id', auth, asyncMiddleware(ServerController.getServer));

router.get(
  '/servers',
  auth,
  systemAdminCheck,
  searchServersValidator,
  asyncMiddleware(ServerController.searchServers)
);

router.post(
  '/servers',
  auth,
  systemAdminCheck,
  createServerValidator,
  asyncMiddleware(ServerController.createServer)
);

router.put(
  '/servers/:id',
  auth,
  updateServerValidator,
  asyncMiddleware(ServerController.updateServer)
);

router.delete(
  '/servers/:id',
  auth,
  asyncMiddleware(ServerController.deleteServer)
);

router.get(
  '/servers/:id/ssl',
  auth,
  asyncMiddleware(ServerController.getAllServerDomainsSslStatus)
);

router.get(
  '/servers/:id/metrics',
  auth,
  asyncMiddleware(ServerController.getServerMetrics)
);

module.exports = router;