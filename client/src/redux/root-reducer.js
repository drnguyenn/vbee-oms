import { combineReducers } from 'redux';

import themeReducer from './theme/theme.reducer';
import modalReducer from './modal/modal.reducer';
import notificationReducer from './notification/notification.reducer';
import userReducer from './user/user.reducer';
import clusterReducer from './cluster/cluster.reducer';
import serviceReducer from './service/service.reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  modal: modalReducer,
  notification: notificationReducer,
  user: userReducer,
  cluster: clusterReducer,
  service: serviceReducer
});

export default rootReducer;
