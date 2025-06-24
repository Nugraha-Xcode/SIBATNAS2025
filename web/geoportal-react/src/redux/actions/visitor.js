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
} from "./types";

import VisitorService from "src/services/visitor.service";
import EventBus from "src/utils/EventBus";

// PUBLIC ACTIONS

// Fetch visitor statistics
export const fetchVisitorStats = () => async (dispatch) => {
  try {
    dispatch({ type: SET_VISITOR_LOADING, payload: true });
    
    const res = await VisitorService.getStats();
    
    dispatch({
      type: FETCH_VISITOR_STATS,
      payload: res.data,
    });
    
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    dispatch({
      type: FETCH_VISITOR_STATS_FAIL,
      payload: err.response?.data?.error || "Failed to fetch visitor stats",
    });
    return Promise.reject(err);
  }
};

// Record visitor
export const recordVisitor = (pageUrl = window.location.pathname) => async (dispatch) => {
  try {
    const res = await VisitorService.recordVisitor({ pageUrl });
    
    dispatch({
      type: RECORD_VISITOR,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: RECORD_VISITOR_FAIL,
      payload: err.response?.data?.error || "Failed to record visitor",
    });
    
    console.warn("Failed to record visitor:", err.response?.data?.error || err.message);
    return Promise.resolve(); // Don't break the app flow
  }
};

// Record publikasi download
export const recordPublikasiDownload = (data, currentUser) => async (dispatch) => {
  try {
    const fileName = `${data.tematik?.name || 'data'}_${data.uuid}`;
    const userUuid = currentUser?.uuid || null;
    const fileType = 'publikasi';
    
    const res = await VisitorService.recordDownload({
      fileName,
      userUuid,
      fileType
    });
    
    dispatch({
      type: RECORD_DOWNLOAD,
      payload: res.data,
    });
    
    // Increment local count for immediate UI feedback
    dispatch({ type: INCREMENT_DOWNLOAD_COUNT });
    
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: RECORD_DOWNLOAD_FAIL,
      payload: err.response?.data?.error || "Failed to record download",
    });
    
    console.warn("Failed to record download:", err.response?.data?.error || err.message);
    return Promise.resolve(); // Don't break the download flow
  }
};

// Record general download
export const recordDownload = (fileName, userUuid = null, fileType = 'general') => async (dispatch) => {
  try {
    const res = await VisitorService.recordDownload({
      fileName,
      userUuid,
      fileType
    });
    
    dispatch({
      type: RECORD_DOWNLOAD,
      payload: res.data,
    });
    
    dispatch({ type: INCREMENT_DOWNLOAD_COUNT });
    
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: RECORD_DOWNLOAD_FAIL,
      payload: err.response?.data?.error || "Failed to record download",
    });
    
    console.warn("Failed to record download:", err.response?.data?.error || err.message);
    return Promise.resolve();
  }
};

// ADMIN ACTIONS

// Fetch detailed statistics - Admin only
export const fetchDetailedStats = (startDate, endDate) => async (dispatch) => {
  try {
    dispatch({ type: SET_VISITOR_LOADING, payload: true });
    
    const res = await VisitorService.getDetailedStats(startDate, endDate);
    
    dispatch({
      type: FETCH_DETAILED_STATS,
      payload: res.data,
    });
    
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    
    dispatch({
      type: FETCH_DETAILED_STATS_FAIL,
      payload: err.response?.data?.error || "Failed to fetch detailed stats",
    });
    return Promise.reject(err);
  }
};

// Fetch download stats by type - Admin only
export const fetchDownloadStats = (days = 30) => async (dispatch) => {
  try {
    const res = await VisitorService.getDownloadStats(days);
    
    dispatch({
      type: FETCH_DOWNLOAD_STATS,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    
    dispatch({
      type: FETCH_DOWNLOAD_STATS_FAIL,
      payload: err.response?.data?.error || "Failed to fetch download stats",
    });
    return Promise.reject(err);
  }
};

// Fetch analytics - Admin only
export const fetchAnalytics = (period = 'month') => async (dispatch) => {
  try {
    dispatch({ type: SET_VISITOR_LOADING, payload: true });
    
    const res = await VisitorService.getAnalytics(period);
    
    dispatch({
      type: FETCH_VISITOR_ANALYTICS,
      payload: res.data,
    });
    
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({ type: SET_VISITOR_LOADING, payload: false });
    
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    
    dispatch({
      type: FETCH_VISITOR_ANALYTICS_FAIL,
      payload: err.response?.data?.error || "Failed to fetch analytics",
    });
    return Promise.reject(err);
  }
};

// Export data - Admin only (tidak menggunakan dispatch karena langsung download)
export const exportVisitorData = (type, startDate, endDate) => async (dispatch) => {
  try {
    const res = await VisitorService.exportData(type, startDate, endDate);
    
    // Create blob and download file
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visitor_${type}_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return Promise.resolve({ message: 'Export completed' });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    
    console.error("Export failed:", err.response?.data?.error || err.message);
    return Promise.reject(err);
  }
};

// Reset visitor stats - Super Admin only
export const resetVisitorStats = () => async (dispatch) => {
  try {
    const confirmed = window.confirm(
      'Are you sure you want to RESET ALL visitor data? This action cannot be undone!'
    );
    
    if (!confirmed) {
      return Promise.resolve({ cancelled: true });
    }
    
    const res = await VisitorService.resetStats('RESET_ALL_VISITOR_DATA');
    
    dispatch({
      type: RESET_VISITOR_STATS,
    });
    
    // Refresh stats after reset
    dispatch(fetchVisitorStats());
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    
    console.error("Reset failed:", err.response?.data?.error || err.message);
    return Promise.reject(err);
  }
};

// UTILITY ACTIONS

export const clearVisitorError = () => ({
  type: CLEAR_VISITOR_ERROR,
});

export const incrementDownloadCount = () => ({
  type: INCREMENT_DOWNLOAD_COUNT,
});

// Auto refresh stats
export const autoRefreshStats = (intervalMs = 5 * 60 * 1000) => (dispatch) => {
  dispatch(fetchVisitorStats());
  
  const interval = setInterval(() => {
    dispatch(fetchVisitorStats());
  }, intervalMs);
  
  return () => clearInterval(interval);
};