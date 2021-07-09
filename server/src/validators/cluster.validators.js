const { Joi, validate } = require('express-validation');

const searchClustersValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createClusterValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow('')
  }).unknown(false)
};

const updateClusterValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().allow('')
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
  createClusterValidator: validate(createClusterValidationSchema, {
    keyByField: true,
    context: true
  }),
  searchClustersValidator: validate(searchClustersValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateClusterValidator: validate(updateClusterValidationSchema, {
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
