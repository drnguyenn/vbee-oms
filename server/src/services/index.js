/* eslint-disable no-console */
const UserService = require('./user.service');

const {
  INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_USERNAME,
  INITIAL_ADMIN_PASSWORD,
  INITIAL_ADMIN_ROLE,
  INITIAL_ADMIN_FULL_NAME,
  INITIAL_ADMIN_GITHUB_USERNAME
} = process.env;

const initialSetup = async () => {
  const admins = await UserService.search({ role: 'admin' });

  try {
    if (!admins.length)
      await UserService.create({
        email: INITIAL_ADMIN_EMAIL,
        username: INITIAL_ADMIN_USERNAME,
        password: INITIAL_ADMIN_PASSWORD,
        role: INITIAL_ADMIN_ROLE,
        fullName: INITIAL_ADMIN_FULL_NAME,
        githubUsername: INITIAL_ADMIN_GITHUB_USERNAME
      });
  } catch (error) {
    console.error(error);
  }

  return null;
};

module.exports = initialSetup;
