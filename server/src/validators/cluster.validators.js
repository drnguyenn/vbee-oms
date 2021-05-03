const { Joi, validate } = require('express-validation');

const searchClustersValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    name: Joi.string().trim(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const createClusterValidation = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow('')
  }).unknown(false)
};

const updateClusterValidation = {
  body: Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().allow('')
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
  createClusterValidator: validate(createClusterValidation, {
    keyByField: true
  }),
  searchClustersValidator: validate(searchClustersValidation, {
    keyByField: true
  }),
  updateClusterValidator: validate(updateClusterValidation, {
    keyByField: true
  }),
  addMemberValidator: validate(addMemberValidation, {
    keyByField: true
  }),
  updateMemberValidator: validate(updateMemberValidation, {
    keyByField: true
  })
};
