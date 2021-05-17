/* eslint-disable no-console */
import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchAllClusters = async () => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const fetchCluster = async id => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const createCluster = async ({ name, description }) => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateCluster = async (id, data) => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const deleteCluster = async id => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const addMember = async (clusterId, userId, data) => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const updateMember = async (clusterId, userId, data) => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const removeMember = async (clusterId, userId) => {
  const accessToken = getCookie('accessToken');

  try {
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
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const fetchClusterDiagram = async clusterId => {
  const accessToken = getCookie('accessToken');

  try {
    const response = await customAxios({
      method: 'GET',
      url: `/diagrams?cluster=${clusterId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status < 400) {
      const { diagrams } = response.data.result;

      if (!diagrams.length) throw new Error('Cluster diagram not found');

      return diagrams[0];
    }

    const { message } = response.data;
    throw new Error(message);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const addClusterDiagramNode = async (diagramId, node) => {
  const accessToken = getCookie('accessToken');

  try {
    const response = await customAxios({
      method: 'POST',
      url: `/diagrams/${diagramId}/nodes`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: node
    });

    if (response.status < 400) {
      const { diagramNode } = response.data.result;

      return diagramNode;
    }

    const { message } = response.data;
    throw new Error(message);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
