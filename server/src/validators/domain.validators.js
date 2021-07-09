const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchDomainsValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    value: Joi.string().trim().domain(),
    server: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createDomainValidationSchema = {
  body: Joi.object({
    domains: Joi.array()
      .unique()
      .items(Joi.string().trim().domain())
      .required(),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required()
  }).unknown(false)
};

const updateDomainValidationSchema = {
  body: Joi.object({
    value: Joi.string().trim().domain(),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const getDomainsSslStatusValidationSchema = {
  query: Joi.object({
    domains: Joi.array().unique().items(Joi.string().trim().domain()).required()
  }).unknown(false)
};

module.exports = {
  searchDomainsValidator: validate(searchDomainsValidationSchema, {
    keyByField: true,
    context: true
  }),
  createDomainValidator: validate(createDomainValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateDomainValidator: validate(updateDomainValidationSchema, {
    keyByField: true,
    context: true
  }),
  getDomainsSslStatusValidator: validate(getDomainsSslStatusValidationSchema, {
    keyByField: true,
    context: true
  })
};
