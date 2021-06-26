import ServiceActionTypes from './service.types';

export const fetchAllServicesStart = () => ({
  type: ServiceActionTypes.FETCH_ALL_SERVICES_START
});

export const fetchAllServicesSuccess = services => ({
  type: ServiceActionTypes.FETCH_ALL_SERVICES_SUCCESS,
  payload: services
});

export const fetchAllServicesFailure = error => ({
  type: ServiceActionTypes.FETCH_ALL_SERVICES_FAILURE,
  payload: error
});

export const fetchServiceStart = id => ({
  type: ServiceActionTypes.FETCH_SERVICE_START,
  payload: id
});

export const fetchServiceSuccess = service => ({
  type: ServiceActionTypes.FETCH_SERVICE_SUCCESS,
  payload: service
});

export const fetchServiceFailure = error => ({
  type: ServiceActionTypes.FETCH_SERVICE_FAILURE,
  payload: error
});

export const createServiceStart = serviceInfo => ({
  type: ServiceActionTypes.CREATE_SERVICE_START,
  payload: serviceInfo
});

export const createServiceSuccess = service => ({
  type: ServiceActionTypes.CREATE_SERVICE_SUCCESS,
  payload: service
});

export const createServiceFailure = error => ({
  type: ServiceActionTypes.CREATE_SERVICE_FAILURE,
  payload: error
});

export const updateServiceStart = (id, data) => ({
  type: ServiceActionTypes.UPDATE_SERVICE_START,
  payload: { id, data }
});

export const updateServiceSuccess = service => ({
  type: ServiceActionTypes.UPDATE_SERVICE_SUCCESS,
  payload: service
});

export const updateServiceFailure = error => ({
  type: ServiceActionTypes.UPDATE_SERVICE_FAILURE,
  payload: error
});

export const deleteServiceStart = id => ({
  type: ServiceActionTypes.DELETE_SERVICE_START,
  payload: id
});

export const deleteServiceSuccess = id => ({
  type: ServiceActionTypes.DELETE_SERVICE_SUCCESS,
  payload: id
});

export const deleteServiceFailure = error => ({
  type: ServiceActionTypes.DELETE_SERVICE_FAILURE,
  payload: error
});

export const setCurrentServiceMember = member => ({
  type: ServiceActionTypes.SET_CURRENT_SERVICE_MEMBER,
  payload: member
});

export const addServiceMemberStart = (serviceId, userId, { role }) => ({
  type: ServiceActionTypes.ADD_SERVICE_MEMBER_START,
  payload: { serviceId, userId, data: { role } }
});

export const addServiceMemberSuccess = member => ({
  type: ServiceActionTypes.ADD_SERVICE_MEMBER_SUCCESS,
  payload: member
});

export const addServiceMemberFailure = error => ({
  type: ServiceActionTypes.ADD_SERVICE_MEMBER_FAILURE,
  payload: error
});

export const updateServiceMemberStart = (serviceId, userId, { role }) => ({
  type: ServiceActionTypes.UPDATE_SERVICE_MEMBER_START,
  payload: { serviceId, userId, data: { role } }
});

export const updateServiceMemberSuccess = member => ({
  type: ServiceActionTypes.UPDATE_SERVICE_MEMBER_SUCCESS,
  payload: member
});

export const updateServiceMemberFailure = error => ({
  type: ServiceActionTypes.UPDATE_SERVICE_MEMBER_FAILURE,
  payload: error
});

export const removeServiceMemberStart = (serviceId, userId) => ({
  type: ServiceActionTypes.REMOVE_SERVICE_MEMBER_START,
  payload: { serviceId, userId }
});

export const removeServiceMemberSuccess = member => ({
  type: ServiceActionTypes.REMOVE_SERVICE_MEMBER_SUCCESS,
  payload: member
});

export const removeServiceMemberFailure = error => ({
  type: ServiceActionTypes.REMOVE_SERVICE_MEMBER_FAILURE,
  payload: error
});
