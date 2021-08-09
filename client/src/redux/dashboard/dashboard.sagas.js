import { takeLatest, all, call, put } from 'redux-saga/effects';

import {
  fetchOverallStatisticsStartFailure,
  fetchOverallStatisticsStartSuccess
} from 'redux/dashboard/dashboard.actions';
import { notify } from 'redux/notification/notification.actions';

import * as DashboardService from 'services/dashboard.service';

import DashboardActionTypes from './dashboard.types';

function* fetchOverallStatisticsStart() {
  try {
    const statistics = yield call(DashboardService.fetchOverallStatistics);

    yield put(fetchOverallStatisticsStartSuccess(statistics));
  } catch (error) {
    yield put(fetchOverallStatisticsStartFailure(error));
    yield put(notify(error.message, { variant: 'error' }));
  }
}

function* onFetchOverallStatisticsStart() {
  yield takeLatest(
    DashboardActionTypes.FETCH_OVERALL_STATISTICS_START,
    fetchOverallStatisticsStart
  );
}

export default function* dashboardSagas() {
  yield all([call(onFetchOverallStatisticsStart)]);
}
