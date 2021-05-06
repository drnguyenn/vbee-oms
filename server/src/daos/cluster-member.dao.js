const ClusterMemberModel = require('@models/cluster-member.model');

const create = async data => {
  const clusterMember = await ClusterMemberModel.create(data);
  return clusterMember;
};

const findOne = async (condition, projection) => {
  if (typeof condition === 'object' && condition) {
    const clusterMember = await ClusterMemberModel.findOne(
      condition,
      projection
    );
    return clusterMember;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const clusterMembers = await ClusterMemberModel.find(condition, projection);
  return clusterMembers;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  if (typeof condition === 'object' && condition) {
    const clusterMember = await ClusterMemberModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return clusterMember;
  }

  return null;
};

const removeOne = async condition => {
  if (typeof condition === 'object' && condition) {
    const clusterMember = await ClusterMemberModel.findOneAndDelete(condition);
    return clusterMember;
  }

  return null;
};

const removeAll = async condition => {
  const clusterMembers = await ClusterMemberModel.deleteMany(condition);
  return clusterMembers;
};

module.exports = { create, findOne, findAll, update, removeOne, removeAll };
