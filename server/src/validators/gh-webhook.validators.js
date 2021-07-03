const { Joi, validate } = require('express-validation');

const webhookValidation = {
  headers: Joi.object({
    'x-github-delivery': Joi.string().guid().required(),
    'x-hub-signature-256': Joi.string().required(),
    'x-github-event': Joi.string().required()
  })
};

module.exports = {
  webhookValidator: validate(
    webhookValidation,
    {
      keyByField: true
    },
    {
      allowUnknown: true
    }
  )
};
