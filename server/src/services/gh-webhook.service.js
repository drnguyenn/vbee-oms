/* eslint-disable no-console */
const GhAppInstallationService = require('./gh-app-installation.service');

const RepositoryService = require('./repository.service');

const handleInstallationEvent = async (
  action,
  installation,
  repositories,
  deliveryId
) => {
  const { id: githubId, account } = installation;

  const data = { githubId, account: account.login };

  switch (action) {
    case 'created': {
      await GhAppInstallationService.create({ ...data, status: 'available' });

      try {
        addRepositories(repositories, githubId, deliveryId);
      } catch (error) {
        console.error(error);
      }

      return { statusCode: 201 };
    }

    case 'unsuspend': {
      const { statusCode } = await GhAppInstallationService.update(
        { githubId },
        { ...data, status: 'available' }
      );

      return { statusCode };
    }

    case 'suspend': {
      const { statusCode } = await GhAppInstallationService.update(
        { githubId },
        { ...data, status: 'suspended' }
      );

      return { statusCode };
    }

    case 'deleted':
      await GhAppInstallationService.remove({ githubId });

      try {
        removeRepositories(repositories);
      } catch (error) {
        console.error(error);
      }

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
  removedRepositories,
  deliveryId
) => {
  const { id: ghAppInstallationId } = installation;

  switch (action) {
    case 'added':
      try {
        addRepositories(addedRepositories, ghAppInstallationId, deliveryId);
      } catch (error) {
        console.error(error);
      }

      return { statusCode: 202 };

    case 'removed':
      try {
        removeRepositories(removedRepositories);
      } catch (error) {
        console.error(error);
      }

      return { statusCode: 202 };

    default:
      console.log(`GitHub installation event action: ${action}`);
      break;
  }

  return { statusCode: 204 };
};

const handleMemberEvent = async (
  action,
  member,
  changes,
  repository,
  deliveryId
) => {
  switch (action) {
    case 'added': {
      const { statusCode } = await RepositoryService.updateMember(
        { githubId: repository.id },
        { githubUsername: member.login },
        {
          permission: changes.permission.to,
          invitation: { status: 'accepted' }
        },
        deliveryId
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

const addRepositories = (addedRepositories, ghAppInstallationId, deliveryId) =>
  Promise.all(
    addedRepositories.map(addedRepository => {
      const {
        id: githubId,
        name,
        fullName,
        private: isPrivate
      } = addedRepository;

      const data = {
        name,
        url: `https://github.com/${fullName}`,
        owner: fullName.split('/')[0],
        private: isPrivate,
        githubId,
        ghAppInstallationId
      };

      return RepositoryService.update({ githubId }, data, deliveryId);
    })
  );

const removeRepositories = removedRepositories =>
  Promise.all(
    removedRepositories.map(removedRepository => {
      const { id: githubId } = removedRepository;

      return RepositoryService.remove({ githubId });
    })
  );

module.exports = {
  handleInstallationEvent,
  handleInstallationRepositoriesEvent,
  handleMemberEvent
};
