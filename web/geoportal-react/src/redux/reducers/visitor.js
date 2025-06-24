import {
  FETCH_VISITOR_STATS,
  FETCH_VISITOR_STATS_FAIL,
  RECORD_VISITOR,
  RECORD_VISITOR_FAIL,
  RECORD_DOWNLOAD,
  RECORD_DOWNLOAD_FAIL,
  FETCH_DETAILED_STATS,
  FETCH_DETAILED_STATS_FAIL,
  FETCH_VISITOR_ANALYTICS,
  FETCH_VISITOR_ANALYTICS_FAIL,
  FETCH_DOWNLOAD_STATS,
  FETCH_DOWNLOAD_STATS_FAIL,
  CLEAR_VISITOR_ERROR,
  RESET_VISITOR_STATS,
  INCREMENT_DOWNLOAD_COUNT,
  SET_VISITOR_LOADING,
} from "../actions/types";

const initialState = {
  // Basic stats
  stats: {
    visitorsToday: 0,
    visitorsThisMonth: 0,
    downloadsToday: 0,
    downloadsThisMonth: 0
  },
  
  // Admin data
  detailedStats: null,
  analytics: null,
  downloadStats: [],
  
  // UI states
  loading: false,
  error: null,
  lastUpdated: null
};

function visitorReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // Loading states
    case SET_VISITOR_LOADING:
      return {
        ...state,
        loading: payload
      };

    // Basic stats
    case FETCH_VISITOR_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...payload
        },
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString()
      };

    case FETCH_VISITOR_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    // Record operations
    case RECORD_VISITOR:
      return {
        ...state,
        error: null
      };

    case RECORD_VISITOR_FAIL:
      return {
        ...state,
        error: payload
      };

    case RECORD_DOWNLOAD:
      return {
        ...state,
        error: null
      };

    case RECORD_DOWNLOAD_FAIL:
      return {
        ...state,
        error: payload
      };

    case INCREMENT_DOWNLOAD_COUNT:
      return {
        ...state,
        stats: {
          ...state.stats,
          downloadsToday: state.stats.downloadsToday + 1,
          downloadsThisMonth: state.stats.downloadsThisMonth + 1
        }
      };

    // Admin operations
    case FETCH_DETAILED_STATS:
      return {
        ...state,
        detailedStats: payload,
        loading: false,
        error: null
      };

    case FETCH_DETAILED_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case FETCH_VISITOR_ANALYTICS:
      return {
        ...state,
        analytics: payload,
        loading: false,
        error: null
      };

    case FETCH_VISITOR_ANALYTICS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };

    case FETCH_DOWNLOAD_STATS:
      return {
        ...state,
        downloadStats: payload,
        error: null
      };

    case FETCH_DOWNLOAD_STATS_FAIL:
      return {
        ...state,
        error: payload
      };

    // Utility actions
    case CLEAR_VISITOR_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_VISITOR_STATS:
      return {
        ...state,
        stats: initialState.stats,
        detailedStats: null,
        analytics: null,
        downloadStats: [],
        lastUpdated: null,
        error: null
      };

    default:
      return state;
  }
}

export default visitorReducer;