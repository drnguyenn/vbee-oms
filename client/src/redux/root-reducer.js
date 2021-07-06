import { combineReducers } from 'redux';

import themeReducer from './theme/theme.reducer';
import modalReducer from './modal/modal.reducer';
import notificationReducer from './notification/notification.reducer';
import authReducer from './auth/auth.reducer';
import clusterReducer from './cluster/cluster.reducer';
import serverReducer from './server/server.reducer';
import repositoryReducer from './repository/repository.reducer';
import serviceReducer from './service/service.reducer';
import diagramReducer from './diagram/diagram.reducer';
import userReducer from './user/user.reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  modal: modalReducer,
  notification: notificationReducer,
  auth: authReducer,
  cluster: clusterReducer,
  server: serverReducer,
  repository: repositoryReducer,
  service: serviceReducer,
  user: userReducer,
  diagram: diagramReducer
});

export default rootReducer;
