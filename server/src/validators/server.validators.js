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
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    service: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createServerValidation = {
  body: Joi.object({
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    domains: Joi.array().items(Joi.string().trim().domain()),
    serviceId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required()
  }).unknown(false)
};

const updateServerValidation = {
  body: Joi.object({
    ipAddress: Joi.string()
      .trim()
      .ip({
        version: ['ipv4', 'ipv6', 'ipvfuture']
      }),
    serviceId: Joi.string()
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
  })
};
