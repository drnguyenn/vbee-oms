import { takeLatest, all, call, put, select } from 'redux-saga/effects';

import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  updateProfileSuccess,
  updateProfileFailure,
  updateAvatarSuccess,
  updateAvatarFailure
} from 'redux/auth/auth.actions';
import { notify } from 'redux/notification/notification.actions';

import * as AuthServices from 'services/auth.service';

import { getCookie, setCookie } from 'utils/cookie.utils';

import AuthActionTypes from './auth.types';

function* getCurrentUser() {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      yield put(signInFailure(new Error('Access token not found')));
      return;
    }

    const user = yield call(AuthServices.getCurrentUser);
    if (!user) {
      yield put(signInFailure(new Error('Can not get current user')));
      return;
    }

    yield put(signInSuccess(user));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* signInWithEmail({ payload: { email, password } }) {
  try {
    const user = yield call(AuthServices.signInWithEmail, email, password);

    if (!user) return;

    yield put(signInSuccess(user));
    yield put(notify(`Hi ${user.username}`, { variant: 'info' }));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* signOut() {
  try {
    setCookie('accessToken', null, 0);

    const { currentUser } = yield select(state => state.auth);

    yield put(signOutSuccess());
    yield put(notify(`Goodbye ${currentUser.username}`, { variant: 'info' }));
  } catch (error) {
    yield put(signOutFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* signUp({ payload: { username, email, password } }) {
  try {
    const user = yield call(AuthServices.signUp, username, email, password);

    if (!user) return;

    yield put(signUpSuccess(user));
    yield put(notify('User account created', { variant: 'success' }));
  } catch (error) {
    yield put(signUpFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateProfile({ payload }) {
  try {
    const accessToken = getCookie('accessToken');

    const user = yield call(AuthServices.updateProfile, accessToken, payload);

    yield put(updateProfileSuccess(user));
    yield put(notify('Profile updated', { variant: 'success' }));
  } catch (error) {
    yield put(updateProfileFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* updateAvatar({ payload }) {
  try {
    const accessToken = getCookie('accessToken');

    const user = yield call(AuthServices.updateAvatar, accessToken, payload);

    yield put(updateAvatarSuccess(user));
    yield put(notify('Avatar uploaded', { variant: 'success' }));
  } catch (error) {
    yield put(updateAvatarFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onGetCurrentUser() {
  yield takeLatest(AuthActionTypes.GET_CURRENT_USER, getCurrentUser);
}

function* onEmailSignInStart() {
  yield takeLatest(AuthActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

function* onSignOutStart() {
  yield takeLatest(AuthActionTypes.SIGN_OUT_START, signOut);
}

function* onSignUpStart() {
  yield takeLatest(AuthActionTypes.SIGN_UP_START, signUp);
}

function* onUpdateProfileStart() {
  yield takeLatest(AuthActionTypes.UPDATE_PROFILE_START, updateProfile);
}

function* onupdateAvatarStart() {
  yield takeLatest(AuthActionTypes.UPDATE_AVATAR_START, updateAvatar);
}

export default function* authSagas() {
  yield all([
    call(onGetCurrentUser),
    call(onEmailSignInStart),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onUpdateProfileStart),
    call(onupdateAvatarStart)
  ]);
}
