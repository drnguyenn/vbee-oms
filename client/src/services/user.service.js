import customAxios from '../customs/axios.custom';

import { getCookie, setCookie } from '../utils/cookie.utils';

import { A_WEEK } from '../constants';

export const getCurrentUser = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/auth/verify',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status) {
    if (response.status < 400) {
      const { user } = response.data.result;
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
};

export const signInWithEmail = async (email, password) => {
  const response = await customAxios({
    method: 'POST',
    url: '/auth/login',
    data: { email, password }
  });

  if (response.status) {
    if (response.status < 400) {
      const { accessToken } = response.data.result;
      setCookie('accessToken', accessToken, A_WEEK);

      const user = await getCurrentUser();
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
};

export const signUp = async data => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/auth/register',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status) {
    if (response.status < 400) {
      const { user } = response.data.result;
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
};

export const updateProfile = async data => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: '/account/profile',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status) {
    if (response.status < 400) {
      const { user } = response.data.result;
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
};

export const updateAvatar = async avatar => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: '/account/avatar',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: avatar
  });

  if (response.status) {
    if (response.status < 400) {
      const { user } = response.data.result;
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  }

  throw new Error(response.message);
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
