import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllServersSuccess,
  fetchAllServersFailure,
  fetchServerSuccess,
  fetchServerFailure,
  createServerSuccess,
  createServerFailure,
  updateServerSuccess,
  updateServerFailure,
  deleteServerSuccess,
  deleteServerFailure,
  fetchServersMetricsSuccess,
  fetchServersMetricsFailure,
  getAllServerDomainsSslStatusSuccess,
  getAllServerDomainsSslStatusFailure,
  addServerDomainSuccess,
  addServerDomainFailure,
  updateServerDomainSuccess,
  updateServerDomainFailure,
  removeServerDomainSuccess,
  removeServerDomainFailure,
  getDomainsSslStatusStart,
  getDomainsSslStatusSuccess,
  getDomainsSslStatusFailure
} from './server.actions';
import { notify } from '../notification/notification.actions';
import {
  setServerCreationModalOpen,
  setServerDeleteConfirmationModalOpen,
  setServerDomainAdditionModalOpen,
  setServerDomainUpdateModalOpen,
  setServerDomainRemoveConfirmationModalOpen
} from '../modal/modal.actions';

import * as ServerService from '../../services/server.service';

import ServerActionTypes from './server.types';

function* fetchAllServers() {
  try {
    const servers = yield call(ServerService.fetchAllServers);

    yield put(fetchAllServersSuccess(servers));
  } catch (error) {
    yield put(fetchAllServersFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchServer({ payload }) {
  try {
    const server = yield call(ServerService.fetchServer, payload);

    yield put(fetchServerSuccess(server));
  } catch (error) {
    yield put(fetchServerFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* createServer({ payload }) {
  try {
    const server = yield call(ServerService.createServer, payload);

    yield put(createServerSuccess(server));
    yield put(notify('Server created', { variant: 'success' }));
    yield put(setServerCreationModalOpen(false));
  } catch (error) {
    yield put(createServerFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateServerStart({ payload: { id, data } }) {
  try {
    const server = yield call(ServerService.updateServer, id, data);

    yield put(updateServerSuccess(server));
    yield put(notify('Changes saved', { variant: 'success' }));
  } catch (error) {
    yield put(updateServerFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* deleteServer({ payload }) {
  try {
    const server = yield call(ServerService.deleteServer, payload);

    yield put(deleteServerSuccess(server));
    yield put(notify('Server deleted', { variant: 'success' }));
    yield put(setServerDeleteConfirmationModalOpen(false));
  } catch (error) {
    yield put(deleteServerFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setServerDeleteConfirmationModalOpen(false));
  }
}

function* fetchServersMetrics({ payload }) {
  try {
    const metrics = yield call(ServerService.fetchMetrics, payload);

    yield put(fetchServersMetricsSuccess(metrics));
  } catch (error) {
    yield put(fetchServersMetricsFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* getAllServerDomainsSslStatus({ payload }) {
  try {
    const domains = yield call(
      ServerService.getAllServerDomainsSslStatus,
      payload
    );

    yield put(getAllServerDomainsSslStatusSuccess(domains));
  } catch (error) {
    yield put(getAllServerDomainsSslStatusFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* addDomain({ payload: { serverId, domains } }) {
  try {
    const newDomains = yield call(ServerService.addDomain, serverId, domains);

    yield put(addServerDomainSuccess(newDomains));
    yield put(notify('Domains added', { variant: 'success' }));
    yield put(setServerDomainAdditionModalOpen(false));

    yield put(getDomainsSslStatusStart(newDomains.map(({ value }) => value)));
  } catch (error) {
    yield put(addServerDomainFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateDomain({ payload: { domainId, data } }) {
  try {
    const domain = yield call(ServerService.updateDomain, domainId, data);

    yield put(updateServerDomainSuccess(domain));
    yield put(notify('Domains updated', { variant: 'success' }));
    yield put(setServerDomainUpdateModalOpen(false));

    yield put(getDomainsSslStatusStart([domain.value]));
  } catch (error) {
    yield put(updateServerDomainFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* removeDomain({ payload }) {
  try {
    yield put(setServerDomainRemoveConfirmationModalOpen(false));

    const domain = yield call(ServerService.removeDomain, payload);

    yield put(removeServerDomainSuccess(domain));
    yield put(
      notify(`Domain "${domain.value}" removed`, { variant: 'success' })
    );
  } catch (error) {
    yield put(removeServerDomainFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* getDomainsSslStatus({ payload }) {
  try {
    const domains = yield call(ServerService.getDomainsSslStatus, payload);

    yield put(getDomainsSslStatusSuccess(domains));
  } catch (error) {
    yield put(getDomainsSslStatusFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onFetchAllServersStart() {
  yield takeLatest(ServerActionTypes.FETCH_ALL_SERVERS_START, fetchAllServers);
}

function* onFetchServerStart() {
  yield takeLatest(ServerActionTypes.FETCH_SERVER_START, fetchServer);
}

function* onCreateServerStart() {
  yield takeLatest(ServerActionTypes.CREATE_SERVER_START, createServer);
}

function* onUpdateServerStart() {
  yield takeLatest(ServerActionTypes.UPDATE_SERVER_START, updateServerStart);
}

function* onDeleteServerStart() {
  yield takeLatest(ServerActionTypes.DELETE_SERVER_START, deleteServer);
}

function* onFetchServersMetricsStart() {
  yield takeLatest(
    ServerActionTypes.FETCH_SERVERS_METRICS_START,
    fetchServersMetrics
  );
}

function* onGetAllServerDomainsSslStatus() {
  yield takeLatest(
    ServerActionTypes.GET_ALL_SERVER_DOMAINS_SSL_STATUS_START,
    getAllServerDomainsSslStatus
  );
}

function* onAddDomainStart() {
  yield takeLatest(ServerActionTypes.ADD_SERVER_DOMAINS_START, addDomain);
}

function* onUpdateDomainStart() {
  yield takeLatest(ServerActionTypes.UPDATE_SERVER_DOMAIN_START, updateDomain);
}

function* onRemoveDomainStart() {
  yield takeLatest(ServerActionTypes.REMOVE_SERVER_DOMAIN_START, removeDomain);
}

function* onGetDomainsSslStatusStart() {
  yield takeLatest(
    ServerActionTypes.GET_DOMAINS_SSL_STATUS_START,
    getDomainsSslStatus
  );
}

export default function* serverSagas() {
  yield all([
    call(onFetchAllServersStart),
    call(onFetchServerStart),
    call(onCreateServerStart),
    call(onUpdateServerStart),
    call(onDeleteServerStart),
    call(onFetchServersMetricsStart),
    call(onGetAllServerDomainsSslStatus),
    call(onAddDomainStart),
    call(onUpdateDomainStart),
    call(onRemoveDomainStart),
    call(onGetDomainsSslStatusStart)
  ]);
}
