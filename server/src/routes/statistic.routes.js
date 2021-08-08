const router = require('express').Router();

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/auth.middlewares');

const StatisticController = require('@controllers/statistic.controller');

router.get(
  '/statistics',
  auth,
  systemAdminCheck,
  asyncMiddleware(StatisticController.getOverallStatistics)
);

module.exports = router;
