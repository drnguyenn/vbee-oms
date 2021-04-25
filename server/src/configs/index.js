const {
  SERVER_PORT,

  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_USERNAME,
  MONGO_PASSWORD,

  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME
} = process.env;

const { A_WEEK } = require('../constants');

module.exports = {
  SERVER_PORT: SERVER_PORT || 5000,
  MONGO_URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`,
  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME: parseInt(JWT_EXPIRES_TIME, 10) || A_WEEK
};
