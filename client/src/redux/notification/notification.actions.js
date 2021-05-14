import NotificationActionTypes from './notification.types';

export const notify = ({ type, content }) => ({
  type: NotificationActionTypes.NOTIFY,
  payload: { type, content }
});
