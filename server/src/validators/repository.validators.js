const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchRepositoriesValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    url: Joi.string().trim(),
    owner: Joi.string().trim(),
    githubId: Joi.string().trim(),
    ghAppInstallationId: Joi.string().trim(),
    service: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createRepositoryValidation = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    url: Joi.string().trim().required(),
    owner: Joi.string().trim().required(),
    githubId: Joi.string().trim(),
    ghAppInstallationId: Joi.string().trim(),
    serviceId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const updateRepositoryValidation = {
  body: Joi.object({
    name: Joi.string().trim(),
    url: Joi.string().trim(),
    owner: Joi.string().trim(),
    githubId: Joi.string().trim(),
    ghAppInstallationId: Joi.string().trim(),
    serviceId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addMemberValidation = {
  body: Joi.object({
    permission: Joi.string().trim().valid('read', 'write', 'admin')
  }).unknown(false)
};

const updateMemberValidation = {
  body: Joi.object({
    permission: Joi.string().trim().valid('read', 'write', 'admin'),
    invitation: Joi.object({
      githubId: Joi.string().trim(),
      status: Joi.string().trim().valid('pending', 'accepted')
    }).unknown(false)
  }).unknown(false)
};

const updatePRReviewProtectionValidation = {
  body: Joi.object({
    dismissalRestrictions: Joi.object({
      users: Joi.array().items(Joi.string()),
      teams: Joi.array().items(Joi.string())
    }).unknown(false),
    dismissStaleReviews: Joi.boolean(),
    requireCodeOwnerReviews: Joi.boolean(),
    requiredApprovingReviewCount: Joi.number().min(1).max(6)
  }).unknown(false)
};

module.exports = {
  createRepositoryValidator: validate(createRepositoryValidation, {
    keyByField: true
  }),
  searchRepositoriesValidator: validate(searchRepositoriesValidation, {
    keyByField: true
  }),
  updateRepositoryValidator: validate(updateRepositoryValidation, {
    keyByField: true
  }),
  addMemberValidator: validate(addMemberValidation, {
    keyByField: true
  }),
  updateMemberValidator: validate(updateMemberValidation, {
    keyByField: true
  }),
  updatePRReviewProtectionValidator: validate(
    updatePRReviewProtectionValidation,
    {
      keyByField: true
    }
  )
};
