const RepositoryService = require('@services/repository.service');

const getRepository = async (req, res) => {
  const { id } = req.params;

  const repository = await RepositoryService.get(id);

  return res.json({ status: 1, result: { repository } });
};

const searchRepositories = async (req, res) => {
  const repositories = await RepositoryService.search(req.query);

  return res.json({ status: 1, result: { repositories } });
};

const addMember = async (req, res) => {
  const { id, userId } = req.params;
  const { permission } = req.body;

  const { member, statusCode } = await RepositoryService.addMember(
    id,
    userId,
    { permission },
    req.user._id,
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const addMemberFromGitHub = async (req, res) => {
  const { id, githubUsername } = req.params;
  const { permission } = req.body;

  const { member, statusCode } = await RepositoryService.addMember(
    id,
    { githubUsername },
    { permission },
    req.user._id,
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  const { member, statusCode } = await RepositoryService.removeMember(
    id,
    userId,
    req.ghAppInstallationToken
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
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
  addMember,
  addMemberFromGitHub,
  removeMember,
  removeMemberFromAllRepositories,
  updatePRReviewProtection
};
