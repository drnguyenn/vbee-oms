import ClusterActionTypes from './cluster.types';

export const fetchAllClustersStart = () => ({
  type: ClusterActionTypes.FETCH_ALL_CLUSTERS_START
});

export const fetchAllClustersSuccess = clusters => ({
  type: ClusterActionTypes.FETCH_ALL_CLUSTERS_SUCCESS,
  payload: clusters
});

export const fetchAllClustersFailure = error => ({
  type: ClusterActionTypes.FETCH_ALL_CLUSTERS_FAILURE,
  payload: error
});

export const fetchClusterStart = id => ({
  type: ClusterActionTypes.FETCH_CLUSTER_START,
  payload: id
});

export const fetchClusterSuccess = cluster => ({
  type: ClusterActionTypes.FETCH_CLUSTER_SUCCESS,
  payload: cluster
});

export const fetchClusterFailure = error => ({
  type: ClusterActionTypes.FETCH_CLUSTER_FAILURE,
  payload: error
});

export const createClusterStart = clusterInfo => ({
  type: ClusterActionTypes.CREATE_CLUSTER_START,
  payload: clusterInfo
});

export const createClusterSuccess = cluster => ({
  type: ClusterActionTypes.CREATE_CLUSTER_SUCCESS,
  payload: cluster
});

export const createClusterFailure = error => ({
  type: ClusterActionTypes.CREATE_CLUSTER_FAILURE,
  payload: error
});

export const updateClusterStart = (id, data) => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_START,
  payload: { id, data }
});

export const updateClusterSuccess = cluster => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_SUCCESS,
  payload: cluster
});

export const updateClusterFailure = error => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_FAILURE,
  payload: error
});

export const deleteClusterStart = id => ({
  type: ClusterActionTypes.DELETE_CLUSTER_START,
  payload: id
});

export const deleteClusterSuccess = id => ({
  type: ClusterActionTypes.DELETE_CLUSTER_SUCCESS,
  payload: id
});

export const deleteClusterFailure = error => ({
  type: ClusterActionTypes.DELETE_CLUSTER_FAILURE,
  payload: error
});

export const setCurrentClusterMember = member => ({
  type: ClusterActionTypes.SET_CURRENT_CLUSTER_MEMBER,
  payload: member
});

export const addClusterMemberStart = (clusterId, userId, data) => ({
  type: ClusterActionTypes.ADD_CLUSTER_MEMBER_START,
  payload: { clusterId, userId, data }
});

export const addClusterMemberSuccess = member => ({
  type: ClusterActionTypes.ADD_CLUSTER_MEMBER_SUCCESS,
  payload: member
});

export const addClusterMemberFailure = error => ({
  type: ClusterActionTypes.ADD_CLUSTER_MEMBER_FAILURE,
  payload: error
});

export const updateClusterMemberStart = (clusterId, userId, data) => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_MEMBER_START,
  payload: { clusterId, userId, data }
});

export const updateClusterMemberSuccess = member => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_MEMBER_SUCCESS,
  payload: member
});

export const updateClusterMemberFailure = error => ({
  type: ClusterActionTypes.UPDATE_CLUSTER_MEMBER_FAILURE,
  payload: error
});

export const removeClusterMemberStart = (clusterId, userId) => ({
  type: ClusterActionTypes.REMOVE_CLUSTER_MEMBER_START,
  payload: { clusterId, userId }
});

export const removeClusterMemberSuccess = member => ({
  type: ClusterActionTypes.REMOVE_CLUSTER_MEMBER_SUCCESS,
  payload: member
});

export const removeClusterMemberFailure = error => ({
  type: ClusterActionTypes.REMOVE_CLUSTER_MEMBER_FAILURE,
  payload: error
});

export const addService = service => ({
  type: ClusterActionTypes.ADD_SERVICE,
  payload: service
});
