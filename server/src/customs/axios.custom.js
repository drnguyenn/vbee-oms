/* eslint-disable no-console */
const axios = require('axios');
const camelcaseKeys = require('camelcase-keys');

const customAxios = axios.create({
  transformResponse: [].concat(axios.defaults.transformResponse, data =>
    camelcaseKeys(data, { deep: true })
  )
});

customAxios.interceptors.response.use(
  response => response,
  error => {
    // Handle error
    console.error(error);
    return error.response;
  }
);

module.exports = customAxios;
