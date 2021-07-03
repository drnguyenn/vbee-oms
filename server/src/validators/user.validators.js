const { Joi, validate } = require('express-validation');

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().required()
  }).unknown(false)
};

const createUserValidation = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    username: Joi.string().trim().required(),
    role: Joi.string().trim().valid('admin', 'member').required(),
    fullName: Joi.string().trim(),
    githubUsername: Joi.string().trim().required()
  }).unknown(false)
};

const searchUsersValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    githubSearch: Joi.boolean(),
    email: Joi.string().email().trim().lowercase(),
    username: Joi.string().trim(),
    role: Joi.string().trim().valid('admin', 'member'),
    fullName: Joi.string().trim(),
    githubId: Joi.string().trim(),
    githubUsername: Joi.string().trim(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

module.exports = {
  loginValidator: validate(loginValidation, { keyByField: true }),
  createUserValidator: validate(createUserValidation, { keyByField: true }),
  searchUsersValidator: validate(searchUsersValidation, { keyByField: true })
};
