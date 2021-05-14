import ThemeActionTypes from './theme.types';

export const switchTheme = theme => ({
  type: ThemeActionTypes.SWITCH_THEME,
  payload: theme
});
