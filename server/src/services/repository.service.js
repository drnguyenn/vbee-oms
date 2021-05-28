/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');
const snakecaseKeys = require('snakecase-keys');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const { GITHUB_API, GITHUB_REPOSITORY_PERMISSIONS } = require('@constants');

const customAxios = require('@customs/axios.custom');

const RepositoryDao = require('@daos/repository.dao');

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
        githubId: data.githubId,
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
  let repository;

  if (!ghAppInstallationToken) repository = await get(repoCondition);

  const user = await UserService.get(_id);

  if (repository.members.filter(mem => mem._id.equals(_id)).length)
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  if (ghAppInstallationToken) {
    const { name, owner } = repository;

    try {
      // Add member to GitHub repository using GitHub API
      const response = await customAxios({
        method: 'PUT',
        url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/collaborators/${user.githubUsername}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: GITHUB_API.HEADERS.ACCEPT,
          Authorization: `token ${ghAppInstallationToken}`
        },
        data: { permission: GITHUB_REPOSITORY_PERMISSIONS[permission] }
      });
      const {
        data: { id },
        status
      } = response;

      // Add member to repository in Vbee OMS database
      await RepositoryDao.addMember(repository, {
        _id,
        permission,
        invitation: { githubId: id, status: 'pending' }
      });

      return { repository, statusCode: status };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
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
  let repository;

  if (!ghAppInstallationToken) repository = await get(repoCondition);

  const user = await UserService.get(memberCondition);
  const { _id } = user;

  const member = repository.members.filter(mem => mem._id.equals(_id))[0];

  if (!member) {
    if (ghAppInstallationToken) {
      const { name, owner } = repository;

      try {
        // Add member to GitHub repository using GitHub API
        const response = await customAxios({
          method: 'PUT',
          url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/collaborators/${user.githubUsername}`,
          headers: {
            'Content-Type': 'application/json',
            Accept: GITHUB_API.HEADERS.ACCEPT,
            Authorization: `token ${ghAppInstallationToken}`
          },
          data: { permission: GITHUB_REPOSITORY_PERMISSIONS[permission] }
        });
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
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
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

  //   try {
  //     await customAxios({
  //       method: 'PUT',
  //       url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/collaborators/${user.githubUsername}`,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: GITHUB_API.HEADERS.ACCEPT,
  //         Authorization: `token ${ghAppInstallationToken}`
  //       },
  //       data: { permission: GITHUB_REPOSITORY_PERMISSIONS[permission] }
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error(error.message);
  //   }
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
  let repository;

  if (!ghAppInstallationToken) repository = await get(repoCondition);

  const user = await UserService.get(memberCondition);
  const { _id } = user;

  const member = repository.members.filter(mem => mem._id.equals(_id))[0];
  if (!member)
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member not found');

  const { invitation } = member;

  if (ghAppInstallationToken) {
    const { name, owner } = repository;

    try {
      switch (invitation.status) {
        case 'pending':
          try {
            // Remove member invitation of GitHub repository using GitHub API
            await customAxios({
              method: 'DELETE',
              url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/invitations/${invitation.githubId}`,
              headers: {
                'Content-Type': 'application/json',
                Accept: GITHUB_API.HEADERS.ACCEPT,
                Authorization: `token ${ghAppInstallationToken}`
              }
            });
          } catch (error) {
            console.error(error);
            throw new Error(error.message);
          }
          break;

        case 'accepted':
          try {
            // Remove member of GitHub repository using GitHub API
            await customAxios({
              method: 'DELETE',
              url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/collaborators/${user.githubUsername}`,
              headers: {
                'Content-Type': 'application/json',
                Accept: GITHUB_API.HEADERS.ACCEPT,
                Authorization: `token ${ghAppInstallationToken}`
              }
            });
          } catch (error) {
            console.error(error);
            throw new Error(error.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
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
    try {
      const response = await customAxios({
        method: 'PATCH',
        url: `${GITHUB_API.BASE_URL}/repos/${owner}/${name}/branches/${branch}/protection/required_pull_request_reviews`,
        headers: {
          'Content-Type': 'application/json',
          Accept: GITHUB_API.HEADERS.ACCEPT_LUKE_CAGE,
          Authorization: `token ${ghAppInstallationToken}`
        },
        data: snakecaseKeys(options, { deep: true })
      });
      const { data, status } = response;

      return { data, statusCode: status };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
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
