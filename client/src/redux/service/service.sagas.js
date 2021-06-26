import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllServicesSuccess,
  fetchAllServicesFailure,
  fetchServiceSuccess,
  fetchServiceFailure,
  createServiceSuccess,
  createServiceFailure,
  updateServiceSuccess,
  updateServiceFailure,
  deleteServiceSuccess,
  deleteServiceFailure,
  addServiceMemberSuccess,
  addServiceMemberFailure,
  updateServiceMemberSuccess,
  updateServiceMemberFailure,
  removeServiceMemberSuccess,
  removeServiceMemberFailure
} from './service.actions';
import { notify } from '../notification/notification.actions';
import {
  setServiceCreationModalOpen,
  setServiceDeleteConfirmationModalOpen,
  setServiceMemberAdditionModalOpen,
  setServiceMemberRemovalConfirmationModalOpen
} from '../modal/modal.actions';

import * as ServiceService from '../../services/service.service';

import ServiceActionTypes from './service.types';

function* fetchAllServices() {
  try {
    const services = yield call(ServiceService.fetchAllServices);

    yield put(fetchAllServicesSuccess(services));
  } catch (error) {
    yield put(fetchAllServicesFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchService({ payload }) {
  try {
    const service = yield call(ServiceService.fetchService, payload);

    yield put(fetchServiceSuccess(service));
  } catch (error) {
    yield put(fetchServiceFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* createService({ payload }) {
  try {
    const service = yield call(ServiceService.createService, payload);

    yield put(createServiceSuccess(service));
    yield put(
      notify(`Service "${service.name}" created`, { variant: 'success' })
    );
    yield put(setServiceCreationModalOpen(false));
  } catch (error) {
    yield put(createServiceFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateServiceStart({ payload: { id, data } }) {
  try {
    const service = yield call(ServiceService.updateService, id, data);

    yield put(updateServiceSuccess(service));
    yield put(notify('Changes saved', { variant: 'success' }));
  } catch (error) {
    yield put(updateServiceFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* deleteService({ payload }) {
  try {
    const service = yield call(ServiceService.deleteService, payload);

    yield put(deleteServiceSuccess(service));
    yield put(
      notify(`Service "${service.name}" deleted`, { variant: 'success' })
    );
    yield put(setServiceDeleteConfirmationModalOpen(false));
  } catch (error) {
    yield put(deleteServiceFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setServiceDeleteConfirmationModalOpen(false));
  }
}

function* addMember({ payload: { serviceId, userId, data } }) {
  try {
    yield put(setServiceMemberAdditionModalOpen(false));

    const member = yield call(
      ServiceService.addMember,
      serviceId,
      userId,
      data
    );

    yield put(addServiceMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.username}" added`, { variant: 'success' })
    );
  } catch (error) {
    yield put(addServiceMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateMember({ payload: { serviceId, userId, data } }) {
  try {
    const member = yield call(
      ServiceService.updateMember,
      serviceId,
      userId,
      data
    );

    yield put(updateServiceMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.username}" updated`, { variant: 'success' })
    );
  } catch (error) {
    yield put(updateServiceMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* removeMember({ payload: { serviceId, userId } }) {
  try {
    yield put(setServiceMemberRemovalConfirmationModalOpen(false));

    const member = yield call(ServiceService.removeMember, serviceId, userId);

    yield put(removeServiceMemberSuccess(member));
    yield put(notify('Member removed', { variant: 'success' }));
  } catch (error) {
    yield put(removeServiceMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onFetchAllServicesStart() {
  yield takeLatest(
    ServiceActionTypes.FETCH_ALL_SERVICES_START,
    fetchAllServices
  );
}

function* onFetchServiceStart() {
  yield takeLatest(ServiceActionTypes.FETCH_SERVICE_START, fetchService);
}

function* onCreateServiceStart() {
  yield takeLatest(ServiceActionTypes.CREATE_SERVICE_START, createService);
}

function* onUpdateServiceStart() {
  yield takeLatest(ServiceActionTypes.UPDATE_SERVICE_START, updateServiceStart);
}

function* onDeleteServiceStart() {
  yield takeLatest(ServiceActionTypes.DELETE_SERVICE_START, deleteService);
}

function* onAddMemberStart() {
  yield takeLatest(ServiceActionTypes.ADD_SERVICE_MEMBER_START, addMember);
}

function* onUpdateMemberStart() {
  yield takeLatest(
    ServiceActionTypes.UPDATE_SERVICE_MEMBER_START,
    updateMember
  );
}

function* onRemoveMemberStart() {
  yield takeLatest(
    ServiceActionTypes.REMOVE_SERVICE_MEMBER_START,
    removeMember
  );
}

export default function* serviceSagas() {
  yield all([
    call(onFetchAllServicesStart),
    call(onFetchServiceStart),
    call(onCreateServiceStart),
    call(onUpdateServiceStart),
    call(onDeleteServiceStart),
    call(onAddMemberStart),
    call(onUpdateMemberStart),
    call(onRemoveMemberStart)
  ]);
}
