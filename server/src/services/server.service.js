/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ServerDao = require('@daos/server.dao');
const DomainDao = require('@daos/domain.dao');
const ClusterDao = require('@daos/cluster.dao');

const ServiceService = require('@services/service.service');

const { checkDomainsSslStatus } = require('@utils/domain.utils');
const { getServerMetrics } = require('@utils/server.utils');

const get = async (condition, projection) => {
  const server = await ServerDao.findOne(condition, projection);

  if (!server) throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  return server;
};

const create = async ({
  name,
  ipAddress,
  macAddress,
  clusterId,
  domains = [],
  ...rest
}) => {
  if (await ServerDao.findOne({ name }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Server with name "${name}" already exists`
    );

  if (await ServerDao.findOne({ ipAddress }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Server with IP address "${ipAddress}" already exists`
    );

  if (await ServerDao.findOne({ macAddress }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Server with MAC address "${macAddress}" already exists`
    );

  if (clusterId)
    if (!(await ClusterDao.findOne(clusterId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  const existDomains = await DomainDao.findAll(
    { value: { $in: domains } },
    'value'
  );

  if (existDomains.length)
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Domains already exist:${existDomains.map(({ value }) => ` ${value}`)}`
    );

  let server = await ServerDao.create({
    name,
    ipAddress,
    macAddress,
    cluster: clusterId,
    ...rest
  });

  await DomainDao.create(
    domains.map(domain => ({
      server: server._id,
      value: domain
    }))
  );

  server = await server.populate('domainCount').execPopulate();

  return server;
};

const update = async (
  condition,
  { name, ipAddress, macAddress, clusterId, domains = [], ...rest }
) => {
  if (clusterId)
    if (!(await ClusterDao.findOne(clusterId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  // Find out whether any server has the same `ipAddress` with the `ipAddress`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;

  if (name || ipAddress || macAddress)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        $or: [{ name }, { ipAddress }, { macAddress }],
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'name', 'ipAddress', 'macAddress'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid server condition'
          );
      });

      conditionAndException = {
        $or: [{ name }, { ipAddress }, { macAddress }],
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
      throw new CustomError(errorCodes.BAD_REQUEST, 'Invalid server condition');

  if (await ServerDao.findOne(conditionAndException))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Server already exists');

  const server = await ServerDao.update(condition, {
    name,
    ipAddress,
    macAddress,
    cluster: clusterId,
    ...rest
  });

  await DomainDao.create(
    domains.map(domain => ({
      server: server._id,
      value: domain
    }))
  );

  return {
    statusCode: server.createdAt === server.updatedAt ? 201 : 200,
    server
  };
};

const removeOne = async condition => {
  const server = await ServerDao.removeOne(condition);

  if (!server) throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  const { _id, services } = server;

  await DomainDao.removeMany({ server: _id });

  if (services.length)
    await ServiceService.removeMany(services.map(service => service._id));

  return server;
};

const removeMany = async (serverIds = []) => {
  const result = await ServerDao.removeMany({ _id: { $in: serverIds } });

  await DomainDao.removeMany({ server: { $in: serverIds } });

  const services = await ServiceService.search(
    { server: { $in: serverIds } },
    '_id'
  );
  if (services.length)
    await ServiceService.removeMany(services.map(service => service._id));

  return result;
};

const search = async (
  condition,
  projection = { createdAt: 0, updatedAt: 0 }
) => {
  const servers = await ServerDao.findAll(condition, projection);
  return servers;
};

const getAllServerDomainsSslStatus = async serverCondition => {
  const server = await get(serverCondition);

  return {
    domains: await checkDomainsSslStatus(
      server.domains.map(domain => domain.value)
    )
  };
};

const getMetrics = async (serverIds = []) => {
  const servers = await ServerDao.findAll(
    {
      _id: {
        $in: serverIds
      }
    },
    '_id macAddress'
  );

  const metrics = await Promise.all(
    servers.map(({ macAddress }) => getServerMetrics(macAddress))
  );

  return servers.reduce(
    (accumulator, { _id }, currentIndex) => ({
      ...accumulator,
      [_id]: { ...metrics[currentIndex] }
    }),
    {}
  );
};

module.exports = {
  get,
  search,
  create,
  update,
  removeOne,
  removeMany,
  getAllServerDomainsSslStatus,
  getMetrics
};
