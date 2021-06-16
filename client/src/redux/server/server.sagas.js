import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllServersSuccess,
  fetchAllServersFailure,
  fetchServerSuccess,
  fetchServerFailure,
  createServerSuccess,
  createServerFailure,
  updateServerInfoSuccess,
  updateServerInfoFailure,
  deleteServerSuccess,
  deleteServerFailure,
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
  toggleServerCreationModal,
  toggleServerDeleteConfirmationModal,
  toggleServerDomainAdditionModal,
  toggleServerDomainUpdateModal,
  toggleServerDomainRemoveConfirmationModal
} from '../modal/modal.actions';

import * as ServerService from '../../services/server.service';

import ServerActionTypes from './server.types';

function* fetchAllServers() {
  try {
    const servers = yield call(ServerService.fetchAllServers);

    yield put(fetchAllServersSuccess(servers));
  } catch (error) {
    yield put(fetchAllServersFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* fetchServer({ payload }) {
  try {
    const server = yield call(ServerService.fetchServer, payload);

    yield put(fetchServerSuccess(server));
  } catch (error) {
    yield put(fetchServerFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* createServer({ payload }) {
  try {
    const server = yield call(ServerService.createServer, payload);

    yield put(createServerSuccess(server));
    yield put(
      notify({ type: 'success', content: `Server "${server.name}" created` })
    );
    yield put(toggleServerCreationModal());
  } catch (error) {
    yield put(createServerFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* updateServerInfoStart({ payload: { id, data } }) {
  try {
    const server = yield call(ServerService.updateServer, id, data);

    yield put(updateServerInfoSuccess(server));
    yield put(notify({ type: 'success', content: 'Changes saved' }));
  } catch (error) {
    yield put(updateServerInfoFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* deleteServer({ payload }) {
  try {
    const server = yield call(ServerService.deleteServer, payload);

    yield put(deleteServerSuccess(server));
    yield put(
      notify({ type: 'success', content: `Server "${server.name}" deleted` })
    );
    yield put(toggleServerDeleteConfirmationModal());
  } catch (error) {
    yield put(deleteServerFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
    yield put(toggleServerDeleteConfirmationModal());
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
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* addDomain({ payload: { serverId, domains } }) {
  try {
    const newDomains = yield call(ServerService.addDomain, serverId, domains);

    yield put(addServerDomainSuccess(newDomains));
    yield put(
      notify({
        type: 'success',
        content: 'Domains added'
      })
    );
    yield put(toggleServerDomainAdditionModal());

    yield put(getDomainsSslStatusStart(newDomains.map(({ value }) => value)));
  } catch (error) {
    yield put(addServerDomainFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* updateDomain({ payload: { domainId, data } }) {
  try {
    const domain = yield call(ServerService.updateDomain, domainId, data);

    yield put(updateServerDomainSuccess(domain));
    yield put(
      notify({
        type: 'success',
        content: 'Domain updated'
      })
    );
    yield put(toggleServerDomainUpdateModal());

    yield put(getDomainsSslStatusStart([domain.value]));
  } catch (error) {
    yield put(updateServerDomainFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* removeDomain({ payload }) {
  try {
    yield put(toggleServerDomainRemoveConfirmationModal());

    const domain = yield call(ServerService.removeDomain, payload);

    yield put(removeServerDomainSuccess(domain));
    yield put(
      notify({
        type: 'success',
        content: `Domain "${domain.value}" removed`
      })
    );
  } catch (error) {
    yield put(removeServerDomainFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* getDomainsSslStatus({ payload }) {
  try {
    const domains = yield call(ServerService.getDomainsSslStatus, payload);

    yield put(getDomainsSslStatusSuccess(domains));
  } catch (error) {
    yield put(getDomainsSslStatusFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
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

function* onUpdateServerInfoStart() {
  yield takeLatest(
    ServerActionTypes.UPDATE_SERVER_INFO_START,
    updateServerInfoStart
  );
}

function* onDeleteServerStart() {
  yield takeLatest(ServerActionTypes.DELETE_SERVER_START, deleteServer);
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
    call(onUpdateServerInfoStart),
    call(onDeleteServerStart),
    call(onGetAllServerDomainsSslStatus),
    call(onAddDomainStart),
    call(onUpdateDomainStart),
    call(onRemoveDomainStart),
    call(onGetDomainsSslStatusStart)
  ]);
}
