const { Joi, validate } = require('express-validation');

const createUserValidationSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    username: Joi.string().trim().required(),
    role: Joi.string().trim().valid('admin', 'member').required(),
    fullName: Joi.string().trim(),
    githubUsername: Joi.string().trim().required()
  }).unknown(false)
};

const searchUsersValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    vbeeSearch: Joi.boolean().default(true),
    githubSearch: Joi.boolean().default(false),
    email: Joi.string().trim().email().lowercase(),
    username: Joi.string().trim(),
    role: Joi.string().trim().valid('admin', 'member'),
    fullName: Joi.string().trim(),
    githubId: Joi.string().trim(),
    githubUsername: Joi.string().trim(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const updateUserValidationSchema = {
  query: Joi.object({
    email: Joi.string().trim().email().lowercase(),
    username: Joi.string().trim(),
    role: Joi.string().trim().valid('admin', 'member'),
    githubUsername: Joi.string().trim()
  }).unknown(false)
};

module.exports = {
  createUserValidator: validate(createUserValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateUserValidator: validate(updateUserValidationSchema, {
    keyByField: true,
    context: true
  }),
  searchUsersValidator: validate(searchUsersValidationSchema, {
    keyByField: true,
    context: true
  })
};
