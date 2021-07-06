import RepositoryActionTypes from 'redux/repository/repository.types';
import ServiceActionTypes from 'redux/service/service.types';

const INITIAL_STATE = {
  repositories: [],
  currentRepository: null,
  currentMember: null,
  diagram: null,
  isFetchingRepositories: false,
  isFetchingCurrentRepository: false,
  isProcessing: false,
  isUpdatingInfo: false,
  isFetchingMembers: false,
  isAddingMembers: false,
  isUpdatingMembers: false,
  isRemovingMembers: false,
  isUpdatingInvitation: false,
  error: null
};

const repositoryReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case RepositoryActionTypes.FETCH_ALL_REPOSITORIES_START:
      return {
        ...state,
        isFetchingRepositories: true,
        error: null
      };

    case RepositoryActionTypes.FETCH_ALL_REPOSITORIES_SUCCESS:
      return {
        ...state,
        repositories: payload,
        isFetchingRepositories: false,
        error: null
      };

    case RepositoryActionTypes.FETCH_ALL_REPOSITORIES_FAILURE:
      return {
        ...state,
        repositories: [],
        isFetchingRepositories: false,
        error: payload
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_START:
      return {
        ...state,
        isFetchingCurrentRepository: true,
        error: null
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_SUCCESS:
      return {
        ...state,
        currentRepository: payload,
        isFetchingCurrentRepository: false,
        error: null
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_FAILURE:
      return {
        ...state,
        currentRepository: null,
        isFetchingCurrentRepository: false,
        error: payload
      };

    case RepositoryActionTypes.SET_CURRENT_REPOSITORY: {
      return {
        ...state,
        currentRepository: payload
      };
    }

    case RepositoryActionTypes.SET_CURRENT_REPOSITORY_MEMBER:
      return {
        ...state,
        currentMember: payload
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_START:
      return {
        ...state,
        isFetchingMembers: true,
        error: null
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_SUCCESS:
      return {
        ...state,
        isFetchingMembers: false,
        currentRepository: {
          ...state.currentRepository,
          memberCount: payload.memberCount,
          members: payload.members
        },
        error: null
      };

    case RepositoryActionTypes.FETCH_REPOSITORY_MEMBERS_FAILURE:
      return {
        ...state,
        isFetchingMembers: false,
        error: payload
      };

    case RepositoryActionTypes.ADD_REPOSITORY_MEMBER_START:
    case RepositoryActionTypes.ADD_REPOSITORY_MEMBER_FROM_GITHUB_START:
      return {
        ...state,
        isAddingMembers: true,
        error: null
      };

    case RepositoryActionTypes.ADD_REPOSITORY_MEMBER_SUCCESS:
      return {
        ...state,
        isAddingMembers: false,
        currentRepository: {
          ...state.currentRepository,
          memberCount: state.currentRepository.memberCount + 1,
          members: [...state.currentRepository.members, payload]
        },
        error: null
      };

    case RepositoryActionTypes.ADD_REPOSITORY_MEMBER_FAILURE:
      return {
        ...state,
        isAddingMembers: false,
        error: payload
      };

    case RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_START:
      return {
        ...state,
        isRemovingMembers: true,
        error: null
      };

    case RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_SUCCESS:
      return {
        ...state,
        isRemovingMembers: false,
        currentMember: null,
        currentRepository: {
          ...state.currentRepository,
          memberCount: state.currentRepository.memberCount - 1,
          members: state.currentRepository.members.filter(
            member => member.user.id !== payload.user
          )
        },
        error: null
      };

    case RepositoryActionTypes.REMOVE_REPOSITORY_MEMBER_FAILURE:
      return {
        ...state,
        isRemovingMembers: false,
        error: payload
      };

    case RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_START:
      return {
        ...state,
        isUpdatingInvitation: true,
        error: null
      };

    case RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_SUCCESS:
      return {
        ...state,
        isUpdatingInvitation: false,
        currentRepository: {
          ...state.currentRepository,
          members: state.currentRepository.members.map(member =>
            member.user.id === payload.user.id ? payload : member
          )
        },
        error: null
      };

    case RepositoryActionTypes.UPDATE_REPOSITORY_INVITATION_FAILURE:
      return {
        ...state,
        isUpdatingInvitation: false,
        error: payload
      };

    case ServiceActionTypes.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        currentRepository:
          state.currentRepository &&
          state.currentRepository.id === payload.repository.id
            ? {
                ...state.currentRepository,
                serviceCount: state.currentRepository.serviceCount + 1,
                services: [...state.currentRepository.services, payload]
              }
            : state.currentRepository
      };

    default:
      return state;
  }
};

export default repositoryReducer;
