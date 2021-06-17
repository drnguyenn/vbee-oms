/* eslint-disable no-console */
const snakecaseKeys = require('snakecase-keys');
const codes = require('@errors/code');
const getErrorMessage = require('@errors/message');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let details;
  let code = err.code || err.statusCode || codes.INTERNAL_SERVER_ERROR;
  let message = err.message || getErrorMessage(code);

  switch (code) {
    case codes.BAD_REQUEST:
      message = message || 'Bad Request';
      details = err.details;
      break;

    case codes.UNAUTHORIZED:
    case codes.INVALID_CREDENTIALS:
      message = message || 'Unauthorized';
      break;

    case codes.FORBIDDEN:
      message = message || 'Forbidden';
      break;

    case codes.NOT_FOUND:
      message = message || 'Not Found';
      break;

    case codes.TOO_MANY_REQUESTS:
      message = message || 'Too Many Requests';
      break;

    case codes.INTERNAL_SERVER_ERROR:
      code = codes.INTERNAL_SERVER_ERROR;
      message = message || 'Internal Server Error';
      break;

    default:
      code = 500;
      message = 'Something went wrong';
  }

  return res.status(code).send(
    snakecaseKeys(
      {
        status: 0,
        code,
        message,
        details
      },
      { deep: true }
    )
  );
};

module.exports = errorHandler;
