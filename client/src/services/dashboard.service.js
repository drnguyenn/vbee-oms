import customAxios from 'customs/axios.custom';

import { getCookie } from 'utils/cookie.utils';

export const fetchOverallStatistics = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/statistics',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status) {
    if (response.status < 400) return response.data.result;

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
};
