const {
  Types: { ObjectId }
} = require('mongoose');
const RepositoryModel = require('@models/repository.model');

const create = async data => {
  const repository = await RepositoryModel.create(data);
  return repository;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const repository = await RepositoryModel.findById(
      condition,
      projection
    ).populate({
      path: 'members.details',
      select: 'username email fullName githubId githubUsername avatarUrl'
    });
    return repository;
  }

  if (typeof condition === 'object' && condition) {
    const repository = await RepositoryModel.findOne(condition, projection);
    return repository;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const repositories = await RepositoryModel.find(condition, projection);
  return repositories;
};

const search = async (query, projection = {}) => {
  const repositories = await RepositoryModel.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' }, ...projection }
  ).sort({ score: { $meta: 'textScore' } });
  return repositories;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const repository = await RepositoryModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return repository;
  }

  if (typeof condition === 'object' && condition) {
    const repository = await RepositoryModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return repository;
  }

  return null;
};

const remove = async condition => {
  if (ObjectId.isValid(condition)) {
    const repository = await RepositoryModel.findByIdAndDelete(condition);
    return repository;
  }

  if (typeof condition === 'object' && condition) {
    const repository = await RepositoryModel.findOneAndDelete(condition);
    return repository;
  }

  return null;
};

const addMember = async (repository, member) => {
  repository.members.push(member);
  await repository.save();

  return repository;
};

const updateMember = async (repository, member, data) => {
  repository.members[repository.members.indexOf(member)] = {
    ...member._doc,
    ...data
  };
  await repository.save();

  return repository;
};

const removeMember = async (repository, userId) => {
  repository.members.pull(userId);
  await repository.save();

  return repository;
};

module.exports = {
  create,
  findOne,
  findAll,
  search,
  update,
  remove,
  addMember,
  updateMember,
  removeMember
};
