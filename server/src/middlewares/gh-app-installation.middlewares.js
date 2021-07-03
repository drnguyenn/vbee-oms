const RepositoryService = require('@services/repository.service');
const GhAppInstallationService = require('@services/gh-app-installation.service');
const asyncMiddleware = require('./async.middlewares');

const getGhAppInstallationToken = async (req, res, next) => {
  const { id } = req.params;
  const { ghAppInstallationId } = await RepositoryService.get(id);

  req.ghAppInstallationToken =
    await GhAppInstallationService.getGhAppInstallationToken({
      githubId: ghAppInstallationId
    });

  return next();
};

module.exports = {
  ghAppInstallationToken: asyncMiddleware(getGhAppInstallationToken)
};
