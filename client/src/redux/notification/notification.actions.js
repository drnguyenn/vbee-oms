import NotificationActionTypes from './notification.types';

export const notify = (content, options) => ({
  type: NotificationActionTypes.NOTIFY,
  payload: { content, options }
});
