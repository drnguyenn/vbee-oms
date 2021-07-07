import { takeLatest, all, call, put } from 'redux-saga/effects';

import * as UserService from 'services/user.service';

import { notify } from 'redux/notification/notification.actions';
import {
  setUserCreationModalOpen,
  setUserDeleteConfirmationModalOpen
} from 'redux/modal/modal.actions';
import {
  createUserFailure,
  createUserSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  fetchAllUsersFailure,
  fetchAllUsersSuccess,
  fetchUserFailure,
  fetchUserSuccess,
  updateUserFailure,
  updateUserSuccess
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
    const cluster = yield call(UserService.fetchUser, payload);

    yield put(fetchUserSuccess(cluster));
  } catch (error) {
    yield put(fetchUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* createUser({ payload }) {
  try {
    const cluster = yield call(UserService.createUser, payload);

    yield put(createUserSuccess(cluster));
    yield put(notify(`User "${cluster.name}" created`, { variant: 'success' }));
    yield put(setUserCreationModalOpen(false));
  } catch (error) {
    yield put(createUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateUserStart({ payload: { id, data } }) {
  try {
    const cluster = yield call(UserService.updateUser, id, data);

    yield put(updateUserSuccess(cluster));
    yield put(notify('Changes saved', { variant: 'success' }));
  } catch (error) {
    yield put(updateUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* deleteUser({ payload }) {
  try {
    const cluster = yield call(UserService.deleteUser, payload);

    yield put(deleteUserSuccess(cluster));
    yield put(notify(`User "${cluster.name}" deleted`, { variant: 'success' }));
    yield put(setUserDeleteConfirmationModalOpen(false));
  } catch (error) {
    yield put(deleteUserFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
    yield put(setUserDeleteConfirmationModalOpen(false));
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

export default function* userSagas() {
  yield all([
    call(onFetchAllUsersStart),
    call(onFetchUserStart),
    call(onCreateUserStart),
    call(onUpdateUserStart),
    call(onDeleteUserStart)
  ]);
}
