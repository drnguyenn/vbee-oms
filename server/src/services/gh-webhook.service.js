/* eslint-disable no-console */
const GhAppInstallationService = require('./gh-app-installation.service');

const RepositoryService = require('./repository.service');

const handleInstallationEvent = async (action, installation, repositories) => {
  const { id: githubId, account } = installation;

  const data = { githubId, account: account.login };

  switch (action) {
    case 'created': {
      await GhAppInstallationService.create({
        ...data,
        status: 'available'
      });
      addRepositories(repositories, githubId);

      return { statusCode: 201 };
    }

    case 'unsuspend': {
      const { statusCode } = await GhAppInstallationService.update(
        { githubId },
        {
          ...data,
          status: 'available'
        }
      );

      return { statusCode };
    }

    case 'suspend': {
      const { statusCode } = await GhAppInstallationService.update(
        { githubId },
        {
          ...data,
          status: 'suspended'
        }
      );

      return { statusCode };
    }

    case 'deleted':
      await GhAppInstallationService.remove({ githubId });
      removeRepositories(repositories);

      return { statusCode: 200 };

    default:
      console.log(`GitHub installation event action: ${action}`);
      break;
  }

  return { statusCode: 204 };
};

const handleInstallationRepositoriesEvent = async (
  action,
  installation,
  addedRepositories,
  removedRepositories
) => {
  const { id: ghAppInstallationId } = installation;

  switch (action) {
    case 'added':
      return addRepositories(addedRepositories, ghAppInstallationId);

    case 'removed':
      return removeRepositories(removedRepositories);

    default:
      console.log(`GitHub installation event action: ${action}`);
      break;
  }

  return { statusCode: 204 };
};

const handleMemberEvent = async (action, member, changes, repository) => {
  switch (action) {
    case 'added': {
      const { statusCode } = await RepositoryService.updateMember(
        { githubId: repository.id },
        { githubId: member.id },
        {
          permission: changes.permission.to,
          invitation: {
            githubId: null,
            status: 'accepted'
          }
        }
      );
      return { statusCode };
    }

    case 'removed': {
      const { statusCode } = await RepositoryService.removeMember(
        { githubId: repository.id },
        { githubId: member.id }
      );
      return { statusCode };
    }

    case 'edited':
      break;

    default:
      console.log(`GitHub member event action: ${action}`);
      break;
  }

  return { statusCode: 204 };
};

const addRepositories = (addedRepositories, ghAppInstallationId) => {
  // eslint-disable-next-line one-var
  let githubId, name, fullName, data;

  return Promise.all(
    addedRepositories.map(addedRepository => {
      ({ id: githubId, name, fullName } = addedRepository);

      data = {
        name,
        url: `https://github.com/${fullName}`,
        owner: fullName.split('/')[0],
        githubId,
        ghAppInstallationId
      };

      return RepositoryService.update({ githubId }, data);
    })
  );
};

const removeRepositories = removedRepositories => {
  let githubId;

  return Promise.all(
    removedRepositories.map(removedRepository => {
      ({ id: githubId } = removedRepository);

      return RepositoryService.remove({ githubId });
    })
  );
};

module.exports = {
  handleInstallationEvent,
  handleInstallationRepositoriesEvent,
  handleMemberEvent
};
