import ServiceActionTypes from './service.types';

const INITIAL_STATE = {
  services: [],
  currentService: null,
  currentMember: null,
  isFetchingServices: true,
  isFetchingCurrentService: true,
  isProcessing: false,
  isUpdatingInfo: false,
  isAddingMembers: false,
  isUpdatingMembers: false,
  isRemovingMembers: false,
  error: null
};

const serviceReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ServiceActionTypes.FETCH_ALL_SERVICES_START:
      return {
        ...state,
        isFetchingServices: true,
        error: null
      };

    case ServiceActionTypes.FETCH_ALL_SERVICES_SUCCESS:
      return {
        ...state,
        services: payload,
        isFetchingServices: false,
        error: null
      };

    case ServiceActionTypes.FETCH_ALL_SERVICES_FAILURE:
      return {
        ...state,
        services: [],
        isFetchingServices: false,
        error: payload
      };

    case ServiceActionTypes.FETCH_SERVICE_START:
      return {
        ...state,
        isFetchingCurrentService: true,
        error: null
      };

    case ServiceActionTypes.FETCH_SERVICE_SUCCESS:
      return {
        ...state,
        currentService: payload,
        isFetchingCurrentService: false,
        error: null
      };

    case ServiceActionTypes.FETCH_SERVICE_FAILURE:
      return {
        ...state,
        currentService: null,
        isFetchingCurrentService: false,
        error: payload
      };

    case ServiceActionTypes.CREATE_SERVICE_START:
      return {
        ...state,
        services: [...state.services, { ...payload, isNew: true }],
        isProcessing: true,
        error: null
      };

    case ServiceActionTypes.CREATE_SERVICE_SUCCESS:
      return {
        ...state,
        services: state.services.map(service =>
          service.isNew ? payload : service
        ),
        isProcessing: false,
        error: null
      };

    case ServiceActionTypes.CREATE_SERVICE_FAILURE:
      return {
        ...state,
        services: state.services.filter(service => !service.isNew),
        isProcessing: false,
        error: payload
      };

    case ServiceActionTypes.UPDATE_SERVICE_INFO_START:
      return {
        ...state,
        isUpdatingInfo: true,
        error: null
      };

    case ServiceActionTypes.UPDATE_SERVICE_INFO_SUCCESS: {
      const { id, cluster, server, ...rest } = payload;

      return {
        ...state,
        currentService: { ...state.currentService, ...rest },
        services: state.services.map(service =>
          service.id === id ? { ...service, ...rest } : service
        ),
        isUpdatingInfo: false,
        error: null
      };
    }

    case ServiceActionTypes.UPDATE_SERVICE_INFO_FAILURE:
      return {
        ...state,
        isUpdatingInfo: false,
        error: payload
      };

    case ServiceActionTypes.DELETE_SERVICE_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case ServiceActionTypes.DELETE_SERVICE_SUCCESS:
      return {
        ...state,
        currentService: null,
        services: state.services.filter(service => service.id !== payload.id),
        isProcessing: false,
        error: null
      };

    case ServiceActionTypes.DELETE_SERVICE_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case ServiceActionTypes.SET_CURRENT_SERVICE_MEMBER:
      return {
        ...state,
        currentMember: payload
      };

    case ServiceActionTypes.ADD_SERVICE_MEMBER_START:
      return {
        ...state,
        isAddingMembers: true,
        error: null
      };

    case ServiceActionTypes.ADD_SERVICE_MEMBER_SUCCESS:
      return {
        ...state,
        isAddingMembers: false,
        currentService: {
          ...state.currentService,
          memberCount: state.currentService.memberCount + 1,
          members: [...state.currentService.members, payload]
        },
        error: null
      };

    case ServiceActionTypes.ADD_SERVICE_MEMBER_FAILURE:
      return {
        ...state,
        isAddingMembers: false,
        error: payload
      };

    case ServiceActionTypes.UPDATE_SERVICE_MEMBER_START:
      return {
        ...state,
        isUpdatingMembers: true,
        error: null
      };

    case ServiceActionTypes.UPDATE_SERVICE_MEMBER_SUCCESS:
      return {
        ...state,
        isUpdatingMembers: false,
        currentService: {
          ...state.currentService,
          members: state.currentService.members.map(member =>
            member.user.id === payload.user.id ? payload : member
          )
        },
        error: null
      };

    case ServiceActionTypes.UPDATE_SERVICE_MEMBER_FAILURE:
      return {
        ...state,
        isUpdatingMembers: false,
        error: payload
      };

    case ServiceActionTypes.REMOVE_SERVICE_MEMBER_START:
      return {
        ...state,
        isRemovingMembers: true,
        error: null
      };

    case ServiceActionTypes.REMOVE_SERVICE_MEMBER_SUCCESS:
      return {
        ...state,
        isRemovingMembers: false,
        currentMember: null,
        currentService: {
          ...state.currentService,
          memberCount: state.currentService.memberCount - 1,
          members: state.currentService.members.filter(
            member => member.user.id !== payload.user
          )
        },
        error: null
      };

    case ServiceActionTypes.REMOVE_SERVICE_MEMBER_FAILURE:
      return {
        ...state,
        isRemovingMembers: false,
        error: payload
      };

    default:
      return state;
  }
};

export default serviceReducer;
