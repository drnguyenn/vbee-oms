const { Joi, validate } = require('express-validation');

const loginValidationSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().required()
  }).unknown(false)
};

module.exports = {
  loginValidator: validate(loginValidationSchema, {
    keyByField: true,
    context: true
  })
};
