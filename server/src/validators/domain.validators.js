const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchDomainsValidation = {
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

const createDomainValidation = {
  body: Joi.object({
    domains: Joi.array().unique().items(Joi.string().trim().domain()),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required()
  }).unknown(false)
};

const updateDomainValidation = {
  body: Joi.object({
    value: Joi.string().trim().domain(),
    serverId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const getDomainsSslStatusValidation = {
  query: Joi.object({
    domains: Joi.array().unique().items(Joi.string().trim().domain()).required()
  }).unknown(false)
};

module.exports = {
  searchDomainsValidator: validate(searchDomainsValidation, {
    keyByField: true
  }),
  createDomainValidator: validate(createDomainValidation, {
    keyByField: true
  }),
  updateDomainValidator: validate(updateDomainValidation, {
    keyByField: true
  }),
  getDomainsSslStatusValidator: validate(getDomainsSslStatusValidation, {
    keyByField: true
  })
};
