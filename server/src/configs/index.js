const {
  SERVER_PORT,

  MONGO_HOST,
  MONGO_PORT,

  JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME
} = process.env;

const { A_WEEK } = require('@constants');

module.exports = {
  SERVER_PORT: SERVER_PORT || 5000,
  MONGO_URI: `mongodb://${MONGO_HOST}:${MONGO_PORT}`,
  JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME: parseInt(JWT_EXPIRATION_TIME, 10) || A_WEEK
};
