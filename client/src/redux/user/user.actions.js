import UserActionTypes from './user.types';

export const getCurrentUser = () => ({
  type: UserActionTypes.GET_CURRENT_USER
});

export const emailSignInStart = (email, password) => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: { email, password }
});

export const signInSuccess = user => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user
});

export const signInFailure = error => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error
});

export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error
});

export const signUpStart = userCredentials => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials
});

export const signUpSuccess = ({ email, password }) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: { email, password }
});

export const signUpFailure = error => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});

export const updateProfileStart = userProfile => ({
  type: UserActionTypes.UPDATE_PROFILE_START,
  payload: userProfile
});

export const updateProfileSuccess = userProfile => ({
  type: UserActionTypes.UPDATE_PROFILE_SUCCESS,
  payload: userProfile
});

export const updateProfileFailure = error => ({
  type: UserActionTypes.UPDATE_AVATAR_FAILURE,
  payload: error
});

export const updateAvatarStart = userProfile => ({
  type: UserActionTypes.UPDATE_AVATAR_START,
  payload: userProfile
});

export const updateAvatarSuccess = userList => ({
  type: UserActionTypes.UPDATE_AVATAR_SUCCESS,
  payload: userList
});

export const updateAvatarFailure = error => ({
  type: UserActionTypes.UPDATE_AVATAR_FAILURE,
  payload: error
});
