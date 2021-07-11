/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const GhAppInstallationDao = require('@daos/gh-app-installation.dao');

const GitHub = require('@utils/github.utils');

const get = async (condition, projection) => {
  const ghAppInstallation = await GhAppInstallationDao.findOne(
    condition,
    projection
  );

  if (!ghAppInstallation)
    throw new CustomError(
      errorCodes.NOT_FOUND,
      'GitHub app installation not found'
    );

  return ghAppInstallation;
};

const create = async data => {
  if (await GhAppInstallationDao.findOne({ githubId: data.githubId }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `GitHub app installation with GitHub ID "${data.githubId}" already exists`
    );

  const ghAppInstallation = await GhAppInstallationDao.create(data);

  return ghAppInstallation;
};

const update = async (condition, data) => {
  // Find out whether any GitHub app installation has the same `githubID` with the `githubID`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;
  const orCondition = [];

  if (data.githubId) orCondition.push({ githubId: data.githubId });

  if (orCondition.length)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        $or: orCondition,
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'githubId'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid GitHub App installation condition'
          );
      });

      conditionAndException = {
        $or: orCondition,
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
        'Invalid GitHub app installation condition'
      );

  if (await GhAppInstallationDao.findOne(conditionAndException))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'GitHub app installation already exists'
    );

  const ghAppInstallation = await GhAppInstallationDao.update(condition, data);

  return {
    statusCode:
      ghAppInstallation.createdAt === ghAppInstallation.updatedAt ? 201 : 200,
    ghAppInstallation
  };
};

const remove = async condition => {
  const ghAppInstallation = await GhAppInstallationDao.remove(condition);

  if (!ghAppInstallation)
    throw new CustomError(
      errorCodes.NOT_FOUND,
      'GitHub app installation not found'
    );

  return ghAppInstallation;
};

const search = async (
  condition,
  projection = { createdAt: 0, updatedAt: 0 }
) => {
  const getGhAppInstallations = await GhAppInstallationDao.findAll(
    condition,
    projection
  );
  return getGhAppInstallations;
};

const getGhAppInstallationToken = async installationCondition => {
  const { accessToken, githubId } = await get(installationCondition);

  if (accessToken)
    if (Date.now() < new Date(accessToken.expiresAt).getTime()) {
      return accessToken.token;
    }

  const newGhAppInstallationToken =
    await GitHub.app.createGhAppInstallationToken(githubId);
  await update({ githubId }, { accessToken: newGhAppInstallationToken });

  return newGhAppInstallationToken.token;
};

module.exports = {
  get,
  create,
  update,
  remove,
  search,
  getGhAppInstallationToken
};
