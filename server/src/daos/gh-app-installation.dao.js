const {
  Types: { ObjectId }
} = require('mongoose');
const GhAppInstallationModel = require('@models/gh-app-installation.model');

const create = async data => {
  const ghAppInstallation = await GhAppInstallationModel.create(data);
  return ghAppInstallation;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const ghAppInstallation = await GhAppInstallationModel.findById(
      condition,
      projection
    );
    return ghAppInstallation;
  }

  if (typeof condition === 'object' && condition) {
    const ghAppInstallation = await GhAppInstallationModel.findOne(
      condition,
      projection
    );
    return ghAppInstallation;
  }

  return null;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const ghAppInstallation = await GhAppInstallationModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return ghAppInstallation;
  }

  if (typeof condition === 'object' && condition) {
    const ghAppInstallation = await GhAppInstallationModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return ghAppInstallation;
  }

  return null;
};

const remove = async condition => {
  if (ObjectId.isValid(condition)) {
    const ghAppInstallation = await GhAppInstallationModel.findByIdAndDelete(
      condition
    );
    return ghAppInstallation;
  }

  if (typeof condition === 'object' && condition) {
    const ghAppInstallation = await GhAppInstallationModel.findOneAndDelete(
      condition
    );
    return ghAppInstallation;
  }

  return null;
};

module.exports = {
  create,
  findOne,
  update,
  remove
};
