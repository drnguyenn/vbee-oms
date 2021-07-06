import { all, call } from 'redux-saga/effects';

import userSagas from './user/user.sagas';
import clusterSagas from './cluster/cluster.sagas';
import serverSagas from './server/server.sagas';
import repositorySagas from './repository/repository.sagas';
import serviceSagas from './service/service.sagas';
import diagramSagas from './diagram/diagram.sagas';

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(clusterSagas),
    call(serverSagas),
    call(repositorySagas),
    call(serviceSagas),
    call(diagramSagas)
  ]);
}
