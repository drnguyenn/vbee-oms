import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllServers = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/servers',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { servers } = response.data.result;
    return servers;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchServer = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/servers/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { server } = response.data.result;
    return server;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const searchServers = async query => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/servers',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: query
  });

  if (response.status < 400) {
    const { servers } = response.data.result;
    return servers;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const createServer = async data => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/servers',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { server } = response.data.result;
    return server;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateServer = async (id, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/servers/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { server } = response.data.result;
    return server;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const deleteServer = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/servers/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { server } = response.data.result;
    return server;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchMetrics = async (serverIds = []) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/servers/metrics',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: { ids: serverIds }
  });

  if (response.status < 400) {
    const { result } = response.data;

    // Convert all keys to lower case
    return Object.keys(result).reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue.toLowerCase()]: result[currentValue]
      }),
      {}
    );
  }
  const { message } = response.data;
  throw new Error(message);
};

export const getAllServerDomainsSslStatus = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/servers/${id}/ssl`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const {
      server: { domains }
    } = response.data.result;
    return domains;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addDomain = async (serverId, domains) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/domains',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: { serverId, domains }
  });

  if (response.status < 400) {
    const { domains: newDomains } = response.data.result;
    return newDomains;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateDomain = async (domainId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/domains/${domainId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { domain } = response.data.result;
    return domain;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeDomain = async domainId => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/domains/${domainId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { domain } = response.data.result;
    return domain;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const getDomainsSslStatus = async domainsToCheck => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/domains/ssl',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    params: { domains: domainsToCheck }
  });

  if (response.status < 400) {
    const { domains } = response.data.result;
    return domains;
  }

  const { message } = response.data;
  throw new Error(message);
};
