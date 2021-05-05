const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-await-in-loop': 0,
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    'global-require': 0
  },
  globals: {},
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@configs', path.resolve(__dirname, './src/configs')],
          ['@constants', path.resolve(__dirname, './src/constants')],
          ['@controllers', path.resolve(__dirname, './src/controllers')],
          ['@customs', path.resolve(__dirname, './src/customs')],
          ['@daos', path.resolve(__dirname, './src/daos')],
          ['@errors', path.resolve(__dirname, './src/errors')],
          ['@middlewares', path.resolve(__dirname, './src/middlewares')],
          ['@models', path.resolve(__dirname, './src/models')],
          ['@routes', path.resolve(__dirname, './src/routes')],
          ['@services', path.resolve(__dirname, './src/services')],
          ['@utils', path.resolve(__dirname, './src/utils')],
          ['@validators', path.resolve(__dirname, './src/validators')]
        ]
      }
    }
  }
};
