import NotificationActionTypes from './notification.types';

const INITIAL_STATE = {
  content: null,
  options: {}
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case NotificationActionTypes.NOTIFY:
      return { content: payload.content, options: payload.options };

    default:
      return state;
  }
};

export default notificationReducer;
