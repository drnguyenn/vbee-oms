/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const DomainDao = require('@daos/domain.dao');
const ServerDao = require('@daos/server.dao');

const { checkDomainsSslStatus } = require('@utils/domain.utils');

const get = async (condition, projection) => {
  const domain = await DomainDao.findOne(condition, projection);

  if (!domain) throw new CustomError(errorCodes.NOT_FOUND, 'Domain not found');

  return domain;
};

const create = async ({ serverId, domains }) => {
  if (!(await ServerDao.findOne(serverId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  const existDomains = await DomainDao.findAll(
    { value: { $in: domains } },
    'value'
  );

  if (existDomains.length)
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Domains already exist:${existDomains.map(({ value }) => ` ${value}`)}`
    );

  const newDomains = await DomainDao.create(
    domains.map(domain => ({
      server: serverId,
      value: domain
    }))
  );

  return newDomains;
};

const update = async (condition, { serverId, value, ...rest }) => {
  if (serverId)
    if (!(await ServerDao.findOne(serverId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Server not found');

  // Find out whether any domain has the same `value` with the `value`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;

  if (value)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        $or: [{ value }],
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'value'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid domain condition.\nDomain condition can only be either a MongoDB ObjectID or an object containing "_id" or "value" field.'
          );
      });

      conditionAndException = {
        $or: [{ value }],
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
        'Invalid domain condition.\nDomain condition can only be either a MongoDB ObjectID or an object containing "_id" or "value" field.'
      );

  if (await DomainDao.findOne(conditionAndException))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Domain already exists');

  const domain = await DomainDao.update(condition, {
    server: serverId,
    value,
    ...rest
  });

  return {
    domain,
    statusCode: domain.createdAt === domain.updatedAt ? 201 : 200
  };
};

const removeOne = async condition => {
  const domain = await DomainDao.removeOne(condition);

  if (!domain) throw new CustomError(errorCodes.NOT_FOUND, 'Domain not found');

  return domain;
};

const removeMany = async (domainIds = []) => {
  const result = await DomainDao.removeMany({ _id: { $in: domainIds } });

  return result;
};

const search = async (
  condition,
  projection = { createdAt: 0, updatedAt: 0 }
) => {
  const domains = await DomainDao.findAll(condition, projection);
  return domains;
};

const getSslStatus = async domains => {
  const results = await checkDomainsSslStatus(domains);

  return results;
};

module.exports = {
  get,
  search,
  create,
  update,
  removeOne,
  removeMany,
  getSslStatus
};
