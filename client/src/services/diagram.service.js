import customAxios from '../customs/axios.custom';

import { getCookie } from '../utils/cookie.utils';

export const fetchClusterDiagram = async clusterId => {
  const accessToken = getCookie('accessToken');

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
};

export const updateClusterDiagramElements = async elements => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: '/diagram-elements',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: elements
  });

  if (response.status < 400) {
    const { status } = response.data;

    return status;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeClusterDiagramElements = async elements => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: '/diagram-elements',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: elements
  });

  if (response.status < 400) {
    const { status } = response.data;

    return status;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addClusterDiagramNode = async node => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/diagram-nodes',
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
};

export const updateClusterDiagramNode = async (nodeId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/diagram-nodes/${nodeId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { diagramNode } = response.data.result;

    return diagramNode;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeClusterDiagramNode = async nodeId => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/diagram-nodes/${nodeId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { diagramNode } = response.data.result;

    return diagramNode;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addClusterDiagramPort = async port => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/diagram-ports',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: port
  });

  if (response.status < 400) {
    const { diagramPort } = response.data.result;

    return diagramPort;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateClusterDiagramPort = async (portId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/diagram-ports/${portId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { diagramPort } = response.data.result;

    return diagramPort;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeClusterDiagramPort = async portId => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/diagram-ports/${portId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { diagramPort } = response.data.result;

    return diagramPort;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const addClusterDiagramLink = async link => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'POST',
    url: '/diagram-links',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data: link
  });

  if (response.status < 400) {
    const { diagramLink } = response.data.result;

    return diagramLink;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const updateClusterDiagramLink = async (linkId, data) => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'PUT',
    url: `/diagram-links/${linkId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    data
  });

  if (response.status < 400) {
    const { diagramLink } = response.data.result;

    return diagramLink;
  }

  const { message } = response.data;
  throw new Error(message);
};

export const removeClusterDiagramLink = async linkId => {
  const accessToken = getCookie('accessToken');

  const response = await customAxios({
    method: 'DELETE',
    url: `/diagram-links/${linkId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status < 400) {
    const { diagramLink } = response.data.result;

    return diagramLink;
  }

  const { message } = response.data;
  throw new Error(message);
};
