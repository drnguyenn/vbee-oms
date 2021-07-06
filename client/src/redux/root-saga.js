import { all, call } from 'redux-saga/effects';

import authSagas from './auth/auth.sagas';
import clusterSagas from './cluster/cluster.sagas';
import serverSagas from './server/server.sagas';
import repositorySagas from './repository/repository.sagas';
import serviceSagas from './service/service.sagas';
import userSagas from './user/user.sagas';
import diagramSagas from './diagram/diagram.sagas';

export default function* rootSaga() {
  yield all([
    call(authSagas),
    call(clusterSagas),
    call(serverSagas),
    call(repositorySagas),
    call(serviceSagas),
    call(userSagas),
    call(diagramSagas)
  ]);
}
