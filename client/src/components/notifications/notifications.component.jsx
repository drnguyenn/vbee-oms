import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const Notifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notification = useSelector(state => state.notification);

  useEffect(() => {
    const { type, content } = notification;

    if (content) enqueueSnackbar(content, { variant: type });
  }, [notification, enqueueSnackbar]);

  return null;
};

export default Notifications;
