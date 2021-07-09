const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchServicesValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    cluster: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    server: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    repository: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createServiceValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(''),
    version: Joi.string()
      .trim()
      .pattern(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/, {
        name: 'version'
      })
      .allow(''),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required(),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    repositoryId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const updateServiceValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    version: Joi.string()
      .trim()
      .pattern(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/, {
        name: 'version'
      })
      .allow(''),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    repositoryId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addMemberValidationSchema = {
  body: Joi.object({
    role: Joi.string().trim().valid('member', 'admin')
  }).unknown(false)
};

const updateMemberValidationSchema = {
  body: Joi.object({
    role: Joi.string().trim().valid('member', 'admin')
  }).unknown(false)
};

module.exports = {
  createServiceValidator: validate(createServiceValidationSchema, {
    keyByField: true,
    context: true
  }),
  searchServicesValidator: validate(searchServicesValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateServiceValidator: validate(updateServiceValidationSchema, {
    keyByField: true,
    context: true
  }),
  addMemberValidator: validate(addMemberValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateMemberValidator: validate(updateMemberValidationSchema, {
    keyByField: true,
    context: true
  })
};
