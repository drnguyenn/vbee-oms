/* eslint-disable no-console */
const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const RepositoryDao = require('@daos/repository.dao');
const RepositoryMemberDao = require('@daos/repository-member.dao');
const UserDao = require('@daos/user.dao');

const UserService = require('@services/user.service');
const GhAppInstallationService = require('@services/gh-app-installation.service');

const GitHubUtils = require('@utils/github.utils');

const { A_WEEK } = require('@constants');

const get = async (condition, projection) => {
  const repository = await RepositoryDao.findOne(condition, projection);

  if (!repository)
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  return repository;
};

const update = async ({ githubId: repoGitHubId }, data, requesterId) => {
  const repository = await RepositoryDao.update(
    { githubId: repoGitHubId },
    data
  );
  const { ghAppInstallationId, owner, name } = repository;

  const ghAppInstallationToken =
    await GhAppInstallationService.getGhAppInstallationToken({
      githubId: ghAppInstallationId
    });

  const collaborators = await GitHubUtils.repository.listCollaborators(
    ghAppInstallationToken,
    owner,
    name
  );

  await Promise.all(
    collaborators.map(
      async ({ id: githubId, login: githubUsername, permissions }) => {
        // Do not store repository owner in DB
        if (githubUsername !== owner) {
          let user = await UserDao.findOne({ githubId });

          if (user)
            user = await UserDao.update({ githubId }, { githubUsername });
          else user = await UserService.create(requesterId, { githubUsername });

          return RepositoryMemberDao.update(
            { repository: repository._id, user: user._id },
            {
              permission:
                GitHubUtils.repository.getPermissionToStore(permissions),
              invitation: { status: 'accepted' }
            }
          );
        }

        return null;
      }
    )
  );

  const invitations = await GitHubUtils.repository.listInvitations(
    ghAppInstallationToken,
    owner,
    name
  );

  await Promise.all(
    invitations.map(
      async ({
        id: invitationGithubId,
        invitee: { id: githubId, login: githubUsername },
        permissions
      }) => {
        let user = await UserDao.findOne({ githubId });

        if (user) user = await UserDao.update({ githubId }, { githubUsername });
        else user = await UserService.create(requesterId, { githubUsername });

        RepositoryMemberDao.update(
          { repository: repository._id, user: user._id },
          {
            permission: permissions,
            invitation: { githubId: invitationGithubId, status: 'pending' }
          }
        );
      }
    )
  );

  return repository;
};

const remove = async condition => {
  const repository = await RepositoryDao.remove(condition);

  if (!repository)
    throw new CustomError(errorCodes.NOT_FOUND, 'Repository not found');

  await RepositoryMemberDao.removeMany({ repository: repository._id });

  return repository;
};

const search = async (
  condition,
  projection = { createdAt: 0, updatedAt: 0 }
) => {
  if (condition.q) {
    const repositories = await RepositoryDao.search(condition.q, projection);
    return repositories;
  }

  const repositories = await RepositoryDao.findAll(condition, projection);
  return repositories;
};

const countAll = async () => {
  const repositoryCount = await RepositoryDao.countAll();
  return repositoryCount;
};

const listMembers = async repoCondition => {
  const repository = await get(repoCondition);

  const { memberCount, members } = repository;

  return { memberCount, members };
};

const addMember = async (
  repoCondition,
  memberCondition,
  data,
  requesterId,
  ghAppInstallationToken
) => {
  const repository = await get(repoCondition);

  let user,
    checkRepoMember = true;

  const { githubUsername } = memberCondition;

  if (githubUsername) {
    if (githubUsername === repository.owner)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Can not add an owner to his own repositories'
      );

    user = await UserDao.findOne({ githubUsername });

    if (!user) {
      checkRepoMember = false;
      user = await UserService.create(requesterId, { githubUsername });
    }
  } else {
    user = await UserService.get(memberCondition);
  }

  if (checkRepoMember) {
    if (user.githubUsername === repository.owner)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Can not add an owner to his own repositories'
      );

    if (
      await RepositoryMemberDao.findOne({
        user: user._id,
        repository: repository._id
      })
    )
      throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');
  }

  if (ghAppInstallationToken) {
    const { name, owner } = repository;

    // Add member to GitHub repository using GitHub API
    const response = await GitHubUtils.repository.addCollaborator(
      ghAppInstallationToken,
      owner,
      name,
      user.githubUsername,
      data.permission
    );

    if (response.status) {
      if (response.status < 400) {
        const {
          data: { id }
        } = response;

        // Add member to repository in Vbee OMS database
        const member = await RepositoryMemberDao.create({
          user: user._id,
          repository: repository._id,
          permission: data.permission,
          invitation: {
            githubId: id,
            status: 'pending',
            expiresAt: Date.now() + A_WEEK
          }
        });

        return { member, statusCode: 201 };
      }

      const { message } = response.data;
      throw new CustomError(response.status, message);
    }
  }

  // Add member to repository in Vbee OMS database
  const member = await RepositoryMemberDao.create({
    user: user._id,
    repository: repository._id,
    ...data
  });

  return { member, statusCode: 201 };
};

const updateMember = async (
  repoCondition,
  memberCondition,
  data,
  requesterId,
  ghAppInstallationToken
) => {
  const repository = await get(repoCondition);

  let user,
    checkRepoMember = true;

  const { githubUsername } = memberCondition;

  if (githubUsername) {
    if (githubUsername === repository.owner)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Can not add an owner to his own repositories'
      );

    user = await UserDao.findOne({ githubUsername });

    if (!user) {
      checkRepoMember = false;
      user = await UserService.create(requesterId, { githubUsername });
    }
  } else {
    user = await UserService.get(memberCondition);
  }

  let member;
  if (checkRepoMember) {
    if (user.githubUsername === repository.owner)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Can not add an owner to his own repositories'
      );

    member = await RepositoryMemberDao.findOne({
      user: user._id,
      repository: repository._id
    });
  }

  if (!member)
    if (ghAppInstallationToken) {
      const { name, owner } = repository;

      // Add member to GitHub repository using GitHub API
      const response = await GitHubUtils.repository.addCollaborator(
        ghAppInstallationToken,
        owner,
        name,
        user.githubUsername,
        data.permission
      );

      if (response.status) {
        if (response.status < 400) {
          const {
            data: { id }
          } = response;

          // Add member to repository in Vbee OMS database
          member = await RepositoryMemberDao.create({
            user: user._id,
            repository: repository._id,
            permission: data.permission,
            invitation: {
              githubId: id,
              status: 'pending',
              expiresAt: Date.now() + A_WEEK
            }
          });

          return { member, statusCode: 201 };
        }

        const { message } = response.data;
        throw new CustomError(response.status, message);
      }
    }

  member = await RepositoryMemberDao.update(
    {
      user: user._id,
      repository: repository._id
    },
    { ...data }
  );

  return { member, statusCode: 200 };
};

const removeMember = async (
  repoCondition,
  memberCondition,
  ghAppInstallationToken
) => {
  const repository = await get(repoCondition);

  const user = await UserDao.findOne(memberCondition);
  if (!user) throw new CustomError(errorCodes.NOT_FOUND, 'User not found');

  if (ghAppInstallationToken) {
    let member = await RepositoryMemberDao.findOne({
      repository: repository._id,
      user: user._id
    });

    if (!member)
      throw new CustomError(errorCodes.NOT_FOUND, 'Member not found');

    const { name, owner } = repository;
    const { invitation } = member;

    let response;

    switch (invitation.status) {
      case 'pending':
        // Delete member invitation of GitHub repository using GitHub API
        response = await GitHubUtils.repository.deleteInvitation(
          ghAppInstallationToken,
          owner,
          name,
          invitation.githubId
        );
        break;

      case 'accepted':
        // Remove member of GitHub repository using GitHub API
        response = await GitHubUtils.repository.removeCollaborator(
          ghAppInstallationToken,
          owner,
          name,
          user.githubUsername
        );
        break;

      default:
        break;
    }

    if (response.status) {
      if (response.status < 400) {
        // Remove member from repository in Vbee OMS database
        member = await RepositoryMemberDao.removeOne({
          repository: repository._id,
          user: user._id
        });

        return { member, statusCode: 200 };
      }

      const { message } = response.data;
      throw new CustomError(response.status, message);
    }
  }

  // Remove member of repository from Vbee OMS database
  const member = await RepositoryMemberDao.removeOne({
    repository: repository._id,
    user: user._id
  });

  return { member, statusCode: 200 };
};

const updateInvitation = async (
  repoCondition,
  memberCondition,
  permission,
  ghAppInstallationToken
) => {
  const repository = await get(repoCondition);

  const user = await UserService.get(memberCondition);

  if (ghAppInstallationToken) {
    let member = await RepositoryMemberDao.findOne({
      repository: repository._id,
      user: user._id
    });
    if (!member)
      throw new CustomError(errorCodes.NOT_FOUND, 'Member not found');

    const { name, owner } = repository;
    const { invitation } = member;

    if (!invitation.githubId)
      throw new CustomError(errorCodes.NOT_FOUND, 'Invitation not found');

    if (Date.now() >= new Date(invitation.expiresAt).getTime())
      throw new CustomError(
        errorCodes.UNPROCESSABLE_ENTITY,
        'Invitation expired'
      );

    const response = await GitHubUtils.repository.updateInvitation(
      ghAppInstallationToken,
      owner,
      name,
      invitation.githubId,
      permission
    );

    if (response.status) {
      if (response.status < 400) {
        member = await RepositoryMemberDao.update(
          {
            repository: repository._id,
            user: user._id
          },
          { permission }
        );

        return { member, statusCode: response.status };
      }

      const { message } = response.data;
      throw new CustomError(response.status, message);
    }
  }

  const member = await RepositoryMemberDao.update(
    {
      repository: repository._id,
      user: user._id
    },
    { permission }
  );

  return { member, statusCode: 200 };
};

const clearExpiredInvitations = async () => {
  console.info('Clearing expired invitations...');

  const members = await RepositoryMemberDao.findAll({
    $and: [
      {
        'invitation.githubId': { $ne: null },
        'invitation.expiresAt': { $lte: Date.now() }
      }
    ]
  });

  const results = await Promise.allSettled(
    members.map(async ({ repository, user, invitation }) => {
      const response = await GitHubUtils.repository.deleteInvitation(
        await GhAppInstallationService.getGhAppInstallationToken({
          githubId: repository.ghAppInstallationId
        }),
        repository.owner,
        repository.name,
        invitation.githubId
      );

      if (response.status) {
        if (response.status < 400 || response.status === 404) {
          await RepositoryMemberDao.removeOne({
            repository: repository._id,
            user: user._id
          });

          return response.status;
        }

        const { message } = response.data;
        console.error(message);

        return response.status;
      }

      return 500;
    })
  );

  console.info('Finish clearing expired invitations');

  return results;
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
    const response = await GitHubUtils.repository.updatePRReviewProtection(
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

  return { statusCode: 200 };
};

module.exports = {
  get,
  search,
  update,
  remove,
  countAll,
  listMembers,
  addMember,
  updateMember,
  removeMember,
  updateInvitation,
  clearExpiredInvitations,
  updatePRReviewProtection
};
