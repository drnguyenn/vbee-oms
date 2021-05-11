const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const customAxios = require('@customs/axios.custom');

const { GITHUB_API } = require('@constants');

const generateGhAppJwt = appId => {
  const privateKey = fs.readFileSync(
    path.resolve(__dirname, '../../vbee-oms.private-key.pem')
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

module.exports = { generateGhAppInstallationToken };
