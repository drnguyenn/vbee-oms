/* eslint-disable no-console */
const crypto = require('crypto');
const fs = require('fs');
const { google } = require('googleapis');

const { GOOGLE_APP_STATE_TOKEN_EXPIRATION_TIME } = require('@constants');

const {
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URI
} = process.env;

const TOKEN_PATH = 'credentials/vbee-oms.google-app-oauth2-token.json';

// If modifying these scopes, delete the token file.
const SCOPES = ['https://mail.google.com/'];

const STATE_TOKENS = {};

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URI
);

/**
 * Create an OAuth2 client with the given credentials, and then return a URL for
 * the app authorization.
 * @param {string} requesterId ID of the actor that submitted the request (used
 * for state token verification when redirecting)
 * @returns {string} The authorization URL for the Google App.
 */
const authorize = requesterId => {
  STATE_TOKENS[requesterId] = crypto.randomBytes(20).toString('hex');

  setTimeout(() => {
    delete STATE_TOKENS[requesterId];
  }, GOOGLE_APP_STATE_TOKEN_EXPIRATION_TIME);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: JSON.stringify({
      requesterId,
      token: STATE_TOKENS[requesterId]
    })
  });

  return authUrl;
};

const getAndStoreNewTokens = async authCode => {
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
