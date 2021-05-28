const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchServicesValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createServiceValidation = {
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
      .required()
  }).unknown(false)
};

const updateServiceValidation = {
  body: Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().allow(''),
    version: Joi.string()
      .trim()
      .pattern(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/, {
        name: 'version'
      })
      .allow(''),
    status: Joi.string().trim().valid('healthy', 'unhealthy'),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addMemberValidation = {
  body: Joi.object({
    role: Joi.string().trim().valid('member', 'admin')
  }).unknown(false)
};

const updateMemberValidation = {
  body: Joi.object({
    role: Joi.string().trim().valid('member', 'admin')
  }).unknown(false)
};

module.exports = {
  createServiceValidator: validate(createServiceValidation, {
    keyByField: true
  }),
  searchServicesValidator: validate(searchServicesValidation, {
    keyByField: true
  }),
  updateServiceValidator: validate(updateServiceValidation, {
    keyByField: true
  }),
  addMemberValidator: validate(addMemberValidation, {
    keyByField: true
  }),
  updateMemberValidator: validate(updateMemberValidation, {
    keyByField: true
  })
};
