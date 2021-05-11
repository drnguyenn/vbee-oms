/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const GhAppInstallationDao = require('@daos/gh-app-installation.dao');

const { generateGhAppInstallationToken } = require('@utils/gh-app.utils');

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
      "GitHub app installation's GitHub ID already exists"
    );

  const ghAppInstallation = await GhAppInstallationDao.create(data);

  return ghAppInstallation;
};

const update = async (condition, data) => {
  // Find out whether any GitHub app installation has the same GithubID with the GithubID
  // that is requested to be changed to, except the one that matched the condition
  let conditionAndException;

  if (ObjectId.isValid(condition))
    conditionAndException = {
      githubId: data.githubId,
      $and: [{ _id: { $ne: condition } }]
    };
  else if (typeof condition === 'object' && condition)
    conditionAndException = {
      githubId: data.githubId,
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
  else
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Invalid GitHub app installation condition'
    );

  if (await GhAppInstallationDao.findOne(conditionAndException))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      "GitHub app installation's GitHub ID already exists"
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

const getGhAppInstallationToken = async installationCondition => {
  const { accessToken, githubId } = await get(installationCondition);

  if (accessToken)
    if (Date.now() < new Date(accessToken.expiresAt).getTime()) {
      return accessToken.token;
    }

  const newGhAppInstallationToken = await generateGhAppInstallationToken(
    githubId
  );
  await update({ githubId }, { accessToken: newGhAppInstallationToken });

  return newGhAppInstallationToken.token;
};

module.exports = {
  get,
  create,
  update,
  remove,
  getGhAppInstallationToken
};
