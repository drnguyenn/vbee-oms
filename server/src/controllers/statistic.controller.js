const StatisticService = require('@services/statistic.service');

const getOverallStatistics = async (req, res) => {
  return res.json({
    status: 1,
    result: await StatisticService.getOverallStatistics()
  });
};

module.exports = { getOverallStatistics };
