/* eslint-disable no-console */
const nodemailer = require('nodemailer');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const { authorize } = require('@services/google-app.service');

const {
  GOOGLE_APP_USER_EMAIL,
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET
} = process.env;

const sendMail = async (
  requesterId,
  { receiverEmails, subject, textContent = '', htmlContent = '' }
) => {
  let tokens = {};

  try {
    tokens = require('@credentials/vbee-oms.google-app-oauth2-token.json');
  } catch (error) {
    if (error.message.includes('Cannot find module')) {
      console.log('Google App tokens not found');

      const authUrl = authorize(requesterId);

      throw new CustomError(
        errorCodes.UNPROCESSABLE_ENTITY,
        `Google App tokens not found. Please authorize Vbee OMS via this URL: ${authUrl}`
      );
    }

    throw new Error(error.message);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GOOGLE_APP_USER_EMAIL,
        clientId: GOOGLE_APP_CLIENT_ID,
        clientSecret: GOOGLE_APP_CLIENT_SECRET,
        refreshToken: tokens.GOOGLE_APP_REFRESH_TOKEN
      }
    });

    const result = await transporter.sendMail({
      from: GOOGLE_APP_USER_EMAIL,
      to: receiverEmails,
      subject,
      text: textContent,
      html: htmlContent
    });

    console.info(`Mail sent: ${result}`);

    return result;
  } catch (error) {
    if (
      error.message.includes('invalid_grant: Token has been expired or revoked')
    ) {
      const authUrl = authorize(requesterId);

      throw new CustomError(
        errorCodes.UNPROCESSABLE_ENTITY,
        `Google App token has been expired or revoked. Please authorize Vbee OMS again via this URL: ${authUrl}`
      );
    }

    throw new Error(error.message);
  }
};

module.exports = { sendMail };
