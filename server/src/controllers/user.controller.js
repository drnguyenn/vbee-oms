const UserService = require('@services/user.service');

const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await UserService.get(id);

  return res.json({ status: 1, result: { user } });
};

const createUser = async (req, res) => {
  const user = await UserService.create(req.user._id, req.body);
  return res.status(201).json({ status: 1, result: { user } });
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await UserService.update(req.user, id, req.body);

  return res.json({ status: 1, result: { user } });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await UserService.remove(req.user, id);

  return res.json({ status: 1, result: { user } });
};

const searchUsers = async (req, res) => {
  const users = await UserService.search(req.query);

  return res.json({ status: 1, result: { users } });
};

const removeUserFromAllClusters = async (req, res) => {
  const { id } = req.params;

  const { statusCode } = await UserService.removeUserFromAllClusters(id);

  return res.status(statusCode).json({ status: 1 });
};

const removeUserFromAllRepositories = async (req, res) => {
  const { id } = req.params;

  const { statusCode } = await UserService.removeUserFromAllRepositories(id);

  return res.status(statusCode).json({ status: 1 });
};

const removeUserFromAllServices = async (req, res) => {
  const { id } = req.params;

  const { statusCode } = await UserService.removeUserFromAllServices(id);

  return res.status(statusCode).json({ status: 1 });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  removeUserFromAllClusters,
  removeUserFromAllRepositories,
  removeUserFromAllServices
};
