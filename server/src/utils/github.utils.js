const jwt = require('jsonwebtoken');
const fs = require('fs');
const snakecaseKeys = require('snakecase-keys');

const customAxios = require('@customs/axios.custom');

const { GITHUB_API, GITHUB_REPOSITORY_PERMISSIONS } = require('@constants');

const generateGhAppJwt = appId => {
  const privateKey = fs.readFileSync(
    'credentials/vbee-oms.gh-app-private-key.pem'
  );
  const EXPIRATION_TIME = 60; // 60 seconds

  const token = jwt.sign(
    {
      iss: appId,
      exp: Math.floor(Date.now() / 1000) + EXPIRATION_TIME
    },
    privateKey,
    { algorithm: 'RS256' }
  );

  return token;
};

const generateGhAppInstallationToken = async installationGhId => {
  const { GITHUB_APP_ID } = process.env;
  const ghAppJwt = generateGhAppJwt(GITHUB_APP_ID);

  const response = await customAxios({
    method: 'POST',
    url: `${GITHUB_API.BASE_URL}/app/installations/${installationGhId}/access_tokens`,
    headers: {
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `Bearer ${ghAppJwt}`
    }
  });
  const { token, expiresAt, permissions } = response.data;

  return { token, expiresAt, permissions };
};

const listCollaborators = async (
  ghAppInstallationToken,
  owner,
  repoName,
  page = 1
) => {
  const response = await customAxios({
    method: 'GET',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/collaborators`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `token ${ghAppInstallationToken}`
    },
    params: {
      per_page: 100,
      page
    }
  });
  const { data } = response;

  return data.length
    ? [
        ...data,
        ...(await listCollaborators(
          ghAppInstallationToken,
          owner,
          repoName,
          page + 1
        ))
      ]
    : data;
};

const listInvitations = async (
  ghAppInstallationToken,
  owner,
  repoName,
  page = 1
) => {
  const response = await customAxios({
    method: 'GET',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/invitations`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `token ${ghAppInstallationToken}`
    },
    params: {
      per_page: 100,
      page
    }
  });
  const { data } = response;

  return data.length
    ? [
        ...data,
        ...(await listInvitations(
          ghAppInstallationToken,
          owner,
          repoName,
          page + 1
        ))
      ]
    : data;
};

const addCollaborator = async (
  ghAppInstallationToken,
  owner,
  repoName,
  githubUsername,
  permission
) => {
  const response = await customAxios({
    method: 'PUT',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/collaborators/${githubUsername}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `token ${ghAppInstallationToken}`
    },
    data: { permission: GITHUB_REPOSITORY_PERMISSIONS[permission] }
  });

  return response;
};

const removeCollaborator = async (
  ghAppInstallationToken,
  owner,
  repoName,
  githubUsername
) => {
  const response = await customAxios({
    method: 'DELETE',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/collaborators/${githubUsername}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `token ${ghAppInstallationToken}`
    }
  });

  return response;
};

const deleteInvitation = async (
  ghAppInstallationToken,
  owner,
  repoName,
  invitationGitHubId
) => {
  const response = await customAxios({
    method: 'DELETE',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/invitations/${invitationGitHubId}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      Authorization: `token ${ghAppInstallationToken}`
    }
  });

  return response;
};

const updatePRReviewProtection = async (
  ghAppInstallationToken,
  owner,
  repoName,
  branch,
  options
) => {
  const response = await customAxios({
    method: 'PATCH',
    url: `${GITHUB_API.BASE_URL}/repos/${owner}/${repoName}/branches/${branch}/protection/required_pull_request_reviews`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT_LUKE_CAGE,
      Authorization: `token ${ghAppInstallationToken}`
    },
    data: snakecaseKeys(options, { deep: true })
  });

  return response;
};

const getPermissionToStore = ({ admin, push, pull }) => {
  if (admin) return 'admin';
  if (push) return 'write';
  if (pull) return 'read';
  return null;
};

const getUser = async (ghAppInstallationToken, githubUsername) => {
  const authHeader = {};

  if (ghAppInstallationToken)
    authHeader.Authorization = `token ${ghAppInstallationToken}`;

  const response = await customAxios({
    method: 'GET',
    url: `${GITHUB_API.BASE_URL}/users/${githubUsername}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      ...authHeader // Authentication is required to get the public email of a GitHub user
    }
  });

  return response;
};

const searchUsers = async (
  ghAppInstallationToken,
  query,
  perPage = 30,
  page = 1
) => {
  const authHeader = {};

  if (ghAppInstallationToken)
    authHeader.Authorization = `token ${ghAppInstallationToken}`;

  const response = await customAxios({
    method: 'GET',
    url: `${GITHUB_API.BASE_URL}/search/users`,
    headers: {
      'Content-Type': 'application/json',
      Accept: GITHUB_API.HEADERS.ACCEPT,
      ...authHeader
    },
    params: {
      q: query,
      per_page: perPage,
      page
    }
  });

  return response.data.items;
};

module.exports = {
  app: {
    generateGhAppInstallationToken
  },
  repository: {
    listCollaborators,
    listInvitations,
    addCollaborator,
    removeCollaborator,
    deleteInvitation,
    updatePRReviewProtection,
    getPermissionToStore
  },
  user: {
    getUser
  },
  search: {
    searchUsers
  }
};
