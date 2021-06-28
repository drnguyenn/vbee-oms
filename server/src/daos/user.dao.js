const {
  Types: { ObjectId }
} = require('mongoose');
const UserModel = require('@models/user.model');

const create = async data => {
  const user = await UserModel.create(data);
  return user;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const user = await UserModel.findById(condition, projection);
    return user;
  }

  if (typeof condition === 'object' && condition) {
    const user = await UserModel.findOne(condition, projection);
    return user;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const users = await UserModel.find(condition, projection);
  return users;
};

const search = async (query, projection = '') => {
  const users = await UserModel.find({ $text: { $search: query } }, projection);
  return users;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const user = await UserModel.findByIdAndUpdate(condition, data, options);
    return user;
  }

  if (typeof condition === 'object' && condition) {
    const user = await UserModel.findOneAndUpdate(condition, data, options);
    return user;
  }

  return null;
};

const remove = async condition => {
  if (ObjectId.isValid(condition)) {
    const user = await UserModel.findByIdAndDelete(condition);
    return user;
  }

  if (typeof condition === 'object' && condition) {
    const user = await UserModel.findOneAndDelete(condition);
    return user;
  }

  return null;
};

module.exports = { create, findOne, findAll, search, update, remove };
