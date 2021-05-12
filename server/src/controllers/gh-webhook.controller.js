/* eslint-disable no-console */
const GhWebhookService = require('@services/gh-webhook.service');

const handleEvents = async (req, res) => {
  const event = req.headers['x-github-event'];

  switch (event) {
    case 'installation': {
      const { action, installation, repositories } = req.body;

      const { statusCode } = await GhWebhookService.handleInstallationEvent(
        action,
        installation,
        repositories
      );

      return res.status(statusCode).json({ status: 1 });
    }

    case 'installation_repositories': {
      const {
        action,
        installation,
        repositoriesAdded,
        repositoriesRemoved
      } = req.body;

      await GhWebhookService.handleInstallationRepositoriesEvent(
        action,
        installation,
        repositoriesAdded,
        repositoriesRemoved
      );

      return res.status(202).json({ status: 1 });
    }

    case 'member': {
      const { action, member, changes, repository } = req.body;

      const { statusCode } = await GhWebhookService.handleMemberEvent(
        action,
        member,
        changes,
        repository
      );

      return res.status(statusCode).json({ status: 1 });
    }

    default:
      console.log(`GitHub event: ${event}`);
      break;
  }

  return null;
};

module.exports = {
  handleEvents
};
