const RepositoryActionTypes = {
  FETCH_ALL_REPOSITORIES_START: 'FETCH_ALL_REPOSITORIES_START',
  FETCH_ALL_REPOSITORIES_SUCCESS: 'FETCH_ALL_REPOSITORIES_SUCCESS',
  FETCH_ALL_REPOSITORIES_FAILURE: 'FETCH_ALL_REPOSITORIES_FAILURE',

  FETCH_REPOSITORY_START: 'FETCH_REPOSITORY_START',
  FETCH_REPOSITORY_SUCCESS: 'FETCH_REPOSITORY_SUCCESS',
  FETCH_REPOSITORY_FAILURE: 'FETCH_REPOSITORY_FAILURE',

  FETCH_REPOSITORY_MEMBERS_START: 'FETCH_REPOSITORY_MEMBERS_START',
  FETCH_REPOSITORY_MEMBERS_SUCCESS: 'FETCH_REPOSITORY_MEMBERS_SUCCESS',
  FETCH_REPOSITORY_MEMBERS_FAILURE: 'FETCH_REPOSITORY_MEMBERS_FAILURE',

  SET_CURRENT_REPOSITORY: 'SET_CURRENT_REPOSITORY',

  SET_CURRENT_REPOSITORY_MEMBER: 'SET_CURRENT_REPOSITORY_MEMBER',

  ADD_REPOSITORY_MEMBER_START: 'ADD_REPOSITORY_MEMBER_START',
  ADD_REPOSITORY_MEMBER_FROM_GITHUB_START:
    'ADD_REPOSITORY_MEMBER_FROM_GITHUB_START',
  ADD_REPOSITORY_MEMBER_SUCCESS: 'ADD_REPOSITORY_MEMBER_SUCCESS',
  ADD_REPOSITORY_MEMBER_FAILURE: 'ADD_REPOSITORY_MEMBER_FAILURE',

  REMOVE_REPOSITORY_MEMBER_START: 'REMOVE_REPOSITORY_MEMBER_START',
  REMOVE_REPOSITORY_MEMBER_SUCCESS: 'REMOVE_REPOSITORY_MEMBER_SUCCESS',
  REMOVE_REPOSITORY_MEMBER_FAILURE: 'REMOVE_REPOSITORY_MEMBER_FAILURE',

  UPDATE_REPOSITORY_INVITATION_START: 'UPDATE_REPOSITORY_INVITATION_START',
  UPDATE_REPOSITORY_INVITATION_SUCCESS: 'UPDATE_REPOSITORY_INVITATION_SUCCESS',
  UPDATE_REPOSITORY_INVITATION_FAILURE: 'UPDATE_REPOSITORY_INVITATION_FAILURE'
};

export default RepositoryActionTypes;
