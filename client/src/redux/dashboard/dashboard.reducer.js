import DashboardActionTypes from './dashboard.types';

const INITIAL_STATE = {
  statistics: null,
  isFetchingOverallStatistics: true,
  error: null
};

const dashboardReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case DashboardActionTypes.FETCH_OVERALL_STATISTICS_START:
      return {
        ...state,
        isFetchingOverallStatistics: true,
        error: null
      };

    case DashboardActionTypes.FETCH_OVERALL_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: payload,
        isFetchingOverallStatistics: false,
        error: null
      };

    case DashboardActionTypes.FETCH_OVERALL_STATISTICS_FAILURE:
      return {
        ...state,
        isFetchingOverallStatistics: false,
        error: payload
      };

    default:
      return state;
  }
};

export default dashboardReducer;
