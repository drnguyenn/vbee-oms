const GhAppInstallationService = require('@services/gh-app-installation.service');

const getGhAppInstallation = async (req, res) => {
  const { id } = req.params;

  const ghAppInstallation = await GhAppInstallationService.get(id);

  return res.json({ status: 1, result: { ghAppInstallation } });
};

const createGhAppInstallation = async (req, res) => {
  const ghAppInstallation = await GhAppInstallationService.create(req.body);

  return res.status(201).json({ status: 1, result: { ghAppInstallation } });
};

const updateGhAppInstallation = async (req, res) => {
  const { id } = req.params;

  const {
    ghAppInstallation,
    statusCode
  } = await GhAppInstallationService.update(id, req.body);

  return res
    .status(statusCode)
    .json({ status: 1, result: { ghAppInstallation } });
};

const deleteGhAppInstallation = async (req, res) => {
  const { id } = req.params;

  const ghAppInstallation = await GhAppInstallationService.remove(id);

  return res.json({ status: 1, result: { ghAppInstallation } });
};

module.exports = {
  getGhAppInstallation,
  createGhAppInstallation,
  updateGhAppInstallation,
  deleteGhAppInstallation
};
