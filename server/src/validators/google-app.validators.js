const { Joi, validate } = require('express-validation');

const oAuth2CallbackValidationSchema = {
  query: Joi.object({
    code: Joi.string().trim().required(),
    scope: Joi.string().trim().required(),
    state: Joi.string().trim().required()
  })
};

module.exports = {
  oAuth2CallbackValidator: validate(oAuth2CallbackValidationSchema, {
    keyByField: true,
    context: true
  })
};
