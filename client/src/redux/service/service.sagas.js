import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllServicesSuccess,
  fetchAllServicesFailure,
  fetchServiceSuccess,
  fetchServiceFailure,
  createServiceSuccess,
  createServiceFailure,
  updateServiceInfoSuccess,
  updateServiceInfoFailure,
  deleteServiceSuccess,
  deleteServiceFailure,
  addServiceMemberSuccess,
  addServiceMemberFailure,
  updateServiceMemberSuccess,
  updateServiceMemberFailure,
  removeServiceMemberSuccess,
  removeServiceMemberFailure
} from './service.actions';
import { addService } from '../cluster/cluster.actions';
import { notify } from '../notification/notification.actions';
import {
  toggleServiceCreationModal,
  toggleServiceDeleteConfirmationModal,
  toggleServiceMemberAdditionModal,
  toggleServiceMemberRemoveConfirmationModal
} from '../modal/modal.actions';

import * as ServiceService from '../../services/service.service';

import ServiceActionTypes from './service.types';

function* fetchAllServices() {
  try {
    const services = yield call(ServiceService.fetchAllServices);

    yield put(fetchAllServicesSuccess(services));
  } catch (error) {
    yield put(fetchAllServicesFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* fetchService({ payload }) {
  try {
    const service = yield call(ServiceService.fetchService, payload);

    yield put(fetchServiceSuccess(service));
  } catch (error) {
    yield put(fetchServiceFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* createService({ payload }) {
  try {
    const service = yield call(ServiceService.createService, payload);

    yield put(createServiceSuccess(service));
    yield put(addService(service));
    yield put(
      notify({ type: 'success', content: `Service "${service.name}" created` })
    );
    yield put(toggleServiceCreationModal());
  } catch (error) {
    yield put(createServiceFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* updateServiceInfoStart({ payload: { id, data } }) {
  try {
    const service = yield call(ServiceService.updateService, id, data);

    yield put(updateServiceInfoSuccess(service));
    yield put(notify({ type: 'success', content: 'Changes saved' }));
  } catch (error) {
    yield put(updateServiceInfoFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* deleteService({ payload }) {
  try {
    const service = yield call(ServiceService.deleteService, payload);

    yield put(deleteServiceSuccess(service));
    yield put(
      notify({ type: 'success', content: `Service "${service.name}" deleted` })
    );
    yield put(toggleServiceDeleteConfirmationModal());
  } catch (error) {
    yield put(deleteServiceFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
    yield put(toggleServiceDeleteConfirmationModal());
  }
}

function* addMember({ payload: { serviceId, userId, data } }) {
  try {
    yield put(toggleServiceMemberAdditionModal());

    const member = yield call(
      ServiceService.addMember,
      serviceId,
      userId,
      data
    );

    yield put(addServiceMemberSuccess(member));
    yield put(
      notify({
        type: 'success',
        content: `Member "${member.user.username}" added`
      })
    );
  } catch (error) {
    yield put(addServiceMemberFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
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
      notify({
        type: 'success',
        content: `Member "${member.user.username}" updated`
      })
    );
  } catch (error) {
    yield put(updateServiceMemberFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* removeMember({ payload: { serviceId, userId } }) {
  try {
    yield put(toggleServiceMemberRemoveConfirmationModal());

    const member = yield call(ServiceService.removeMember, serviceId, userId);

    yield put(removeServiceMemberSuccess(member));
    yield put(
      notify({
        type: 'success',
        content: 'Member removed'
      })
    );
  } catch (error) {
    yield put(removeServiceMemberFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
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

function* onUpdateServiceInfoStart() {
  yield takeLatest(
    ServiceActionTypes.UPDATE_SERVICE_INFO_START,
    updateServiceInfoStart
  );
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
    call(onUpdateServiceInfoStart),
    call(onDeleteServiceStart),
    call(onAddMemberStart),
    call(onUpdateMemberStart),
    call(onRemoveMemberStart)
  ]);
}
