const { Joi, validate } = require('express-validation');

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
    status: Joi.string().trim().valid('healthy', 'unhealthy'),
    server: Joi.object({
      ipAddress: Joi.string()
        .trim()
        .ip({
          version: ['ipv4', 'ipv6']
        })
        .allow(''),
      domain: Joi.string()
        .trim()
        .uri({
          scheme: ['git', 'http', 'https', 'ftp', 'tcp', 'udp', 'smtp']
        })
        .allow(''),
      ssl: Joi.object({
        lastPurchaseAt: Joi.date(),
        expiresAt: Joi.date()
      }).unknown(false)
    }).unknown(false),
    clusterId: Joi.string().trim().required()
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
    server: Joi.object({
      ipAddress: Joi.string()
        .trim()
        .ip({
          version: ['ipv4', 'ipv6']
        })
        .allow(''),
      domain: Joi.string()
        .trim()
        .uri({
          scheme: ['git', 'http', 'https', 'ftp', 'tcp', 'udp', 'smtp']
        })
        .allow(''),
      ssl: Joi.object({
        lastPurchaseAt: Joi.date(),
        expiresAt: Joi.date()
      }).unknown(false)
    }).unknown(false),
    clusterId: Joi.string().trim()
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
