const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchServersValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    macAddress: Joi.string()
      .trim()
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

const createServerValidation = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      })
      .required(),
    macAddress: Joi.string()
      .trim()
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

const updateServerValidation = {
  body: Joi.object({
    name: Joi.string().trim(),
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    macAddress: Joi.string()
      .trim()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/
      ),
    domains: Joi.array().items(Joi.string().trim().domain()),
    clusterId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addDomainValidation = {
  body: Joi.object({
    value: Joi.string().trim().domain().required()
  }).unknown(false)
};

const updateDomainValidation = {
  body: Joi.object({
    value: Joi.string().trim().domain()
  }).unknown(false)
};

const getServersMetricsValidation = {
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
  searchServersValidator: validate(searchServersValidation, {
    keyByField: true
  }),
  createServerValidator: validate(createServerValidation, {
    keyByField: true
  }),
  updateServerValidator: validate(updateServerValidation, {
    keyByField: true
  }),
  addDomainValidator: validate(addDomainValidation, {
    keyByField: true
  }),
  updateDomainValidator: validate(updateDomainValidation, {
    keyByField: true
  }),
  getServersMetricsValidator: validate(getServersMetricsValidation, {
    keyByField: true
  })
};
