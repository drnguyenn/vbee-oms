const {
  Types: { ObjectId }
} = require('mongoose');
const ClusterModel = require('../models/cluster.model');

const create = async data => {
  const cluster = await ClusterModel.create(data);
  return cluster;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const cluster = await ClusterModel.findById(condition, projection);
    return cluster;
  }

  if (typeof condition === 'object' && condition) {
    const cluster = await ClusterModel.findOne(condition, projection);
    return cluster;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const clusters = await ClusterModel.find(condition, projection);
  return clusters;
};

const search = async (query, projection = {}) => {
  const clusters = await ClusterModel.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' }, ...projection }
  ).sort({ score: { $meta: 'textScore' } });
  return clusters;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const cluster = await ClusterModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return cluster;
  }

  if (typeof condition === 'object' && condition) {
    const cluster = await ClusterModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return cluster;
  }

  return null;
};

const remove = async condition => {
  if (ObjectId.isValid(condition)) {
    const cluster = await ClusterModel.findByIdAndDelete(condition);
    return cluster;
  }

  if (typeof condition === 'object' && condition) {
    const cluster = await ClusterModel.findOneAndDelete(condition);
    return cluster;
  }

  return null;
};

module.exports = {
  create,
  findOne,
  findAll,
  search,
  update,
  remove
};
