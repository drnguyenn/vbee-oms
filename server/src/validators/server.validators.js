const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchServersValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    ipAddress: Joi.string()
      .trim()
      .lowercase()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    macAddress: Joi.string()
      .trim()
      .lowercase()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/
      ),
    cluster: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createServerValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    ipAddress: Joi.string()
      .trim()
      .lowercase()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      })
      .required(),
    macAddress: Joi.string()
      .trim()
      .lowercase()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/
      )
      .required(),
    domains: Joi.array().items(Joi.string().trim().domain()),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const updateServerValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    ipAddress: Joi.string()
      .trim()
      .lowercase()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    macAddress: Joi.string()
      .trim()
      .lowercase()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/
      ),
    domains: Joi.array().items(Joi.string().trim().domain()),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addDomainValidationSchema = {
  body: Joi.object({
    value: Joi.string().trim().domain().required()
  }).unknown(false)
};

const updateDomainValidationSchema = {
  body: Joi.object({
    value: Joi.string().trim().domain()
  }).unknown(false)
};

const getServersMetricsValidationSchema = {
  query: Joi.object({
    ids: Joi.array()
      .items(
        Joi.string()
          .trim()
          .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      )
      .required()
  }).unknown(false)
};

module.exports = {
  searchServersValidator: validate(searchServersValidationSchema, {
    keyByField: true,
    context: true
  }),
  createServerValidator: validate(createServerValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateServerValidator: validate(updateServerValidationSchema, {
    keyByField: true,
    context: true
  }),
  addDomainValidator: validate(addDomainValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateDomainValidator: validate(updateDomainValidationSchema, {
    keyByField: true,
    context: true
  }),
  getServersMetricsValidator: validate(getServersMetricsValidationSchema, {
    keyByField: true,
    context: true
  })
};
