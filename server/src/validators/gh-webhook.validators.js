const { Joi, validate } = require('express-validation');

const webhookValidationSchema = {
  headers: Joi.object({
    'x-github-delivery': Joi.string().trim().guid().required(),
    'x-hub-signature-256': Joi.string().trim().required(),
    'x-github-event': Joi.string().trim().required()
  })
};

module.exports = {
  webhookValidator: validate(
    webhookValidationSchema,
    {
      keyByField: true,
      context: true
    },
    {
      allowUnknown: true
    }
  )
};
