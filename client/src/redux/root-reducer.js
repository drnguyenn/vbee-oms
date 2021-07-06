import { combineReducers } from 'redux';

import themeReducer from './theme/theme.reducer';
import modalReducer from './modal/modal.reducer';
import notificationReducer from './notification/notification.reducer';
import userReducer from './user/user.reducer';
import clusterReducer from './cluster/cluster.reducer';
import serverReducer from './server/server.reducer';
import repositoryReducer from './repository/repository.reducer';
import serviceReducer from './service/service.reducer';
import diagramReducer from './diagram/diagram.reducer';

const rootReducer = combineReducers({
  theme: themeReducer,
  modal: modalReducer,
  notification: notificationReducer,
  user: userReducer,
  cluster: clusterReducer,
  server: serverReducer,
  repository: repositoryReducer,
  service: serviceReducer,
  diagram: diagramReducer
});

export default rootReducer;
