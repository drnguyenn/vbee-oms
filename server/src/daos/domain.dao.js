const {
  Types: { ObjectId }
} = require('mongoose');
const DomainModel = require('@models/domain.model');

const create = async data => {
  const domain = await DomainModel.create(data);
  return domain;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const domain = await DomainModel.findById(condition, projection);
    return domain;
  }

  if (typeof condition === 'object' && condition) {
    const domain = await DomainModel.findOne(condition, projection);
    return domain;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const domains = await DomainModel.find(condition, projection);
  return domains;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const domain = await DomainModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return domain;
  }

  if (typeof condition === 'object' && condition) {
    const domain = await DomainModel.findOneAndUpdate(condition, data, options);
    return domain;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const domain = await DomainModel.findByIdAndDelete(condition);
    return domain;
  }

  if (typeof condition === 'object' && condition) {
    const domain = await DomainModel.findOneAndDelete(condition);
    return domain;
  }

  return null;
};

const removeMany = async condition => {
  const domains = await DomainModel.deleteMany(condition);
  return domains;
};

module.exports = {
  create,
  findOne,
  findAll,
  update,
  removeOne,
  removeMany
};
