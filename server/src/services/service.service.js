/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ServiceDao = require('@daos/service.dao');
const ServiceMemberDao = require('@daos/service-member.dao');
const ClusterDao = require('@daos/cluster.dao');
const ClusterMemberDao = require('@daos/cluster-member.dao');

const UserService = require('./user.service');

const get = async (condition, projection) => {
  const service = await ServiceDao.findOne(condition, projection);

  if (!service)
    throw new CustomError(errorCodes.NOT_FOUND, 'Service not found');

  return service;
};

const create = async ({ name, clusterId, ...rest }) => {
  if (!(await ClusterDao.findOne(clusterId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  if (await ServiceDao.findOne({ name }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Service name already exists'
    );

  const service = await ServiceDao.create({
    name,
    cluster: clusterId,
    ...rest
  });

  return service;
};

const update = async (condition, { name, clusterId, ...rest }) => {
  if (clusterId)
    if (!(await ClusterDao.findOne(clusterId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  // Find out whether any service has the same name with the name
  // that is requested to be changed to, except the one that matched the condition
  let conditionAndException;

  if (name)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        name,
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      const conditionAvailableKeys = ['id', 'name'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid service condition'
          );
      });

      conditionAndException = {
        name,
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

  if (await ServiceDao.findOne(conditionAndException))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Service name already exists'
    );

  const service = await ServiceDao.update(condition, {
    name,
    cluster: clusterId,
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

  await ServiceMemberDao.removeAll({ service: service._id });

  return service;
};

const removeAll = async (services = []) => {
  await ServiceMemberDao.removeAll({
    service: {
      $in: services.map(service => service._id)
    }
  });

  const result = await ServiceDao.removeAll({
    _id: {
      $in: services.map(service => service._id)
    }
  });

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

const addMember = async (serviceCondition, memberCondition, { role }) => {
  const service = await get(serviceCondition);

  const user = await UserService.get(memberCondition);

  if (await ServiceMemberDao.findOne({ user: user._id, service: service._id }))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  const member = await ServiceMemberDao.create({
    user: user._id,
    service: service._id,
    role
  });

  await ClusterMemberDao.update({
    user: user._id,
    cluster: service.cluster._id
  });

  return { member, statusCode: 201 };
};

const updateMember = async (serviceCondition, memberCondition, { role }) => {
  const service = await get(serviceCondition);

  const user = await UserService.get(memberCondition);

  const member = await ServiceMemberDao.update(
    { user: user._id, service: service._id },
    { role }
  );

  await ClusterMemberDao.update({
    user: user._id,
    cluster: service.cluster._id
  });

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

  await ServiceMemberDao.removeAll({ user: user._id });

  return { statusCode: 200 };
};

module.exports = {
  get,
  search,
  create,
  update,
  removeOne,
  removeAll,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllServices
};
