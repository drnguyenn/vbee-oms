const { Joi, validate } = require('express-validation');

const {
  Types: { ObjectId }
} = require('mongoose');

const mongodbObjectIdValidator = (value, helpers) => {
  if (ObjectId.isValid(value)) return value;

  return helpers.error('any.custom');
};

const searchDiagramsValidation = {
  query: Joi.object({
    q: Joi.string().trim().lowercase(),
    cluster: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  }).unknown(false)
};

const updateDiagramElementsValidation = {
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

const removeDiagramElementsValidation = {
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
      Joi.string().custom(
        mongodbObjectIdValidator,
        'MongoDB ObjectID Validator'
      )
    )
  }).unknown(false)
};

const addNodeValidation = {
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

const updateNodeValidation = {
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

const addPortValidation = {
  body: Joi.object({
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).unknown(false),
    options: Joi.object({
      in: Joi.boolean()
    })
      .unknown(false)
      .required(),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator')
      .required(),
    nodeId: Joi.string().trim().required()
  }).unknown(false)
};

const updatePortValidation = {
  body: Joi.object({
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).unknown(false),
    options: Joi.object({
      in: Joi.boolean()
    }).unknown(false),
    diagramId: Joi.string()
      .trim()
      .custom(mongodbObjectIdValidator, 'MongoDB ObjectID Validator'),
    nodeId: Joi.string().trim()
  }).unknown(false)
};

const addLinkValidation = {
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

const updateLinkValidation = {
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
  searchDiagramsValidator: validate(searchDiagramsValidation, {
    keyByField: true
  }),
  updateDiagramElementsValidator: validate(updateDiagramElementsValidation, {
    keyByField: true
  }),
  removeDiagramElementsValidator: validate(removeDiagramElementsValidation, {
    keyByField: true
  }),
  addNodeValidator: validate(addNodeValidation, {
    keyByField: true
  }),
  updateNodeValidator: validate(updateNodeValidation, {
    keyByField: true
  }),
  addPortValidator: validate(addPortValidation, {
    keyByField: true
  }),
  updatePortValidator: validate(updatePortValidation, {
    keyByField: true
  }),
  addLinkValidator: validate(addLinkValidation, {
    keyByField: true
  }),
  updateLinkValidator: validate(updateLinkValidation, {
    keyByField: true
  })
};
