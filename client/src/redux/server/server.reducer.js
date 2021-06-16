import ServerActionTypes from './server.types';

const INITIAL_STATE = {
  servers: [],
  currentServer: null,
  currentDomain: null,
  isFetchingServers: true,
  isFetchingCurrentServer: true,
  isProcessing: false,
  isUpdatingInfo: false,
  isGettingSslStatus: false,
  isAddingDomains: false,
  isUpdatingDomains: false,
  isRemovingDomains: false,
  error: null
};

const serverReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ServerActionTypes.FETCH_ALL_SERVERS_START:
      return {
        ...state,
        isFetchingServers: true,
        error: null
      };

    case ServerActionTypes.FETCH_ALL_SERVERS_SUCCESS:
      return {
        ...state,
        servers: payload,
        isFetchingServers: false,
        error: null
      };

    case ServerActionTypes.FETCH_ALL_SERVERS_FAILURE:
      return {
        ...state,
        servers: [],
        isFetchingServers: false,
        error: payload
      };

    case ServerActionTypes.FETCH_SERVER_START:
      return {
        ...state,
        isFetchingCurrentServer: true,
        error: null
      };

    case ServerActionTypes.FETCH_SERVER_SUCCESS:
      return {
        ...state,
        currentServer: payload,
        isFetchingCurrentServer: false,
        error: null
      };

    case ServerActionTypes.FETCH_SERVER_FAILURE:
      return {
        ...state,
        currentServer: null,
        isFetchingCurrentServer: false,
        error: payload
      };

    case ServerActionTypes.CREATE_SERVER_START:
      return {
        ...state,
        servers: [...state.servers, { ...payload, isNew: true }],
        isProcessing: true,
        error: null
      };

    case ServerActionTypes.CREATE_SERVER_SUCCESS:
      return {
        ...state,
        servers: state.servers.map(server => (server.isNew ? payload : server)),
        isProcessing: false,
        error: null
      };

    case ServerActionTypes.CREATE_SERVER_FAILURE:
      return {
        ...state,
        servers: state.servers.filter(server => !server.isNew),
        isProcessing: false,
        error: payload
      };

    case ServerActionTypes.UPDATE_SERVER_INFO_START:
      return {
        ...state,
        isUpdatingInfo: true,
        error: null
      };

    case ServerActionTypes.UPDATE_SERVER_INFO_SUCCESS: {
      const { id, service, ...rest } = payload;

      return {
        ...state,
        currentServer: { ...state.currentServer, ...rest },
        servers: state.servers.map(server =>
          server.id === id ? { ...server, ...rest } : server
        ),
        isUpdatingInfo: false,
        error: null
      };
    }

    case ServerActionTypes.UPDATE_SERVER_INFO_FAILURE:
      return {
        ...state,
        isUpdatingInfo: false,
        error: payload
      };

    case ServerActionTypes.DELETE_SERVER_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case ServerActionTypes.DELETE_SERVER_SUCCESS:
      return {
        ...state,
        currentServer: null,
        servers: state.servers.filter(server => server.id !== payload.id),
        isProcessing: false,
        error: null
      };

    case ServerActionTypes.DELETE_SERVER_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case ServerActionTypes.SET_CURRENT_SERVER_DOMAIN:
      return {
        ...state,
        currentDomain: payload
      };

    case ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_START:
      return {
        ...state,
        isGettingSslStatus: true,
        error: null
      };

    case ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_SUCCESS:
      return {
        ...state,
        isGettingSslStatus: false,
        currentServer: state.currentServer
          ? {
              ...state.currentServer,
              domains: state.currentServer.domains.map(domain => ({
                ...domain,
                ...payload.find(d => d.value === domain.value)
              }))
            }
          : { domains: payload },
        error: null
      };

    case ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_FAILURE:
    case ServerActionTypes.GET_DOMAINS_SSL_STATUS_FAILURE:
      return {
        ...state,
        isGettingSslStatus: false,
        error: payload
      };

    case ServerActionTypes.GET_DOMAINS_SSL_STATUS_START:
      return {
        ...state,
        isGettingSslStatus: true,
        error: null
      };

    case ServerActionTypes.GET_DOMAINS_SSL_STATUS_SUCCESS:
      return {
        ...state,
        isGettingSslStatus: false,
        currentServer: {
          ...state.currentServer,
          domains: state.currentServer.domains.map(domain => ({
            ...domain,
            ...payload.find(d => d.value === domain.value)
          }))
        },
        error: null
      };

    case ServerActionTypes.ADD_SERVER_DOMAINS_START:
      return {
        ...state,
        isAddingDomains: true,
        error: null
      };

    case ServerActionTypes.ADD_SERVER_DOMAINS_SUCCESS:
      return {
        ...state,
        isAddingDomains: false,
        currentServer: {
          ...state.currentServer,
          domains: [...state.currentServer.domains, ...payload]
        },
        error: null
      };

    case ServerActionTypes.ADD_SERVER_DOMAINS_FAILURE:
      return {
        ...state,
        isAddingDomains: false,
        error: payload
      };

    case ServerActionTypes.UPDATE_SERVER_DOMAIN_START:
      return {
        ...state,
        isUpdatingDomains: true,
        error: null
      };

    case ServerActionTypes.UPDATE_SERVER_DOMAIN_SUCCESS:
      return {
        ...state,
        isUpdatingDomains: false,
        currentServer: {
          ...state.currentServer,
          domains: state.currentServer.domains.map(domain =>
            domain.id === payload.id ? payload : domain
          )
        },
        error: null
      };

    case ServerActionTypes.UPDATE_SERVER_DOMAIN_FAILURE:
      return {
        ...state,
        isUpdatingDomains: false,
        error: payload
      };

    case ServerActionTypes.REMOVE_SERVER_DOMAIN_START:
      return {
        ...state,
        isRemovingDomains: true,
        error: null
      };

    case ServerActionTypes.REMOVE_SERVER_DOMAIN_SUCCESS:
      return {
        ...state,
        isRemovingDomains: false,
        currentDomain: null,
        currentServer: {
          ...state.currentServer,
          domains: state.currentServer.domains.filter(
            domain => domain.id !== payload.id
          )
        },
        error: null
      };

    case ServerActionTypes.REMOVE_SERVER_DOMAIN_FAILURE:
      return {
        ...state,
        isRemovingDomains: false,
        error: payload
      };

    default:
      return state;
  }
};

export default serverReducer;
