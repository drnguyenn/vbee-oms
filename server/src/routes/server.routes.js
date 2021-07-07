const router = require('express').Router();

const {
  searchServersValidator,
  createServerValidator,
  updateServerValidator,
  getServersMetricsValidator
} = require('@validators/server.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/auth.middlewares');

const ServerController = require('@controllers/server.controller');

router.get(
  '/servers/metrics',
  auth,
  getServersMetricsValidator,
  asyncMiddleware(ServerController.getMetrics)
);

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

module.exports = router;
