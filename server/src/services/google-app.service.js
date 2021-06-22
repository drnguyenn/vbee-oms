/* eslint-disable no-console */
const crypto = require('crypto');
const fs = require('fs');
const { google } = require('googleapis');

const {
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URI
} = process.env;

const TOKEN_PATH = 'credentials/vbee-oms.google-app-oauth2-token.json';

// If modifying these scopes, delete the token file.
const SCOPES = ['https://mail.google.com/'];

const STATE_TOKENS = {};

/**
 * Create an OAuth2 client with the given credentials, and then return a URL for
 * the app authorization.
 * @param {string} currentUserId ID of the user who submitted the request (used
 * for state token verification when redirecting)
 * @param {string} clientId Google App's client ID.
 * @param {string} clientSecret Google App's client secret.
 * @param {string} redirectUri Google App's redirect URI after successfully
 * authorizing.
 * @returns {string} The authorization URL for the Google App.
 */
const authorize = (currentUserId, clientId, clientSecret, redirectUri) => {
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  STATE_TOKENS[currentUserId] = crypto.randomBytes(20).toString('hex');

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: JSON.stringify({
      userId: currentUserId,
      token: STATE_TOKENS[currentUserId]
    })
  });

  return authUrl;
};

const getAndStoreNewTokens = async authCode => {
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_APP_CLIENT_ID,
    GOOGLE_APP_CLIENT_SECRET,
    GOOGLE_APP_REDIRECT_URI
  );

  const { tokens } = await oAuth2Client.getToken(authCode);

  oAuth2Client.setCredentials(tokens);

  google.options({ auth: oAuth2Client });

  // Store the token to disk for later program executions
  fs.writeFile(
    TOKEN_PATH,
    JSON.stringify(
      {
        GOOGLE_APP_ACCESS_TOKEN: tokens.access_token,
        GOOGLE_APP_REFRESH_TOKEN: tokens.refresh_token
      },
      (key, value) => value,
      2
    ),
    error => {
      if (error) throw new Error(error);
      console.info('Token saved');
    }
  );

  return oAuth2Client;
};

module.exports = { STATE_TOKENS, authorize, getAndStoreNewTokens };
