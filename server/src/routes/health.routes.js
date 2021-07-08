const router = require('express').Router();

const asyncMiddleware = require('@middlewares/async.middlewares');

const HealthController = require('@controllers/health.controller');

router.get(
  ['/', '/healthcheck'],
  asyncMiddleware(HealthController.checkServerHealth)
);

module.exports = router;
