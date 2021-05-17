import UserActionTypes from './user.types';

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  isProcessing: false,
  isUpdatingProfile: false,
  isUpdatingAvatar: false,
  error: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case UserActionTypes.GET_CURRENT_USER:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case UserActionTypes.EMAIL_SIGN_IN_START:
    case UserActionTypes.SIGN_OUT_START:
      return {
        ...state,
        isProcessing: true,
        error: null
      };

    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: payload,
        isLoading: false,
        isProcessing: false,
        error: null
      };

    case UserActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        currentUser: null,
        isLoading: false,
        isProcessing: false,
        error: payload
      };

    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        isProcessing: false,
        error: null
      };

    case UserActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case UserActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        isProcessing: false,
        error: payload
      };

    case UserActionTypes.UPDATE_PROFILE_START:
      return {
        ...state,
        isUpdatingProfile: true,
        error: null
      };

    case UserActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...payload },
        isUpdatingProfile: false,
        error: null
      };

    case UserActionTypes.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isUpdatingProfile: false,
        error: payload
      };

    case UserActionTypes.UPDATE_AVATAR_START:
      return {
        ...state,
        isUpdatingAvatar: true,
        error: null
      };

    case UserActionTypes.UPDATE_AVATAR_SUCCESS:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...payload },
        isUpdatingAvatar: false,
        error: null
      };

    case UserActionTypes.UPDATE_AVATAR_FAILURE:
      return {
        ...state,
        isUpdatingAvatar: false,
        error: payload
      };

    default:
      return state;
  }
};

export default userReducer;
