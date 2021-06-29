const {
  Types: { ObjectId }
} = require('mongoose');
const ServerModel = require('@models/server.model');

const create = async data => {
  let server = await ServerModel.create(data);
  server = await server
    .populate({ path: 'cluster', select: 'name' })
    .execPopulate();
  return server;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const server = await ServerModel.findById(condition, projection);
    return server;
  }

  if (typeof condition === 'object' && condition) {
    const server = await ServerModel.findOne(condition, projection);
    return server;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const servers = await ServerModel.find(condition, projection)
    .populate('serviceCount')
    .populate('domainCount')
    .populate({
      path: 'cluster',
      select: 'name'
    });
  return servers;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const server = await ServerModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return server;
  }

  if (typeof condition === 'object' && condition) {
    const server = await ServerModel.findOneAndUpdate(condition, data, options);
    return server;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const server = await ServerModel.findByIdAndDelete(condition);
    return server;
  }

  if (typeof condition === 'object' && condition) {
    const server = await ServerModel.findOneAndDelete(condition);
    return server;
  }

  return null;
};

const removeMany = async condition => {
  const servers = await ServerModel.deleteMany(condition);
  return servers;
};

module.exports = {
  create,
  findOne,
  findAll,
  update,
  removeOne,
  removeMany
};
