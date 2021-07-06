import AuthActionTypes from './auth.types';

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  isProcessing: false,
  isUpdatingProfile: false,
  isUpdatingAvatar: false,
  error: null
};

const authReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case AuthActionTypes.GET_CURRENT_USER:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AuthActionTypes.EMAIL_SIGN_IN_START:
    case AuthActionTypes.SIGN_OUT_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case AuthActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: payload,
        isLoading: false,
        isProcessing: false,
        error: null
      };

    case AuthActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
        isProcessing: false,
        error: payload
      };

    case AuthActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        isProcessing: false,
        error: null
      };

    case AuthActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case AuthActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case AuthActionTypes.UPDATE_PROFILE_START:
      return {
        ...state,
        isUpdatingProfile: true,
        error: null
      };

    case AuthActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...payload },
        isUpdatingProfile: false,
        error: null
      };

    case AuthActionTypes.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isUpdatingProfile: false,
        error: payload
      };

    case AuthActionTypes.UPDATE_AVATAR_START:
      return {
        ...state,
        isUpdatingAvatar: true,
        error: null
      };

    case AuthActionTypes.UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...payload },
        isUpdatingAvatar: false,
        error: null
      };

    case AuthActionTypes.UPDATE_AVATAR_FAILURE:
      return {
        ...state,
        isUpdatingAvatar: false,
        error: payload
      };

    default:
      return state;
  }
};

export default authReducer;
