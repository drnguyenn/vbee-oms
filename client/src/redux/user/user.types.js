const UserActionTypes = {
  FETCH_ALL_USERS_START: 'FETCH_ALL_USERS_START',
  FETCH_ALL_USERS_SUCCESS: 'FETCH_ALL_USERS_SUCCESS',
  FETCH_ALL_USERS_FAILURE: 'FETCH_ALL_USERS_FAILURE',

  FETCH_USER_START: 'FETCH_USER_START',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',

  CREATE_USER_START: 'CREATE_USER_START',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',

  UPDATE_USER_START: 'UPDATE_USER_START',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',

  DELETE_USER_START: 'DELETE_USER_START',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  DELETE_USER_FAILURE: 'DELETE_USER_FAILURE',

  SET_SELECTED_USER: 'SET_SELECTED_USER',

  REMOVE_USER_FROM_ALL_CLUSTERS_START: 'REMOVE_USER_FROM_ALL_CLUSTERS_START',
  REMOVE_USER_FROM_ALL_CLUSTERS_SUCCESS:
    'REMOVE_USER_FROM_ALL_CLUSTERS_SUCCESS',
  REMOVE_USER_FROM_ALL_CLUSTERS_FAILURE:
    'REMOVE_USER_FROM_ALL_CLUSTERS_FAILURE',

  REMOVE_USER_FROM_ALL_SERVICES_START: 'REMOVE_USER_FROM_ALL_SERVICES_START',
  REMOVE_USER_FROM_ALL_SERVICES_SUCCESS:
    'REMOVE_USER_FROM_ALL_SERVICES_SUCCESS',
  REMOVE_USER_FROM_ALL_SERVICES_FAILURE:
    'REMOVE_USER_FROM_ALL_SERVICES_FAILURE',

  REMOVE_USER_FROM_ALL_REPOS_START: 'REMOVE_USER_FROM_ALL_REPOS_START',
  REMOVE_USER_FROM_ALL_REPOS_SUCCESS: 'REMOVE_USER_FROM_ALL_REPOS_SUCCESS',
  REMOVE_USER_FROM_ALL_REPOS_FAILURE: 'REMOVE_USER_FROM_ALL_REPOS_FAILURE'
};

export default UserActionTypes;
