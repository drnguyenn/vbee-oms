const { Joi, validate } = require('express-validation');

const createGhAppInstallationValidation = {
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

const updateGhAppInstallationValidation = {
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
    createGhAppInstallationValidation,
    {
      keyByField: true
    }
  ),
  updateGhAppInstallationValidator: validate(
    updateGhAppInstallationValidation,
    {
      keyByField: true
    }
  )
};
