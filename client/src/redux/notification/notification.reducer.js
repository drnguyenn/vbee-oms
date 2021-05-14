import NotificationActionTypes from './notification.types';

const INITIAL_STATE = {
  type: undefined,
  content: null
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case NotificationActionTypes.NOTIFY:
      return {
        type: payload.type,
        content: payload.content
      };

    default:
      return state;
  }
};

export default notificationReducer;
