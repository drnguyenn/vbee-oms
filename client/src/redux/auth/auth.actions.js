import AuthActionTypes from './auth.types';

export const getCurrentUser = () => ({
  type: AuthActionTypes.GET_CURRENT_USER
});

export const emailSignInStart = (email, password) => ({
  type: AuthActionTypes.EMAIL_SIGN_IN_START,
  payload: { email, password }
});

export const signInSuccess = user => ({
  type: AuthActionTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = error => ({
  type: AuthActionTypes.SIGN_IN_FAILURE,
  payload: error
});

export const signOutStart = () => ({
  type: AuthActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
  type: AuthActionTypes.SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
  type: AuthActionTypes.SIGN_OUT_FAILURE,
  payload: error
});

export const signUpStart = userCredentials => ({
  type: AuthActionTypes.SIGN_UP_START,
  payload: userCredentials
});

export const signUpSuccess = ({ email, password }) => ({
  type: AuthActionTypes.SIGN_UP_SUCCESS,
  payload: { email, password }
});

export const signUpFailure = error => ({
  type: AuthActionTypes.SIGN_UP_FAILURE,
  payload: error
});

export const updateProfileStart = userProfile => ({
  type: AuthActionTypes.UPDATE_PROFILE_START,
  payload: userProfile
});

export const updateProfileSuccess = userProfile => ({
  type: AuthActionTypes.UPDATE_PROFILE_SUCCESS,
  payload: userProfile
});

export const updateProfileFailure = error => ({
  type: AuthActionTypes.UPDATE_AVATAR_FAILURE,
  payload: error
});

export const updateAvatarStart = userProfile => ({
  type: AuthActionTypes.UPDATE_AVATAR_START,
  payload: userProfile
});

export const updateAvatarSuccess = userList => ({
  type: AuthActionTypes.UPDATE_AVATAR_SUCCESS,
  payload: userList
});

export const updateAvatarFailure = error => ({
  type: AuthActionTypes.UPDATE_AVATAR_FAILURE,
  payload: error
});
