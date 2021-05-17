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
} from './user.actions';
import { notify } from '../notification/notification.actions';

import * as UserServices from '../../services/user.service';

import UserActionTypes from './user.types';

import { getCookie, setCookie } from '../../utils/cookie.utils';

function* getCurrentUser() {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      yield put(signInFailure(new Error('Access token not found')));
      return;
    }

    const user = yield call(UserServices.getCurrentUser);
    if (!user) {
      yield put(signInFailure(new Error('Can not get current user')));
      return;
    }

    yield put(signInSuccess(user));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* signInWithEmail({ payload: { email, password } }) {
  try {
    const user = yield call(UserServices.signInWithEmail, email, password);

    if (!user) return;

    yield put(signInSuccess(user));
    yield put(notify({ type: 'default', content: `Hi ${user.username}` }));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* signOut() {
  try {
    setCookie('accessToken', null, 0);

    const { currentUser } = yield select(state => state.user);

    yield put(signOutSuccess());
    yield put(
      notify({ type: 'default', content: `Goodbye ${currentUser.username}` })
    );
  } catch (error) {
    yield put(signOutFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* signUp({ payload: { username, email, password } }) {
  try {
    const user = yield call(UserServices.signUp, username, email, password);

    if (!user) return;

    yield put(signUpSuccess(user));
    yield put(
      notify({ type: 'success', content: 'Account registered successfully' })
    );
  } catch (error) {
    yield put(signUpFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* updateProfile({ payload }) {
  try {
    const accessToken = getCookie('accessToken');

    const user = yield call(UserServices.updateProfile, accessToken, payload);

    yield put(updateProfileSuccess(user));
    yield put(notify({ type: 'success', content: 'Profile updated' }));
  } catch (error) {
    yield put(updateProfileFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* updateAvatar({ payload }) {
  try {
    const accessToken = getCookie('accessToken');

    const user = yield call(UserServices.updateAvatar, accessToken, payload);

    yield put(updateAvatarSuccess(user));
    yield put(notify({ type: 'success', content: 'Avatar uploaded' }));
  } catch (error) {
    yield put(updateAvatarFailure(error));
    yield put(notify({ type: 'error', content: error.message }));
  }
}

function* onGetCurrentUser() {
  yield takeLatest(UserActionTypes.GET_CURRENT_USER, getCurrentUser);
}

function* onEmailSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

function* onUpdateProfileStart() {
  yield takeLatest(UserActionTypes.UPDATE_PROFILE_START, updateProfile);
}

function* onupdateAvatarStart() {
  yield takeLatest(UserActionTypes.UPDATE_AVATAR_START, updateAvatar);
}

export default function* userSagas() {
  yield all([
    call(onGetCurrentUser),
    call(onEmailSignInStart),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onUpdateProfileStart),
    call(onupdateAvatarStart)
  ]);
}
