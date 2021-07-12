import { takeLatest, all, call, put } from 'redux-saga/effects';

import * as UserService from 'services/user.service';

import { notify } from 'redux/notification/notification.actions';
import {
  setRemovingUserFromAllClustersConfirmationModalOpen,
  setRemovingUserFromAllReposConfirmationModalOpen,
  setRemovingUserFromAllServicesConfirmationModalOpen,
  setUserCreationModalOpen,
  setUserDeleteConfirmationModalOpen
} from 'redux/modal/modal.actions';
import {
  createUserSuccess,
  createUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  fetchUserSuccess,
  fetchUserFailure,
  updateUserSuccess,
  updateUserFailure,
  removeUserFromAllClustersSuccess,
  removeUserFromAllClustersFailure,
  removeUserFromAllServicesSuccess,
  removeUserFromAllServicesFailure,
  removeUserFromAllRepositoriesSuccess,
  removeUserFromAllRepositoriesFailure
} from './user.actions';

import UserActionTypes from './user.types';

function* fetchAllUsers() {
  try {
    const clusters = yield call(UserService.fetchAllUsers);

    yield put(fetchAllUsersSuccess(clusters));
  } catch (error) {
    yield put(fetchAllUsersFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* fetchUser({ payload }) {
  try {
    const user = yield call(UserService.fetchUser, payload);

    yield put(fetchUserSuccess(user));
  } catch (error) {
    yield put(fetchUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* createUser({ payload }) {
  try {
    const user = yield call(UserService.createUser, payload);

    yield put(createUserSuccess(user));
    yield put(
      notify(`User "${user.username}" created`, { variant: 'success' })
    );
    yield put(setUserCreationModalOpen(false));
  } catch (error) {
    yield put(createUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateUserStart({ payload: { id, data } }) {
  try {
    const user = yield call(UserService.updateUser, id, data);

    yield put(updateUserSuccess(user));
    yield put(notify('Changes saved', { variant: 'success' }));
  } catch (error) {
    yield put(updateUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* deleteUser({ payload }) {
  try {
    const user = yield call(UserService.deleteUser, payload);

    yield put(deleteUserSuccess(user));
    yield put(
      notify(`User "${user.username}" deleted`, { variant: 'success' })
    );
    yield put(setUserDeleteConfirmationModalOpen(false));
  } catch (error) {
    yield put(deleteUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setUserDeleteConfirmationModalOpen(false));
  }
}

function* removeFromAllClustersStart({ payload }) {
  try {
    yield call(UserService.removeUserFromAllClusters, payload);

    yield put(removeUserFromAllClustersSuccess());
    yield put(notify('Removed user from all clusters', { variant: 'success' }));
    yield put(setRemovingUserFromAllClustersConfirmationModalOpen(false));
  } catch (error) {
    yield put(removeUserFromAllClustersFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setRemovingUserFromAllClustersConfirmationModalOpen(false));
  }
}

function* removeFromAllServicesStart({ payload }) {
  try {
    yield call(UserService.removeUserFromAllServices, payload);

    yield put(removeUserFromAllServicesSuccess());
    yield put(notify('Removed user from all services', { variant: 'success' }));
    yield put(setRemovingUserFromAllServicesConfirmationModalOpen(false));
  } catch (error) {
    yield put(removeUserFromAllServicesFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setRemovingUserFromAllServicesConfirmationModalOpen(false));
  }
}

function* removeFromAllRepositoriesStart({ payload }) {
  try {
    yield call(UserService.removeUserFromAllRepositories, payload);

    yield put(removeUserFromAllRepositoriesSuccess());
    yield put(
      notify('Removed user from all repositories', { variant: 'success' })
    );
    yield put(setRemovingUserFromAllReposConfirmationModalOpen(false));
  } catch (error) {
    yield put(removeUserFromAllRepositoriesFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setRemovingUserFromAllReposConfirmationModalOpen(false));
  }
}

function* onFetchAllUsersStart() {
  yield takeLatest(UserActionTypes.FETCH_ALL_USERS_START, fetchAllUsers);
}

function* onFetchUserStart() {
  yield takeLatest(UserActionTypes.FETCH_USER_START, fetchUser);
}

function* onCreateUserStart() {
  yield takeLatest(UserActionTypes.CREATE_USER_START, createUser);
}

function* onUpdateUserStart() {
  yield takeLatest(UserActionTypes.UPDATE_USER_START, updateUserStart);
}

function* onDeleteUserStart() {
  yield takeLatest(UserActionTypes.DELETE_USER_START, deleteUser);
}

function* onRemoveFromAllClustersStart() {
  yield takeLatest(
    UserActionTypes.REMOVE_USER_FROM_ALL_CLUSTERS_START,
    removeFromAllClustersStart
  );
}

function* onRemoveFromAllServicesStart() {
  yield takeLatest(
    UserActionTypes.REMOVE_USER_FROM_ALL_SERVICES_START,
    removeFromAllServicesStart
  );
}

function* onRemoveFromAllRepositoriesStart() {
  yield takeLatest(
    UserActionTypes.REMOVE_USER_FROM_ALL_REPOS_START,
    removeFromAllRepositoriesStart
  );
}

export default function* userSagas() {
  yield all([
    call(onFetchAllUsersStart),
    call(onFetchUserStart),
    call(onCreateUserStart),
    call(onUpdateUserStart),
    call(onDeleteUserStart),
    call(onRemoveFromAllClustersStart),
    call(onRemoveFromAllServicesStart),
    call(onRemoveFromAllRepositoriesStart)
  ]);
}
