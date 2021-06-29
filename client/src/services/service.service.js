/* eslint-disable no-console */
import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllServices = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/services',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { services } = response.data.result;
    return services;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchService = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/services/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { service } = response.data.result;
    return service;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const searchServices = async query => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/services',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: query
  });

  if (response.status < 400) {
    const { services } = response.data.result;
    return services;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const createService = async data => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/services',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { service } = response.data.result;
    return service;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateService = async (id, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/services/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { service } = response.data.result;
    return service;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const deleteService = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/services/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { service } = response.data.result;
    return service;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addMember = async (serviceId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: `/services/${serviceId}/members/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { member } = response.data.result;
    return member;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateMember = async (serviceId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/services/${serviceId}/members/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { member } = response.data.result;
    return member;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeMember = async (serviceId, userId) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/services/${serviceId}/members/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { member } = response.data.result;
    return member;
  }

  const { message } = response.data;
  throw new Error(message);
};
