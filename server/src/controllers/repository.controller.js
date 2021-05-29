const RepositoryService = require('@services/repository.service');

const getRepository = async (req, res) => {
  const { id } = req.params;

  const repository = await RepositoryService.get(id);

  return res.json({ status: 1, result: { repository } });
};

const createRepository = async (req, res) => {
  const repository = await RepositoryService.create(req.body);

  return res.status(201).json({ status: 1, result: { repository } });
};

const updateRepository = async (req, res) => {
  const { id } = req.params;

  const { repository, statusCode } = await RepositoryService.update(
    id,
    req.body
  );

  return res.status(statusCode).json({ status: 1, result: { repository } });
};

const deleteRepository = async (req, res) => {
  const { id } = req.params;

  const repository = await RepositoryService.remove(id);

  return res.json({ status: 1, result: { repository } });
};

const searchRepositories = async (req, res) => {
  const repositories = await RepositoryService.search(req.query);

  return res.json({ status: 1, result: { repositories } });
};

const addMember = async (req, res) => {
  const { id, userId } = req.params;
  const { permission } = req.body;

  const { repository, statusCode } = await RepositoryService.addMember(
    id,
    { _id: userId, permission },
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { repository }
  });
};

const updateMember = async (req, res) => {
  const { id, userId } = req.params;
  const { permission, invitation } = req.body;

  const { repository, statusCode } = await RepositoryService.updateMember(
    id,
    userId,
    { permission, invitation },
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { repository }
  });
};

const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  const { repository, statusCode } = await RepositoryService.removeMember(
    id,
    userId,
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { repository }
  });
};

const removeMemberFromAllRepositories = async (req, res) => {
  const { userId } = req.params;

  const { statusCode } =
    await RepositoryService.removeMemberFromAllRepositories(userId);

  return res.status(statusCode).json({ status: statusCode < 400 ? 1 : 0 });
};

const updatePRReviewProtection = async (req, res) => {
  const { id, branch } = req.params;

  const { data, statusCode } = await RepositoryService.updatePRReviewProtection(
    id,
    branch,
    req.body,
    req.ghAppInstallationToken
  );

  return res
    .status(statusCode)
    .json({ status: statusCode < 400 ? 1 : 0, result: data });
};

module.exports = {
  getRepository,
  searchRepositories,
  createRepository,
  updateRepository,
  deleteRepository,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllRepositories,
  updatePRReviewProtection
};
