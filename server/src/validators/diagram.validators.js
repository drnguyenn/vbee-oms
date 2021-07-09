const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchDiagramsValidationSchema = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    cluster: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const updateDiagramElementsValidationSchema = {
  body: Joi.object({
    nodes: Joi.object().pattern(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
      Joi.object({
        name: Joi.string().trim(),
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        }).unknown(false)
      })
    ),
    ports: Joi.object().pattern(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
      Joi.object({
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        }).unknown(false),
        options: Joi.object({
          in: Joi.boolean()
        }).unknown(false),
        nodeId: Joi.string().trim()
      })
    ),
    links: Joi.object().pattern(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
      Joi.object({
        sourcePortId: Joi.string().trim(),
        targetPortId: Joi.string().trim(),
        points: Joi.array().items(
          Joi.object({
            position: Joi.object({
              x: Joi.number().required(),
              y: Joi.number().required()
            })
              .unknown(false)
              .required()
          }).unknown(false)
        )
      })
    )
  }).unknown(false)
};

const removeDiagramElementsValidationSchema = {
  body: Joi.object({
    nodes: Joi.array().items(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
    ),
    ports: Joi.array().items(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
    ),
    links: Joi.array().items(
      Joi.string()
        .trim()
        .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
    )
  }).unknown(false)
};

const addNodeValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    })
      .unknown(false)
      .required(),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required(),
    serviceId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const updateNodeValidationSchema = {
  body: Joi.object({
    name: Joi.string().trim().allow(''),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).unknown(false),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    serviceId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

const addPortValidationSchema = {
  body: Joi.object({
    options: Joi.object({
      in: Joi.boolean(),
      alignment: Joi.string().valid('top', 'right', 'bottom', 'left')
    }).unknown(false),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required(),
    nodeId: Joi.string().trim().required()
  }).unknown(false)
};

const updatePortValidationSchema = {
  body: Joi.object({
    options: Joi.object({
      in: Joi.boolean()
    }).unknown(false),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    nodeId: Joi.string().trim()
  }).unknown(false)
};

const addLinkValidationSchema = {
  body: Joi.object({
    sourcePortId: Joi.string().trim(),
    targetPortId: Joi.string().trim(),
    points: Joi.array().items(
      Joi.object({
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        })
          .unknown(false)
          .required()
      }).unknown(false)
    ),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required()
  }).unknown(false)
};

const updateLinkValidationSchema = {
  body: Joi.object({
    sourcePortId: Joi.string().trim(),
    targetPortId: Joi.string().trim(),
    points: Joi.array().items(
      Joi.object({
        position: Joi.object({
          x: Joi.number().required(),
          y: Joi.number().required()
        })
          .unknown(false)
          .required()
      }).unknown(false)
    ),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
  }).unknown(false)
};

module.exports = {
  searchDiagramsValidator: validate(searchDiagramsValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateDiagramElementsValidator: validate(
    updateDiagramElementsValidationSchema,
    {
      keyByField: true,
      context: true
    }
  ),
  removeDiagramElementsValidator: validate(
    removeDiagramElementsValidationSchema,
    {
      keyByField: true,
      context: true
    }
  ),
  addNodeValidator: validate(addNodeValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateNodeValidator: validate(updateNodeValidationSchema, {
    keyByField: true,
    context: true
  }),
  addPortValidator: validate(addPortValidationSchema, {
    keyByField: true,
    context: true
  }),
  updatePortValidator: validate(updatePortValidationSchema, {
    keyByField: true,
    context: true
  }),
  addLinkValidator: validate(addLinkValidationSchema, {
    keyByField: true,
    context: true
  }),
  updateLinkValidator: validate(updateLinkValidationSchema, {
    keyByField: true,
    context: true
  })
};
