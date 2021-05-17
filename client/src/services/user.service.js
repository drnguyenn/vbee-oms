/* eslint-disable no-console */
import customAxios from '../customs/axios.custom';

import { getCookie, setCookie } from '../utils/cookie.utils';

import { A_WEEK } from '../constants';

export const getCurrentUser = async () => {
  const accessToken = getCookie('accessToken');

  try {
    const response = await customAxios({
      method: 'GET',
      url: `/auth/verify`,
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const response = await customAxios({
      method: 'POST',
      url: `/auth/login`,
      data: { email, password }
    });

    if (response.status < 400) {
      const { accessToken } = response.data.result;
      setCookie('accessToken', accessToken, A_WEEK);

      const user = await getCurrentUser();
      return user;
    }

    const { message } = response.data;
    throw new Error(message);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const signUp = async (username, email, password) => {
  try {
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: username, email, password })
    });

    if (response.status === 201) {
      const {
        id,
        name: newUsername,
        email: newUserEmail
      } = await response.json();

      return { user: { id, username: newUsername, email: newUserEmail } };
    }

    if (response.status >= 400) {
      const { message } = await response.json();

      throw new Error(message);
    }

    return null;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateProfile = async (accessToken, userProfile) => {
  try {
    const response = await fetch(`/api/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfile)
    });

    const user = await response.json();

    const { name, avatarUrl, hobbies, topics } = user;

    return response.status === 200
      ? { user: { username: name, avatarUrl, hobbies, topics } }
      : null;
  } catch (error) {
    console.error(error.response);
    throw new Error(error.message);
  }
};

export const updateAvatar = async (accessToken, avatar) => {
  try {
    const response = await fetch(`/api/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: avatar
    });

    const user = await response.json();

    const { name, avatarUrl, hobbies, topics } = user;

    return response.status === 200
      ? { user: { username: name, avatarUrl, hobbies, topics } }
      : null;
  } catch (error) {
    console.error(error.response);
    throw new Error(error.message);
  }
};

export const searchUsers = async (query = '') => {
  const accessToken = getCookie('accessToken');

  try {
    const response = await customAxios({
      method: 'GET',
      url: `/users${query}`,
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
