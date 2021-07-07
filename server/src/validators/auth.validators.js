const { Joi, validate } = require('express-validation');

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().required()
  }).unknown(false)
};

module.exports = {
  loginValidator: validate(loginValidation, { keyByField: true })
};
