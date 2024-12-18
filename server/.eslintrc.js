const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  globals: {},
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn', prettierOptions],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'warn',
    // 'no-await-in-loop': 'off',
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'global-require': 'off',
    'one-var': 'off'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@credentials', path.resolve(__dirname, './credentials')],
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
