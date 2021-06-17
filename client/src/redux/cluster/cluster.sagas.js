import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchAllClustersSuccess,
  fetchAllClustersFailure,
  fetchClusterSuccess,
  fetchClusterFailure,
  createClusterSuccess,
  createClusterFailure,
  updateClusterInfoSuccess,
  updateClusterInfoFailure,
  deleteClusterSuccess,
  deleteClusterFailure,
  addClusterMemberSuccess,
  addClusterMemberFailure,
  updateClusterMemberSuccess,
  updateClusterMemberFailure,
  removeClusterMemberSuccess,
  removeClusterMemberFailure
} from './cluster.actions';
import { notify } from '../notification/notification.actions';
import {
  toggleClusterCreationModal,
  toggleClusterDeleteConfirmationModal,
  toggleClusterMemberAdditionModal,
  toggleClusterMemberRemoveConfirmationModal
} from '../modal/modal.actions';

import * as ClusterService from '../../services/cluster.service';

import ClusterActionTypes from './cluster.types';

function* fetchAllClusters() {
  try {
    const clusters = yield call(ClusterService.fetchAllClusters);

    yield put(fetchAllClustersSuccess(clusters));
  } catch (error) {
    yield put(fetchAllClustersFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchCluster({ payload }) {
  try {
    const cluster = yield call(ClusterService.fetchCluster, payload);

    yield put(fetchClusterSuccess(cluster));
  } catch (error) {
    yield put(fetchClusterFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* createCluster({ payload }) {
  try {
    const cluster = yield call(ClusterService.createCluster, payload);

    yield put(createClusterSuccess(cluster));
    yield put(
      notify(`Cluster "${cluster.name}" created`, { variant: 'success' })
    );
    yield put(toggleClusterCreationModal());
  } catch (error) {
    yield put(createClusterFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateClusterInfoStart({ payload: { id, data } }) {
  try {
    const cluster = yield call(ClusterService.updateCluster, id, data);

    yield put(updateClusterInfoSuccess(cluster));
    yield put(notify('Changes saved', { variant: 'success' }));
  } catch (error) {
    yield put(updateClusterInfoFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* deleteCluster({ payload }) {
  try {
    const cluster = yield call(ClusterService.deleteCluster, payload);

    yield put(deleteClusterSuccess(cluster));
    yield put(
      notify(`Cluster "${cluster.name}" deleted`, { variant: 'success' })
    );
    yield put(toggleClusterDeleteConfirmationModal());
  } catch (error) {
    yield put(deleteClusterFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(toggleClusterDeleteConfirmationModal());
  }
}

function* addMember({ payload: { clusterId, userId, data } }) {
  try {
    yield put(toggleClusterMemberAdditionModal());

    const member = yield call(
      ClusterService.addMember,
      clusterId,
      userId,
      data
    );

    yield put(addClusterMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.username}" added`, { variant: 'success' })
    );
  } catch (error) {
    yield put(addClusterMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateMember({ payload: { clusterId, userId, data } }) {
  try {
    const member = yield call(
      ClusterService.updateMember,
      clusterId,
      userId,
      data
    );

    yield put(updateClusterMemberSuccess(member));
    yield put(
      notify(`Member "${member.user.username}" updated`, { variant: 'success' })
    );
  } catch (error) {
    yield put(updateClusterMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* removeMember({ payload: { clusterId, userId } }) {
  try {
    yield put(toggleClusterMemberRemoveConfirmationModal());

    const member = yield call(ClusterService.removeMember, clusterId, userId);

    yield put(removeClusterMemberSuccess(member));
    yield put(notify('Member removed', { variant: 'success' }));
  } catch (error) {
    yield put(removeClusterMemberFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onFetchAllClustersStart() {
  yield takeLatest(
    ClusterActionTypes.FETCH_ALL_CLUSTERS_START,
    fetchAllClusters
  );
}

function* onFetchClusterStart() {
  yield takeLatest(ClusterActionTypes.FETCH_CLUSTER_START, fetchCluster);
}

function* onCreateClusterStart() {
  yield takeLatest(ClusterActionTypes.CREATE_CLUSTER_START, createCluster);
}

function* onUpdateClusterInfoStart() {
  yield takeLatest(
    ClusterActionTypes.UPDATE_CLUSTER_INFO_START,
    updateClusterInfoStart
  );
}

function* onDeleteClusterStart() {
  yield takeLatest(ClusterActionTypes.DELETE_CLUSTER_START, deleteCluster);
}

function* onAddMemberStart() {
  yield takeLatest(ClusterActionTypes.ADD_CLUSTER_MEMBER_START, addMember);
}

function* onUpdateMemberStart() {
  yield takeLatest(
    ClusterActionTypes.UPDATE_CLUSTER_MEMBER_START,
    updateMember
  );
}

function* onRemoveMemberStart() {
  yield takeLatest(
    ClusterActionTypes.REMOVE_CLUSTER_MEMBER_START,
    removeMember
  );
}

export default function* clusterSagas() {
  yield all([
    call(onFetchAllClustersStart),
    call(onFetchClusterStart),
    call(onCreateClusterStart),
    call(onUpdateClusterInfoStart),
    call(onDeleteClusterStart),
    call(onAddMemberStart),
    call(onUpdateMemberStart),
    call(onRemoveMemberStart)
  ]);
}
