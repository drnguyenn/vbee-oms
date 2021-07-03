const UserService = require('@services/user.service');

const searchUsers = async (req, res) => {
  const users = await UserService.search(req.query);

  return res.json({ status: 1, result: { users } });
};

const createUser = async (req, res) => {
  const user = await UserService.create(req.user._id, req.body);
  return res.status(201).json({ status: 1, result: { user } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const accessToken = await UserService.login(email, password);
  return res.json({ status: 1, result: { accessToken } });
};

const verifyAccessToken = async (req, res) => {
  const { accessToken } = req;
  const user = await UserService.verifyAccessToken(accessToken);
  return res.json({ status: 1, result: { user } });
};

module.exports = { createUser, login, verifyAccessToken, searchUsers };
