/* eslint-disable no-console */
import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllClusters = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/clusters',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { clusters } = response.data.result;
    return clusters;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchCluster = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/clusters/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { cluster } = response.data.result;
    return cluster;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const createCluster = async ({ name, description }) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/clusters',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: { name, description }
  });

  if (response.status < 400) {
    const { cluster } = response.data.result;
    return cluster;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateCluster = async (id, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/clusters/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { cluster } = response.data.result;
    return cluster;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const deleteCluster = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/clusters/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { cluster } = response.data.result;
    return cluster;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addMember = async (clusterId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: `/clusters/${clusterId}/members/${userId}`,
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

export const updateMember = async (clusterId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/clusters/${clusterId}/members/${userId}`,
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

export const removeMember = async (clusterId, userId) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/clusters/${clusterId}/members/${userId}`,
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
