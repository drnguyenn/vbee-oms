const { Joi, validate } = require('express-validation');

const createGhAppInstallationValidationSchema = {
  body: Joi.object({
    githubId: Joi.string().trim().required(),
    account: Joi.string().trim().required(),
    status: Joi.string().trim().valid('available', 'suspended'),
    accessToken: Joi.object({
      token: Joi.string().trim().required(),
      expiresAt: Joi.date().required(),
      permissions: Joi.object().required()
    })
  }).unknown(false)
};

const updateGhAppInstallationValidationSchema = {
  body: Joi.object({
    githubId: Joi.string().trim(),
    account: Joi.string().trim(),
    status: Joi.string().trim().valid('available', 'suspended'),
    accessToken: Joi.object({
      token: Joi.string().trim().required(),
      expiresAt: Joi.date().required(),
      permissions: Joi.object().required()
    })
  }).unknown(false)
};

module.exports = {
  createGhAppInstallationValidator: validate(
    createGhAppInstallationValidationSchema,
    {
      keyByField: true,
      context: true
    }
  ),
  updateGhAppInstallationValidator: validate(
    updateGhAppInstallationValidationSchema,
    {
      keyByField: true,
      context: true
    }
  )
};
