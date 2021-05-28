/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');
const { Client } = require('@elastic/elasticsearch');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ServerDao = require('@daos/server.dao');
const ServiceDao = require('@daos/server.dao');
const DomainDao = require('@daos/domain.dao');

const { checkDomainsSslStatus } = require('@utils/domain.utils');

const get = async (condition, projection) => {
  const server = await ServerDao.findOne(condition, projection);

  if (!server) throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  return server;
};

const create = async ({ ipAddress, serverId, ...rest }) => {
  if (ipAddress)
    if (await ServerDao.findOne({ ipAddress }))
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        `Server with IP address "${ipAddress}" already exists`
      );

  if (serverId)
    if (!(await ServiceDao.findOne(serverId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Service not found');

  const server = await ServerDao.create({
    ipAddress,
    server: serverId,
    ...rest
  });

  return server;
};

const update = async (condition, { ipAddress, serverId, ...rest }) => {
  if (serverId)
    if (!(await ServiceDao.findOne(serverId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Service not found');

  // Find out whether any server has the same `ipAddress` with the `ipAddress`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;

  if (ipAddress)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        ipAddress,
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'ipAddress'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid server condition'
          );
      });

      conditionAndException = {
        ipAddress,
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
    ipAddress,
    server: serverId,
    ...rest
  });

  return {
    statusCode: server.createdAt === server.updatedAt ? 201 : 200,
    server
  };
};

const removeOne = async condition => {
  const server = await ServerDao.removeOne(condition);

  if (!server) throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  await DomainDao.removeAll({ server: server._id });

  return server;
};

const removeAll = async (servers = []) => {
  const result = await ServerDao.removeAll({
    _id: {
      $in: servers.map(server => server._id)
    }
  });

  await DomainDao.removeAll({
    server: {
      $in: servers.map(server => server._id)
    }
  });

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

const getServerMetrics = async serverCondition => {
  await get(serverCondition);

  const client = new Client({
    node: 'http://elasticsearch:9200',
    auth: {
      username: 'elastic',
      password: 'changeme'
    }
  });

  const { body } = await client.search({
    index: 'metricbeat-*',
    body: {
      sort: [
        {
          timestamp: {
            order: 'desc'
          }
        }
      ],
      size: 1
    }
  });

  return body.hits.hits;
};

module.exports = {
  get,
  search,
  create,
  update,
  removeOne,
  removeAll,
  getAllServerDomainsSslStatus,
  getServerMetrics
};
