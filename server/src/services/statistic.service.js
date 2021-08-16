const ClusterService = require('@services/cluster.service');
const ServerService = require('@services/server.service');
const ServiceService = require('@services/service.service');
const RepositoryService = require('@services/repository.service');
const UserService = require('@services/user.service');

const getOverallStatistics = async () => {
  const counts = await Promise.all([
    ClusterService.countAll(),
    ServerService.countAll(),
    ServiceService.countAll(),
    RepositoryService.countAll(),
    UserService.countAll()
  ]);

  return {
    cluster: { count: counts[0] },
    server: { count: counts[1] },
    service: { count: counts[2] },
    repository: { count: counts[3] },
    user: { count: counts[4] }
  };
};

module.exports = { getOverallStatistics };
