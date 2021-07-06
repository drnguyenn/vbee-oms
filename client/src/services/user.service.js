import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllUsers = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/users',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { users } = response.data.result;
    return users;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchUser = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/users/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { user } = response.data.result;
    return user;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const searchUsers = async (query, githubSearch = false) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/users',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: { ...query, githubSearch }
  });

  if (response.status < 400) {
    const { users } = response.data.result;
    return users;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const createUser = async ({ name, description }) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/users',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: { name, description }
  });

  if (response.status < 400) {
    const { user } = response.data.result;
    return user;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateUser = async (id, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/users/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { user } = response.data.result;
    return user;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const deleteUser = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/users/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { user } = response.data.result;
    return user;
  }

  const { message } = response.data;
  throw new Error(message);
};
