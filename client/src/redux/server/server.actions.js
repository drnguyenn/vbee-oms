import ServerActionTypes from './server.types';

export const fetchAllServersStart = () => ({
  type: ServerActionTypes.FETCH_ALL_SERVERS_START
});

export const fetchAllServersSuccess = servers => ({
  type: ServerActionTypes.FETCH_ALL_SERVERS_SUCCESS,
  payload: servers
});

export const fetchAllServersFailure = error => ({
  type: ServerActionTypes.FETCH_ALL_SERVERS_FAILURE,
  payload: error
});

export const fetchServerStart = id => ({
  type: ServerActionTypes.FETCH_SERVER_START,
  payload: id
});

export const fetchServerSuccess = server => ({
  type: ServerActionTypes.FETCH_SERVER_SUCCESS,
  payload: server
});

export const fetchServerFailure = error => ({
  type: ServerActionTypes.FETCH_SERVER_FAILURE,
  payload: error
});

export const createServerStart = serverInfo => ({
  type: ServerActionTypes.CREATE_SERVER_START,
  payload: serverInfo
});

export const createServerSuccess = server => ({
  type: ServerActionTypes.CREATE_SERVER_SUCCESS,
  payload: server
});

export const createServerFailure = error => ({
  type: ServerActionTypes.CREATE_SERVER_FAILURE,
  payload: error
});

export const updateServerStart = (id, data) => ({
  type: ServerActionTypes.UPDATE_SERVER_START,
  payload: { id, data }
});

export const updateServerSuccess = server => ({
  type: ServerActionTypes.UPDATE_SERVER_SUCCESS,
  payload: server
});

export const updateServerFailure = error => ({
  type: ServerActionTypes.UPDATE_SERVER_FAILURE,
  payload: error
});

export const deleteServerStart = id => ({
  type: ServerActionTypes.DELETE_SERVER_START,
  payload: id
});

export const deleteServerSuccess = id => ({
  type: ServerActionTypes.DELETE_SERVER_SUCCESS,
  payload: id
});

export const deleteServerFailure = error => ({
  type: ServerActionTypes.DELETE_SERVER_FAILURE,
  payload: error
});

export const setCurrentServer = server => ({
  type: ServerActionTypes.SET_CURRENT_SERVER,
  payload: server
});

export const fetchServersMetricsStart = serverIds => ({
  type: ServerActionTypes.FETCH_SERVERS_METRICS_START,
  payload: serverIds
});

export const fetchServersMetricsSuccess = metrics => ({
  type: ServerActionTypes.FETCH_SERVERS_METRICS_SUCCESS,
  payload: metrics
});

export const fetchServersMetricsFailure = error => ({
  type: ServerActionTypes.FETCH_SERVERS_METRICS_FAILURE,
  payload: error
});

export const setCurrentServerDomain = domain => ({
  type: ServerActionTypes.SET_CURRENT_SERVER_DOMAIN,
  payload: domain
});

export const getAllServerDomainsSslStatusStart = serverId => ({
  type: ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_START,
  payload: serverId
});

export const getAllServerDomainsSslStatusSuccess = domains => ({
  type: ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_SUCCESS,
  payload: domains
});

export const getAllServerDomainsSslStatusFailure = error => ({
  type: ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_FAILURE,
  payload: error
});

export const getDomainsSslStatusStart = domains => ({
  type: ServerActionTypes.GET_DOMAINS_SSL_STATUS_START,
  payload: domains
});

export const getDomainsSslStatusSuccess = domains => ({
  type: ServerActionTypes.GET_DOMAINS_SSL_STATUS_SUCCESS,
  payload: domains
});

export const getDomainsSslStatusFailure = error => ({
  type: ServerActionTypes.GET_DOMAINS_SSL_STATUS_FAILURE,
  payload: error
});

export const addServerDomainStart = (serverId, domains) => ({
  type: ServerActionTypes.ADD_SERVER_DOMAINS_START,
  payload: { serverId, domains }
});

export const addServerDomainSuccess = domains => ({
  type: ServerActionTypes.ADD_SERVER_DOMAINS_SUCCESS,
  payload: domains
});

export const addServerDomainFailure = error => ({
  type: ServerActionTypes.ADD_SERVER_DOMAINS_FAILURE,
  payload: error
});

export const updateServerDomainStart = (domainId, data) => ({
  type: ServerActionTypes.UPDATE_SERVER_DOMAIN_START,
  payload: { domainId, data }
});

export const updateServerDomainSuccess = domain => ({
  type: ServerActionTypes.UPDATE_SERVER_DOMAIN_SUCCESS,
  payload: domain
});

export const updateServerDomainFailure = error => ({
  type: ServerActionTypes.UPDATE_SERVER_DOMAIN_FAILURE,
  payload: error
});

export const removeServerDomainStart = domainId => ({
  type: ServerActionTypes.REMOVE_SERVER_DOMAIN_START,
  payload: domainId
});

export const removeServerDomainSuccess = domain => ({
  type: ServerActionTypes.REMOVE_SERVER_DOMAIN_SUCCESS,
  payload: domain
});

export const removeServerDomainFailure = error => ({
  type: ServerActionTypes.REMOVE_SERVER_DOMAIN_FAILURE,
  payload: error
});
