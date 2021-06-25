const {
  Types: { ObjectId }
} = require('mongoose');
const ServiceModel = require('@models/service.model');

const create = async data => {
  let service = await ServiceModel.create(data);
  service = await service
    .populate({ path: 'cluster', select: 'name' })
    .execPopulate();
  return service;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const service = await ServiceModel.findById(condition, projection);
    return service;
  }

  if (typeof condition === 'object' && condition) {
    const service = await ServiceModel.findOne(condition, projection);
    return service;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const services = await ServiceModel.find(condition, projection)
    .populate('memberCount')
    .populate('repositoryCount')
    .populate({
      path: 'cluster',
      select: 'name'
    });
  return services;
};

const search = async (query, projection = {}) => {
  const services = await ServiceModel.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' }, ...projection }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate({ path: 'cluster', select: 'name' });
  return services;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const service = await ServiceModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return service;
  }

  if (typeof condition === 'object' && condition) {
    const service = await ServiceModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return service;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const service = await ServiceModel.findByIdAndDelete(condition);
    return service;
  }

  if (typeof condition === 'object' && condition) {
    const service = await ServiceModel.findOneAndDelete(condition);
    return service;
  }

  return null;
};

const removeAll = async condition => {
  const services = await ServiceModel.deleteMany(condition);
  return services;
};

module.exports = {
  create,
  findOne,
  findAll,
  search,
  update,
  removeOne,
  removeAll
};
