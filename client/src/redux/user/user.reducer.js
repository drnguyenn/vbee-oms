import UserActionTypes from './user.types';

const INITIAL_STATE = {
  users: [],
  selectedUser: null,
  isFetchingUsers: false,
  isFetchingCurrentUser: false,
  isProcessing: false,
  isUpdatingInfo: false,
  error: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case UserActionTypes.FETCH_ALL_USERS_START:
      return {
        ...state,
        isFetchingUsers: true,
        error: null
      };

    case UserActionTypes.FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: payload,
        isFetchingUsers: false,
        error: null
      };

    case UserActionTypes.FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        users: [],
        isFetchingUsers: false,
        error: payload
      };

    case UserActionTypes.FETCH_USER_START:
      return {
        ...state,
        isFetchingCurrentUser: true,
        error: null
      };

    case UserActionTypes.FETCH_USER_SUCCESS:
      return {
        ...state,
        selectedUser: payload,
        isFetchingCurrentUser: false,
        error: null
      };

    case UserActionTypes.FETCH_USER_FAILURE:
      return {
        ...state,
        selectedUser: null,
        isFetchingCurrentUser: false,
        error: payload
      };

    case UserActionTypes.CREATE_USER_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case UserActionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, payload],
        isProcessing: false,
        error: null
      };

    case UserActionTypes.CREATE_USER_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case UserActionTypes.UPDATE_USER_START:
      return {
        ...state,
        isUpdatingInfo: true,
        error: null
      };

    case UserActionTypes.UPDATE_USER_SUCCESS: {
      const { id, ...rest } = payload;

      return {
        ...state,
        selectedUser: { ...state.selectedUser, ...rest },
        users: state.users.map(user =>
          user.id === payload.id ? { ...user, ...rest } : user
        ),
        isUpdatingInfo: false,
        error: null
      };
    }

    case UserActionTypes.UPDATE_USER_FAILURE:
      return {
        ...state,
        isUpdatingInfo: false,
        error: payload
      };

    case UserActionTypes.DELETE_USER_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case UserActionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        selectedUser: null,
        users: state.users.filter(user => user.id !== payload.id),
        isProcessing: false,
        error: null
      };

    case UserActionTypes.DELETE_USER_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case UserActionTypes.SET_SELECTED_USER: {
      return {
        ...state,
        selectedUser: payload
      };
    }

    case UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_SUCCESS:
      return {
        ...state,
        selectedUser: { ...state.selectedUser, clusters: [], clusterCount: 0 },
        isProcessing: false,
        error: null
      };

    case UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    default:
      return state;
  }
};

export default userReducer;
