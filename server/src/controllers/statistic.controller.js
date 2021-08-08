const ClusterService = require('@services/cluster.service');
const ServerService = require('@services/server.service');
const ServiceService = require('@services/service.service');
const RepositoryService = require('@services/repository.service');
const UserService = require('@services/user.service');

const getOverallStatistics = async (req, res) => {
  return res.json({
    status: 1,
    result: {
      cluster: {
        count: await ClusterService.countAll()
      },
      server: {
        count: await ServerService.countAll()
      },
      service: {
        count: await ServiceService.countAll()
      },
      repository: {
        count: await RepositoryService.countAll()
      },
      user: {
        count: await UserService.countAll()
      }
    }
  });
};

module.exports = { getOverallStatistics };
