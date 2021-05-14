import ThemeActionTypes from './theme.types';

const INITIAL_STATE = {
  type: 'dark'
};

const themeReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ThemeActionTypes.SWITCH_THEME:
      return {
        ...state,
        type: payload
      };

    default:
      return state;
  }
};

export default themeReducer;
