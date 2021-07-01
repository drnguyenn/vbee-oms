import ClusterActionTypes from 'redux/cluster/cluster.types';
import ServerActionTypes from 'redux/server/server.types';
import ServiceActionTypes from 'redux/service/service.types';

const INITIAL_STATE = {
  clusters: [],
  currentCluster: null,
  currentMember: null,
  diagram: null,
  isFetchingClusters: false,
  isFetchingCurrentCluster: false,
  isProcessing: false,
  isUpdatingInfo: false,
  isAddingMembers: false,
  isUpdatingMembers: false,
  isRemovingMembers: false,
  error: null
};

const clusterReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ClusterActionTypes.FETCH_ALL_CLUSTERS_START:
      return {
        ...state,
        isFetchingClusters: true,
        error: null
      };

    case ClusterActionTypes.FETCH_ALL_CLUSTERS_SUCCESS:
      return {
        ...state,
        clusters: payload,
        isFetchingClusters: false,
        error: null
      };

    case ClusterActionTypes.FETCH_ALL_CLUSTERS_FAILURE:
      return {
        ...state,
        clusters: [],
        isFetchingClusters: false,
        error: payload
      };

    case ClusterActionTypes.FETCH_CLUSTER_START:
      return {
        ...state,
        isFetchingCurrentCluster: true,
        error: null
      };

    case ClusterActionTypes.FETCH_CLUSTER_SUCCESS:
      return {
        ...state,
        currentCluster: payload,
        isFetchingCurrentCluster: false,
        error: null
      };

    case ClusterActionTypes.FETCH_CLUSTER_FAILURE:
      return {
        ...state,
        currentCluster: null,
        isFetchingCurrentCluster: false,
        error: payload
      };

    case ClusterActionTypes.CREATE_CLUSTER_START:
      return {
        ...state,
        clusters: [...state.clusters, { ...payload, isNew: true }],
        isProcessing: true,
        error: null
      };

    case ClusterActionTypes.CREATE_CLUSTER_SUCCESS:
      return {
        ...state,
        clusters: state.clusters.map(cluster =>
          cluster.isNew ? payload : cluster
        ),
        isProcessing: false,
        error: null
      };

    case ClusterActionTypes.CREATE_CLUSTER_FAILURE:
      return {
        ...state,
        clusters: state.clusters.filter(cluster => !cluster.isNew),
        isProcessing: false,
        error: payload
      };

    case ClusterActionTypes.UPDATE_CLUSTER_START:
      return {
        ...state,
        isUpdatingInfo: true,
        error: null
      };

    case ClusterActionTypes.UPDATE_CLUSTER_SUCCESS: {
      const { id, ...rest } = payload;

      return {
        ...state,
        currentCluster: { ...state.currentCluster, ...rest },
        clusters: state.clusters.map(cluster =>
          cluster.id === payload.id ? { ...cluster, ...rest } : cluster
        ),
        isUpdatingInfo: false,
        error: null
      };
    }

    case ClusterActionTypes.UPDATE_CLUSTER_FAILURE:
      return {
        ...state,
        isUpdatingInfo: false,
        error: payload
      };

    case ClusterActionTypes.DELETE_CLUSTER_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case ClusterActionTypes.DELETE_CLUSTER_SUCCESS:
      return {
        ...state,
        currentCluster: null,
        clusters: state.clusters.filter(cluster => cluster.id !== payload.id),
        isProcessing: false,
        error: null
      };

    case ClusterActionTypes.DELETE_CLUSTER_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case ClusterActionTypes.SET_CURRENT_CLUSTER: {
      return {
        ...state,
        currentCluster: payload
      };
    }

    case ClusterActionTypes.SET_CURRENT_CLUSTER_MEMBER:
      return {
        ...state,
        currentMember: payload
      };

    case ClusterActionTypes.ADD_CLUSTER_MEMBER_START:
      return {
        ...state,
        isAddingMembers: true,
        error: null
      };

    case ClusterActionTypes.ADD_CLUSTER_MEMBER_SUCCESS:
      return {
        ...state,
        isAddingMembers: false,
        currentCluster: {
          ...state.currentCluster,
          memberCount: state.currentCluster.memberCount + 1,
          members: [...state.currentCluster.members, payload]
        },
        error: null
      };

    case ClusterActionTypes.ADD_CLUSTER_MEMBER_FAILURE:
      return {
        ...state,
        isAddingMembers: false,
        error: payload
      };

    case ClusterActionTypes.UPDATE_CLUSTER_MEMBER_START:
      return {
        ...state,
        isUpdatingMembers: true,
        error: null
      };

    case ClusterActionTypes.UPDATE_CLUSTER_MEMBER_SUCCESS:
      return {
        ...state,
        isUpdatingMembers: false,
        currentCluster: {
          ...state.currentCluster,
          members: state.currentCluster.members.map(member =>
            member.user.id === payload.user.id ? payload : member
          )
        },
        error: null
      };

    case ClusterActionTypes.UPDATE_CLUSTER_MEMBER_FAILURE:
      return {
        ...state,
        isUpdatingMembers: false,
        error: payload
      };

    case ClusterActionTypes.REMOVE_CLUSTER_MEMBER_START:
      return {
        ...state,
        isRemovingMembers: true,
        error: null
      };

    case ClusterActionTypes.REMOVE_CLUSTER_MEMBER_SUCCESS:
      return {
        ...state,
        isRemovingMembers: false,
        currentMember: null,
        currentCluster: {
          ...state.currentCluster,
          memberCount: state.currentCluster.memberCount - 1,
          members: state.currentCluster.members.filter(
            member => member.user.id !== payload.user
          )
        },
        error: null
      };

    case ClusterActionTypes.REMOVE_CLUSTER_MEMBER_FAILURE:
      return {
        ...state,
        isRemovingMembers: false,
        error: payload
      };

    case ServerActionTypes.CREATE_SERVER_SUCCESS:
      return {
        ...state,
        currentCluster:
          state.currentCluster && state.currentCluster.id === payload.cluster.id
            ? {
                ...state.currentCluster,
                serverCount: state.currentCluster.serverCount + 1,
                servers: [...state.currentCluster.servers, payload]
              }
            : state.currentCluster
      };

    case ServiceActionTypes.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        currentCluster:
          state.currentCluster && state.currentCluster.id === payload.cluster.id
            ? {
                ...state.currentCluster,
                serviceCount: state.currentCluster.serviceCount + 1,
                services: [...state.currentCluster.services, payload]
              }
            : state.currentCluster
      };

    default:
      return state;
  }
};

export default clusterReducer;
