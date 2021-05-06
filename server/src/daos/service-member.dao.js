const ServiceMemberModel = require('@models/service-member.model');

const create = async data => {
  const serviceMember = await ServiceMemberModel.create(data);
  return serviceMember;
};

const findOne = async (condition, projection) => {
  if (typeof condition === 'object' && condition) {
    const serviceMember = await ServiceMemberModel.findOne(
      condition,
      projection
    );
    return serviceMember;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const serviceMembers = await ServiceMemberModel.find(condition, projection);
  return serviceMembers;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  if (typeof condition === 'object' && condition) {
    const serviceMember = await ServiceMemberModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return serviceMember;
  }

  return null;
};

const removeOne = async condition => {
  if (typeof condition === 'object' && condition) {
    const serviceMember = await ServiceMemberModel.findOneAndDelete(condition);
    return serviceMember;
  }

  return null;
};

const removeAll = async condition => {
  const serviceMembers = await ServiceMemberModel.deleteMany(condition);
  return serviceMembers;
};

module.exports = { create, findOne, findAll, update, removeOne, removeAll };
