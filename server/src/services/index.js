/* eslint-disable no-console */
const fs = require('fs');
const schedule = require('node-schedule');

const UserService = require('./user.service');
const RepositoryService = require('./repository.service');

const {
  INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_USERNAME,
  INITIAL_ADMIN_PASSWORD,
  INITIAL_ADMIN_ROLE,
  INITIAL_ADMIN_FULL_NAME,
  INITIAL_ADMIN_GITHUB_USERNAME
} = process.env;

const initialSetup = async () => {
  createCredentialsDirectory();
  createInitialAdminAccount();
  scheduleExpiredGhRepoInvitationsClearing();
};

const createCredentialsDirectory = () => {
  if (!fs.existsSync('credentials')) fs.mkdirSync('credentials');
};

const createInitialAdminAccount = async () => {
  try {
    const admins = await UserService.search({ role: 'admin' });

    if (!admins.length)
      await UserService.create('0', {
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
};

const scheduleExpiredGhRepoInvitationsClearing = async () => {
  try {
    schedule.scheduleJob(
      { hour: 0 },
      RepositoryService.clearExpiredInvitations
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { initialSetup };
