const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: [
    'airbnb',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'prettier'
  ],
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['warn', prettierOptions],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-unused-vars': 'warn'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['assets', path.resolve(__dirname, 'src/assets')],
          ['components', path.resolve(__dirname, 'src/components')],
          ['constants', path.resolve(__dirname, 'src/constants')],
          ['customs', path.resolve(__dirname, 'src/customs')],
          ['modals', path.resolve(__dirname, 'src/modals')],
          ['pages', path.resolve(__dirname, 'src/pages')],
          ['redux', path.resolve(__dirname, 'src/redux')],
          ['router', path.resolve(__dirname, 'src/router')],
          ['services', path.resolve(__dirname, 'src/services')],
          ['themes', path.resolve(__dirname, 'src/themes')],
          ['utils', path.resolve(__dirname, 'src/utils')]
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    }
  }
};
