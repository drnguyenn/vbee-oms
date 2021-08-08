/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ServiceDao = require('@daos/service.dao');
const ServiceMemberDao = require('@daos/service-member.dao');
const ClusterDao = require('@daos/cluster.dao');
const ServerDao = require('@daos/server.dao');
const RepositoryDao = require('@daos/repository.dao');

const UserService = require('./user.service');

const get = async (condition, projection) => {
  const service = await ServiceDao.findOne(condition, projection);

  if (!service)
    throw new CustomError(errorCodes.NOT_FOUND, 'Service not found');

  return service;
};

const create = async ({ name, clusterId, serverId, repositoryId, ...rest }) => {
  if (await ServiceDao.findOne({ name }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Service with name "${name}" already exists`
    );

  if (!(await ClusterDao.findOne(clusterId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  if (serverId) {
    const server = await ServerDao.findOne(serverId);
    if (!server)
      throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

    const servers = await ServerDao.findAll({ cluster: clusterId }, '_id');
    if (!servers.map(({ _id }) => _id.toString()).includes(serverId))
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `Server "${server.name}" does not belong to the specified cluster`
      );
  }

  if (repositoryId && !(await RepositoryDao.findOne(repositoryId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  const service = await ServiceDao.create({
    name,
    cluster: clusterId,
    server: serverId,
    repository: repositoryId || null,
    ...rest
  });

  return service;
};

const update = async (
  condition,
  { name, clusterId, serverId, repositoryId, ...rest }
) => {
  // Find out whether any service has the same `name` with the `name`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;
  const orCondition = [];

  if (name) orCondition.push({ name });

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
            'Invalid service condition'
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
        'Invalid service condition'
      );

  let service = await ServiceDao.findOne(conditionAndException);
  if (service) {
    if (service.name === name)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `Service with name "${name}" already exists`
      );
  }

  if (clusterId && !(await ClusterDao.findOne(clusterId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  if (serverId) {
    const server = await ServerDao.findOne(serverId);
    if (!server)
      throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

    const servers = await ServerDao.findAll({ cluster: clusterId }, '_id');
    if (!servers.map(({ _id }) => _id.toString()).includes(serverId))
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `Server "${server.name}" does not belong to the specified cluster`
      );
  }

  if (repositoryId && !(await RepositoryDao.findOne(repositoryId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  service = await ServiceDao.update(condition, {
    name,
    cluster: clusterId,
    server: serverId || null,
    repository: repositoryId || null,
    ...rest
  });

  return {
    statusCode: service.createdAt === service.updatedAt ? 201 : 200,
    service
  };
};

const removeOne = async condition => {
  const service = await ServiceDao.removeOne(condition);

  if (!service)
    throw new CustomError(errorCodes.NOT_FOUND, 'Service not found');

  await ServiceMemberDao.removeMany({ service: service._id });

  return service;
};

const removeMany = async (serviceIds = []) => {
  await ServiceMemberDao.removeMany({ service: { $in: serviceIds } });

  const result = await ServiceDao.removeMany({ _id: { $in: serviceIds } });

  return result;
};

const search = async (
  condition,
  projection = { server: 0, docs: 0, createdAt: 0, updatedAt: 0 }
) => {
  if (condition.q) {
    const services = await ServiceDao.search(condition.q, projection);
    return services;
  }

  const services = await ServiceDao.findAll(condition, projection);
  return services;
};

const countAll = async () => {
  const serviceCount = await ServiceDao.countAll();
  return serviceCount;
};

const addMember = async (serviceCondition, memberCondition, data) => {
  const service = await get(serviceCondition);

  const user = await UserService.get(memberCondition);

  if (await ServiceMemberDao.findOne({ user: user._id, service: service._id }))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  const member = await ServiceMemberDao.create({
    user: user._id,
    service: service._id,
    ...data
  });

  return { member, statusCode: 201 };
};

const updateMember = async (serviceCondition, memberCondition, data) => {
  const service = await get(serviceCondition);

  const user = await UserService.get(memberCondition);

  const member = await ServiceMemberDao.update(
    { user: user._id, service: service._id },
    data
  );

  return {
    member,
    statusCode: member.createdAt === member.updatedAt ? 201 : 200
  };
};

const removeMember = async (serviceCondition, memberCondition) => {
  const service = await get(serviceCondition);

  const user = await UserService.get(memberCondition);

  const member = await ServiceMemberDao.removeOne({
    user: user._id,
    service: service._id
  });

  if (!member) throw new CustomError(errorCodes.NOT_FOUND, 'Member not found');

  return { member, statusCode: 200 };
};

const removeMemberFromAllServices = async memberCondition => {
  const user = await UserService.get(memberCondition);

  await ServiceMemberDao.removeMany({ user: user._id });

  return { statusCode: 200 };
};

module.exports = {
  get,
  search,
  create,
  update,
  removeOne,
  removeMany,
  countAll,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllServices
};
