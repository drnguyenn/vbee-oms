/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const RepositoryDao = require('@daos/repository.dao');
const { github } = require('@utils/repository.utils');

const UserService = require('./user.service');
const GhAppInstallationService = require('./gh-app-installation.service');

const get = async (condition, projection) => {
  const repository = await RepositoryDao.findOne(condition, projection);

  if (!repository)
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  return repository;
};

const create = async data => {
  if (await RepositoryDao.findOne({ githubId: data.githubId }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      `Repository with GitHub ID "${data.githubId}" already exists`
    );

  const repository = await RepositoryDao.create(data);

  return repository;
};

const update = async (condition, data) => {
  // Find out whether any repository has the same `githubID` with the `githubID`
  // that is requested to be changed to, except the one that matched the `condition`
  let conditionAndException;

  if (data.githubId)
    if (ObjectId.isValid(condition))
      conditionAndException = {
        $or: [{ githubId: data.githubId }],
        $and: [{ _id: { $ne: condition } }]
      };
    else if (typeof condition === 'object' && condition) {
      // Fields that identify instance
      const conditionAvailableKeys = ['_id', 'githubId'];

      Object.keys(condition).forEach(key => {
        if (!conditionAvailableKeys.includes(key))
          throw new CustomError(
            errorCodes.BAD_REQUEST,
            'Invalid repository condition'
          );
      });

      conditionAndException = {
        $or: [{ githubId: data.githubId }],
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
        'Invalid repository condition'
      );

  if (await RepositoryDao.findOne(conditionAndException))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      "Repository's GitHub ID already exists"
    );

  const repository = await RepositoryDao.update(condition, data);

  return {
    statusCode: repository.createdAt === repository.updatedAt ? 201 : 200,
    repository
  };
};

const remove = async condition => {
  const repository = await RepositoryDao.remove(condition);

  if (!repository)
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  return repository;
};

const search = async (
  condition,
  projection = { createdAt: 0, updatedAt: 0 }
) => {
  if (condition.q) {
    const services = await RepositoryDao.search(condition.q, projection);
    return services;
  }

  const services = await RepositoryDao.findAll(condition, projection);
  return services;
};

const addMember = async (
  repoCondition,
  { _id, permission, invitation },
  ghAppInstallationToken
) => {
  let repository = await get(repoCondition);

  const user = await UserService.get(_id);

  if (repository.members.filter(mem => mem._id.equals(_id)).length)
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  if (ghAppInstallationToken) {
    const { name, owner } = repository;

    // Add member to GitHub repository using GitHub API
    const response = await github.addMember(
      ghAppInstallationToken,
      owner,
      name,
      user.githubUsername,
      permission
    );

    if (response.status) {
      if (response.status < 400) {
        const {
          data: { id }
        } = response;

        // Add member to repository in Vbee OMS database
        await RepositoryDao.addMember(repository, {
          _id,
          permission,
          invitation: { githubId: id, status: 'pending' }
        });

        return { repository, statusCode: 201 };
      }

      const { message } = response.data;
      throw new CustomError(response.status, message);
    }
  }

  // Add member to repository in Vbee OMS database
  repository = await RepositoryDao.addMember(repository, {
    _id,
    permission,
    invitation
  });

  return { repository, statusCode: 201 };
};

const updateMember = async (
  repoCondition,
  memberCondition,
  { permission, invitation },
  ghAppInstallationToken
) => {
  let repository = await get(repoCondition);

  const user = await UserService.get(memberCondition);
  const { _id } = user;

  const member = repository.members.filter(mem => mem._id.equals(_id))[0];

  if (!member) {
    if (ghAppInstallationToken) {
      const { name, owner } = repository;

      // Add member to GitHub repository using GitHub API
      const response = await github.addMember(
        ghAppInstallationToken,
        owner,
        name,
        user.githubUsername,
        permission
      );

      if (response.status) {
        if (response.status < 400) {
          const {
            data: { id }
          } = response;

          // Add member to repository in Vbee OMS database
          await RepositoryDao.addMember(repository, {
            _id,
            permission,
            invitation: { githubId: id, status: 'pending' }
          });

          return { repository, statusCode: 201 };
        }

        const { message } = response.data;
        throw new CustomError(response.status, message);
      }
    }

    // Add member to repository in Vbee OMS database
    repository = await RepositoryDao.addMember(repository, {
      _id,
      permission,
      invitation
    });

    return { repository, statusCode: 201 };
  }

  // Update member of GitHub repository using GitHub API
  // if (ghAppInstallationToken) {
  //   const { name, owner } = repository;

  //   await github.updateMember(
  //     ghAppInstallationToken,
  //     owner,
  //     name,
  //     user.githubUsername,
  //     permission
  //   )
  // }

  // Update member of repository in Vbee OMS database
  repository = await RepositoryDao.updateMember(repository, member, {
    invitation: { ...member.invitation, ...invitation }
  });

  return { repository, statusCode: 200 };
};

const removeMember = async (
  repoCondition,
  memberCondition,
  ghAppInstallationToken
) => {
  let repository = await get(repoCondition);

  const user = await UserService.get(memberCondition);
  const { _id } = user;

  if (ghAppInstallationToken) {
    const member = repository.members.filter(mem => mem._id.equals(_id))[0];
    if (!member)
      throw new CustomError(errorCodes.BAD_REQUEST, 'Member not found');

    const { name, owner } = repository;
    const { invitation } = member;

    switch (invitation.status) {
      case 'pending':
        // Delete member invitation of GitHub repository using GitHub API
        await github.deleteInvitation(
          ghAppInstallationToken,
          owner,
          name,
          invitation.githubId
        );
        break;

      case 'accepted':
        // Remove member of GitHub repository using GitHub API
        await github.removeMember(
          ghAppInstallationToken,
          owner,
          name,
          user.githubUsername
        );
        break;

      default:
        break;
    }
  }

  // Remove member of repository from Vbee OMS database
  repository = await RepositoryDao.removeMember(repository, _id);

  return { repository, statusCode: 200 };
};

const removeMemberFromAllRepositories = async memberCondition => {
  const user = await UserService.get(memberCondition);
  const { _id } = user;

  const repositories = await RepositoryDao.findAll(
    { 'members._id': _id },
    'ghAppInstallationId'
  );

  await Promise.all(
    repositories.map(async repository =>
      removeMember(
        repository._id,
        memberCondition,
        await GhAppInstallationService.getGhAppInstallationToken({
          githubId: repository.ghAppInstallationId
        })
      )
    )
  );

  return { statusCode: 200 };
};

const updatePRReviewProtection = async (
  repoCondition,
  branch,
  options,
  ghAppInstallationToken
) => {
  const repository = await get(repoCondition);
  const { owner, name } = repository;

  if (ghAppInstallationToken) {
    const response = await github.updatePRReviewProtection(
      ghAppInstallationToken,
      owner,
      name,
      branch,
      options
    );

    if (response.status) {
      if (response.status < 400) {
        const { data, status } = response;

        return { data, statusCode: status };
      }

      const { message } = response.data;
      throw new CustomError(response.status, message);
    }
  }

  return { statusCode: 204 };
};

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllRepositories,
  updatePRReviewProtection
};
