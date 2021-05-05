const ClusterService = require('@services/cluster.service');

const getCluster = async (req, res) => {
  const { id } = req.params;

  const cluster = await ClusterService.get(id);

  return res.json({ status: 1, result: { cluster } });
};

const createCluster = async (req, res) => {
  const { name, description } = req.body;

  const cluster = await ClusterService.create({
    name,
    description
  });

  return res.status(201).json({ status: 1, result: { cluster } });
};

const updateCluster = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const { cluster, statusCode } = await ClusterService.update(id, {
    name,
    description
  });

  return res.status(statusCode).json({ status: 1, result: { cluster } });
};

const deleteCluster = async (req, res) => {
  const { id } = req.params;

  const cluster = await ClusterService.remove(id);

  return res.json({ status: 1, result: { cluster } });
};

const searchClusters = async (req, res) => {
  const clusters = await ClusterService.search(req.query);

  return res.json({ status: 1, result: { clusters } });
};

const addMember = async (req, res) => {
  const { id, userId } = req.params;

  const { member, statusCode } = await ClusterService.addMember(
    id,
    userId,
    req.body
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const updateMember = async (req, res) => {
  const { id, userId } = req.params;

  const { member, statusCode } = await ClusterService.updateMember(
    id,
    userId,
    req.body
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  const { member, statusCode } = await ClusterService.removeMember(id, userId);

  return res.json({ status: statusCode < 400 ? 1 : 0, result: { member } });
};

const removeMemberFromAllClusters = async (req, res) => {
  const { userId } = req.params;

  const { statusCode } = await ClusterService.removeMemberFromAllClusters(
    userId
  );

  return res.status(statusCode).json({ status: statusCode < 400 ? 1 : 0 });
};

module.exports = {
  getCluster,
  searchClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllClusters
};
