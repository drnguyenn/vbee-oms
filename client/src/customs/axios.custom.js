/* eslint-disable no-console */
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

import { getCookie } from '../utils/cookie.utils';

const customAxios = axios.create({
  baseURL: `${process.env.REACT_APP_API_DOMAIN}/api/v1`,
  transformResponse: [].concat(axios.defaults.transformResponse, data =>
    camelcaseKeys(data, { deep: true })
  )
});

customAxios.interceptors.request.use(async config => {
  const accessToken = getCookie('accessToken');
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

customAxios.interceptors.response.use(
  response => response,
  error => {
    // Handle error
    console.error(error);
    return error.response;
  }
);

export default customAxios;
