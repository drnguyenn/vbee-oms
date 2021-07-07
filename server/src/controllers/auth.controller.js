const AuthService = require('@services/auth.service');

const login = async (req, res) => {
  const { email, password } = req.body;
  const accessToken = await AuthService.login(email, password);
  return res.json({ status: 1, result: { accessToken } });
};

const verifyAccessToken = async (req, res) => {
  const { accessToken } = req;
  const user = await AuthService.verifyAccessToken(accessToken);
  return res.json({ status: 1, result: { user } });
};

module.exports = { login, verifyAccessToken };
