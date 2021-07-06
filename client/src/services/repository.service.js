import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllRepositories = async () => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/repositories',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { repositories } = response.data.result;
    return repositories;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchRepository = async id => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/repositories/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { repository } = response.data.result;
    return repository;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const searchRepositories = async query => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: '/repositories',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: query
  });

  if (response.status < 400) {
    const { repositories } = response.data.result;
    return repositories;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const fetchMembers = async repositoryId => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'GET',
    url: `/repositories/${repositoryId}/members`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) return response.data.result;

  const { message } = response.data;
  throw new Error(message);
};

export const addMember = async (repositoryId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: `/repositories/${repositoryId}/members/${userId}`,
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

export const addMemberFromGitHub = async (
  repositoryId,
  githubUsername,
  data
) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: `/repositories/${repositoryId}/github-members/${githubUsername}`,
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

export const removeMember = async (repositoryId, userId) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/repositories/${repositoryId}/members/${userId}`,
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

export const updateInvitation = async (repositoryId, userId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PATCH',
    url: `/repositories/${repositoryId}/members/${userId}`,
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
