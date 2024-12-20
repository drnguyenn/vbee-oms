import UserActionTypes from './user.types';

export const fetchAllUsersStart = () => ({
  type: UserActionTypes.FETCH_ALL_USERS_START
});

export const fetchAllUsersSuccess = users => ({
  type: UserActionTypes.FETCH_ALL_USERS_SUCCESS,
  payload: users
});

export const fetchAllUsersFailure = error => ({
  type: UserActionTypes.FETCH_ALL_USERS_FAILURE,
  payload: error
});

export const fetchUserStart = id => ({
  type: UserActionTypes.FETCH_USER_START,
  payload: id
});

export const fetchUserSuccess = user => ({
  type: UserActionTypes.FETCH_USER_SUCCESS,
  payload: user
});

export const fetchUserFailure = error => ({
  type: UserActionTypes.FETCH_USER_FAILURE,
  payload: error
});

export const createUserStart = userInfo => ({
  type: UserActionTypes.CREATE_USER_START,
  payload: userInfo
});

export const createUserSuccess = user => ({
  type: UserActionTypes.CREATE_USER_SUCCESS,
  payload: user
});

export const createUserFailure = error => ({
  type: UserActionTypes.CREATE_USER_FAILURE,
  payload: error
});

export const updateUserStart = (id, data) => ({
  type: UserActionTypes.UPDATE_USER_START,
  payload: { id, data }
});

export const updateUserSuccess = user => ({
  type: UserActionTypes.UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserFailure = error => ({
  type: UserActionTypes.UPDATE_USER_FAILURE,
  payload: error
});

export const deleteUserStart = id => ({
  type: UserActionTypes.DELETE_USER_START,
  payload: id
});

export const deleteUserSuccess = id => ({
  type: UserActionTypes.DELETE_USER_SUCCESS,
  payload: id
});

export const deleteUserFailure = error => ({
  type: UserActionTypes.DELETE_USER_FAILURE,
  payload: error
});

export const setSelectedUser = user => ({
  type: UserActionTypes.SET_SELECTED_USER,
  payload: user
});

export const removeUserFromAllClustersStart = id => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_START,
  payload: id
});

export const removeUserFromAllClustersSuccess = () => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_SUCCESS
});

export const removeUserFromAllClustersFailure = error => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_FAILURE,
  payload: error
});

export const removeUserFromAllServicesStart = id => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_SERVICES_START,
  payload: id
});

export const removeUserFromAllServicesSuccess = () => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_SERVICES_SUCCESS
});

export const removeUserFromAllServicesFailure = error => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_SERVICES_FAILURE,
  payload: error
});

export const removeUserFromAllRepositoriesStart = id => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_REPOS_START,
  payload: id
});

export const removeUserFromAllRepositoriesSuccess = () => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_REPOS_SUCCESS
});

export const removeUserFromAllRepositoriesFailure = error => ({
  type: UserActionTypes.REMOVE_USER_FROM_ALL_REPOS_FAILURE,
  payload: error
});
