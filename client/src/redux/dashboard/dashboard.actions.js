import DashboardActionTypes from './dashboard.types';

export const fetchOverallStatisticsStart = () => ({
  type: DashboardActionTypes.FETCH_OVERALL_STATISTICS_START
});

export const fetchOverallStatisticsStartSuccess = statistics => ({
  type: DashboardActionTypes.FETCH_OVERALL_STATISTICS_SUCCESS,
  payload: statistics
});

export const fetchOverallStatisticsStartFailure = error => ({
  type: DashboardActionTypes.FETCH_OVERALL_STATISTICS_FAILURE,
  payload: error
});
