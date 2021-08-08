/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ClusterDao = require('@daos/cluster.dao');
const ClusterMemberDao = require('@daos/cluster-member.dao');
const DiagramDao = require('@daos/diagram.dao');

const UserService = require('./user.service');
const ServerService = require('./server.service');
const DiagramService = require('./diagram.service');

const get = async (condition, projection) => {
  const cluster = await ClusterDao.findOne(condition, projection);

  if (!cluster)
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  return cluster;
};

const create = async data => {
  if (await ClusterDao.findOne({ name: data.name }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Cluster with name "${data.name}" already exists`
    );

  const cluster = await ClusterDao.create(data);

  await DiagramDao.create({ cluster: cluster._id });

  return cluster;
};

const update = async (condition, data) => {
  // Find out whether any cluster has the same `name` with the `name`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;

  const orCondition = [];

  if (data.name) orCondition.push({ name: data.name });

  if (orCondition.length)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        $or: orCondition,
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'name'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid cluster condition'
          );
      });

      conditionAndException = {
        $or: orCondition,
        $and: [
          Object.keys(condition).reduce(
            (accumulator, currentValue) => ({
              ...accumulator,
              [currentValue]: { $ne: condition[currentValue] }
            }),
            {}
          )
        ]
      };
    } else
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Invalid cluster condition'
      );

  let cluster = await ClusterDao.findOne(conditionAndException);
  if (cluster) {
    if (cluster.name === data.name)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `Cluster with name "${data.name}" already exists`
      );
  }

  cluster = await ClusterDao.update(condition, data);

  await DiagramDao.update({ cluster: cluster._id }, {});

  return {
    statusCode: cluster.createdAt === cluster.updatedAt ? 201 : 200,
    cluster
  };
};

const remove = async condition => {
  const cluster = await ClusterDao.remove(condition);

  if (!cluster)
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  const { _id, servers } = cluster;

  await ClusterMemberDao.removeMany({ cluster: _id });

  await DiagramService.remove({ cluster: _id });

  if (servers.length)
    await ServerService.removeMany(servers.map(server => server._id));

  return cluster;
};

const search = async (condition, projection = { name: 1, description: 1 }) => {
  if (condition.q) {
    const clusters = await ClusterDao.search(condition.q, projection);
    return clusters;
  }

  const clusters = await ClusterDao.findAll(condition, projection);
  return clusters;
};

const countAll = async () => {
  const clusterCount = await ClusterDao.countAll();
  return clusterCount;
};

const addMember = async (clusterCondition, memberCondition, data) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  if (await ClusterMemberDao.findOne({ user: user._id, cluster: cluster._id }))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  const member = await ClusterMemberDao.create({
    user: user._id,
    cluster: cluster._id,
    ...data
  });

  return { member, statusCode: 201 };
};

const updateMember = async (clusterCondition, memberCondition, data) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  const member = await ClusterMemberDao.update(
    { user: user._id, cluster: cluster._id },
    data
  );

  return {
    member,
    statusCode: member.createdAt === member.updatedAt ? 201 : 200
  };
};

const removeMember = async (clusterCondition, memberCondition) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  const member = await ClusterMemberDao.removeOne({
    user: user._id,
    cluster: cluster._id
  });

  if (!member) throw new CustomError(errorCodes.NOT_FOUND, 'Member not found');

  return { member, statusCode: 200 };
};

const removeMemberFromAllClusters = async memberCondition => {
  const user = await UserService.get(memberCondition);

  await ClusterMemberDao.removeMany({ user: user._id });

  return { statusCode: 200 };
};

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  countAll,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllClusters
};
