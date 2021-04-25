const codes = require('./code');

const getErrorMessage = code => {
  switch (code) {
    case codes.INVALID_CREDENTIALS:
      return 'Username or password is incorrect';

    default:
      return null;
  }
};

module.exports = getErrorMessage;
