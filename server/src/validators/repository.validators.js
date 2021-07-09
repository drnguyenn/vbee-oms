const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchRepositoriesValidationSchema = {
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

const createRepositoryValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    owner: Joi.string().trim().required(),
    ghAppInstallationId: Joi.string().trim()
  }).unknown(false)
};

const updateRepositoryValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    owner: Joi.string().trim(),
    ghAppInstallationId: Joi.string().trim()
  }).unknown(false)
};

const addMemberValidationSchema = {
  body: Joi.object({
    permission: Joi.string().trim().valid('read', 'write', 'admin')
  }).unknown(false)
};

const updateInvitationValidationSchema = {
  body: Joi.object({
    permission: Joi.string().trim().valid('read', 'write', 'admin').required()
  }).unknown(false)
};

const updatePRReviewProtectionValidationSchema = {
  body: Joi.object({
    dismissalRestrictions: Joi.object({
      users: Joi.array().items(Joi.string().trim()),
      teams: Joi.array().items(Joi.string().trim())
    }).unknown(false),
    dismissStaleReviews: Joi.boolean(),
    requireCodeOwnerReviews: Joi.boolean(),
    requiredApprovingReviewCount: Joi.number().min(1).max(6)
  }).unknown(false)
};

module.exports = {
  createRepositoryValidator: validate(createRepositoryValidationSchema, {
    keyByField: true,
    context: true
  }),
  searchRepositoriesValidator: validate(searchRepositoriesValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateRepositoryValidator: validate(updateRepositoryValidationSchema, {
    keyByField: true,
    context: true
  }),
  addMemberValidator: validate(addMemberValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateInvitationValidator: validate(updateInvitationValidationSchema, {
    keyByField: true,
    context: true
  }),
  updatePRReviewProtectionValidator: validate(
    updatePRReviewProtectionValidationSchema,
    {
      keyByField: true,
      context: true
    }
  )
};
