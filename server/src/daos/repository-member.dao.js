const RepositoryMemberModel = require('@models/repository-member.model');

const create = async data => {
  const repositoryMember = await RepositoryMemberModel.create(data);
  return repositoryMember;
};

const findOne = async (condition, projection) => {
  if (typeof condition === 'object' && condition) {
    const repositoryMember = await RepositoryMemberModel.findOne(
      condition,
      projection
    );
    return repositoryMember;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const repositoryMembers = await RepositoryMemberModel.find(
    condition,
    projection
  );
  return repositoryMembers;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (typeof condition === 'object' && condition) {
    const repositoryMember = await RepositoryMemberModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return repositoryMember;
  }

  return null;
};

const removeOne = async condition => {
  if (typeof condition === 'object' && condition) {
    const repositoryMember = await RepositoryMemberModel.findOneAndDelete(
      condition
    );
    return repositoryMember;
  }

  return null;
};

const removeMany = async condition => {
  const repositoryMembers = await RepositoryMemberModel.deleteMany(condition);
  return repositoryMembers;
};

module.exports = { create, findOne, findAll, update, removeOne, removeMany };
