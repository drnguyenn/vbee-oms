import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { Typography } from '@material-ui/core';

const ConnectionErrorMessage = () => (
  <Typography variant='body2'>
    You are currently offline.
    <br />
    Some features may not work properly.
  </Typography>
);

const Notifications = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notification = useSelector(state => state.notification);

  const [notiKey, setNotiKey] = useState();

  useEffect(() => {
    const { content, options } = notification;

    if (content) enqueueSnackbar(content, options);
  }, [notification, enqueueSnackbar]);

  useEffect(() => {
    navigator.connection.onchange = () => {
      if (navigator.onLine) {
        if (notiKey) {
          closeSnackbar(notiKey);
          setNotiKey(null);
        }

        setNotiKey(
          enqueueSnackbar('Your connection was restored', { variant: 'info' })
        );
      } else {
        if (notiKey) {
          closeSnackbar(notiKey);
          setNotiKey(null);
        }

        setNotiKey(
          enqueueSnackbar(<ConnectionErrorMessage />, {
            variant: 'error',
            persist: true
          })
        );
      }
    };
  }, [enqueueSnackbar, closeSnackbar, notiKey]);

  return null;
};

export default Notifications;
