import { createRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  createMuiTheme,
  unstable_createMuiStrictModeTheme as unstableCreateMuiStrictModeTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';

import { Fade, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import Router from './router';

import Notifications from './components/notifications/notifications.component';
import ModalRegistrar from './modals/modal-registrar.component';
import Header from './components/header/header.component';
import Sidebar from './components/sidebar/sidebar.component';

import { getCurrentUser } from './redux/user/user.actions';
import { switchTheme } from './redux/theme/theme.actions';

import GlobalStyles from './global.styles';

const createTheme =
  process.env.NODE_ENV === 'production'
    ? createMuiTheme
    : unstableCreateMuiStrictModeTheme;

const App = () => {
  const dispatch = useDispatch();

  const { type } = useSelector(state => state.theme);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || theme === 'light') dispatch(switchTheme(theme));
  }, [dispatch]);

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // type: prefersDarkMode ? 'dark' : 'light'
          type,
          primary: {
            light: '#fff9b0',
            main: '#f6c90e',
            dark: '#fab300'
          }
        },
        typography: {
          fontFamily: `'Ubuntu', sans-serif, -apple-system, BlinkMacSystemFont,
            'Segoe UI', 'Roboto', 'Oxygen','Cantarell', 'Fira Sans',
            'Droid Sans', 'Helvetica Neue'`
        },
        shape: {
          borderRadius: 8
        }
      }),
    [type]
  );

  const notistackRef = createRef();
  const dismissSnackbar = key => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CssBaseline />

      <SnackbarProvider
        maxSnack={3}
        preventDuplicate
        ref={notistackRef}
        action={key => (
          <IconButton
            size='small'
            color='inherit'
            onClick={dismissSnackbar(key)}
          >
            <Close fontSize='small' />
          </IconButton>
        )}
        TransitionComponent={Fade}
      >
        <Notifications />

        <ModalRegistrar />

        {currentUser && <Header />}
        {currentUser && <Sidebar />}

        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
