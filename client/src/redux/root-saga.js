import { all, call } from 'redux-saga/effects';

import { userSagas } from './user/user.sagas';
import { clusterSagas } from './cluster/cluster.sagas';
import { serviceSagas } from './service/service.sagas';

export default function* rootSaga() {
  yield all([call(userSagas), call(clusterSagas), call(serviceSagas)]);
}
