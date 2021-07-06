import RepositoryActionTypes from './repository.types';

export const fetchAllRepositoriesStart = () => ({
  type: RepositoryActionTypes.FETCH_ALL_REPOSITORIES_START
});

export const fetchAllRepositoriesSuccess = repositorys => ({
  type: RepositoryActionTypes.FETCH_ALL_REPOSITORIES_SUCCESS,
  payload: repositorys
});

export const fetchAllRepositoriesFailure = error => ({
  type: RepositoryActionTypes.FETCH_ALL_REPOSITORIES_FAILURE,
  payload: error
});

export const fetchRepositoryStart = id => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_START,
  payload: id
});

export const fetchRepositorySuccess = repository => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_SUCCESS,
  payload: repository
});

export const fetchRepositoryFailure = error => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_FAILURE,
  payload: error
});

export const fetchRepositoryMembersStart = id => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_START,
  payload: id
});

export const fetchRepositoryMembersSuccess = result => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_SUCCESS,
  payload: result
});

export const fetchRepositoryMembersFailure = error => ({
  type: RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_FAILURE,
  payload: error
});

export const setCurrentRepository = repository => ({
  type: RepositoryActionTypes.SET_CURRENT_REPOSITORY,
  payload: repository
});

export const setCurrentRepositoryMember = member => ({
  type: RepositoryActionTypes.SET_CURRENT_REPOSITORY_MEMBER,
  payload: member
});

export const addRepositoryMemberStart = (repositoryId, userId, data) => ({
  type: RepositoryActionTypes.ADD_REPOSITORY_MEMBER_START,
  payload: { repositoryId, userId, data }
});

export const addRepositoryMemberFromGitHubStart = (
  repositoryId,
  githubUsername,
  data
) => ({
  type: RepositoryActionTypes.ADD_REPOSITORY_MEMBER_FROM_GITHUB_START,
  payload: { repositoryId, githubUsername, data }
});

export const addRepositoryMemberSuccess = member => ({
  type: RepositoryActionTypes.ADD_REPOSITORY_MEMBER_SUCCESS,
  payload: member
});

export const addRepositoryMemberFailure = error => ({
  type: RepositoryActionTypes.ADD_REPOSITORY_MEMBER_FAILURE,
  payload: error
});

export const removeRepositoryMemberStart = (repositoryId, userId) => ({
  type: RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_START,
  payload: { repositoryId, userId }
});

export const removeRepositoryMemberSuccess = member => ({
  type: RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_SUCCESS,
  payload: member
});

export const removeRepositoryMemberFailure = error => ({
  type: RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_FAILURE,
  payload: error
});

export const updateRepositoryInvitationStart = (
  repositoryId,
  userId,
  data
) => ({
  type: RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_START,
  payload: { repositoryId, userId, data }
});

export const updateRepositoryInvitationSuccess = member => ({
  type: RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_SUCCESS,
  payload: member
});

export const updateRepositoryInvitationFailure = error => ({
  type: RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_FAILURE,
  payload: error
});
