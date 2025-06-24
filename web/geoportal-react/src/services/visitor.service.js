import http from "./http-common";
import authHeader from "./auth-header";

const base = "visitors";

// Public endpoints (no auth required)

// Get visitor statistics - public
const getStats = () => {
  console.log("Calling visitor stats endpoint");
  return http.get(`/${base}/stats`);
};

// Record visitor - public
const recordVisitor = (data) => {
  console.log("Recording visitor:", data);
  return http.post(`/${base}/record`, data);
};

// Record download - public
const recordDownload = (data) => {
  console.log("Recording download:", data);
  return http.post(`/${base}/download`, data);
};

// Health check - public
const healthCheck = () => {
  console.log("Checking visitor service health");
  return http.get(`/${base}/health`);
};

// Admin endpoints (auth required)

// Get detailed stats - admin only
const getDetailedStats = (startDate, endDate) => {
  console.log("Getting detailed stats:", { startDate, endDate });
  return http.get(`/${base}/detailed`, {
    params: { startDate, endDate },
    headers: authHeader()
  });
};

// Get download stats by type - admin only
const getDownloadStats = (days = 30) => {
  console.log("Getting download stats:", { days });
  return http.get(`/${base}/download-stats`, {
    params: { days },
    headers: authHeader()
  });
};

// Get analytics - admin only
const getAnalytics = (period = 'month') => {
  console.log("Getting analytics:", { period });
  return http.get(`/${base}/analytics`, {
    params: { period },
    headers: authHeader()
  });
};

// Export data - admin only
const exportData = (type, startDate, endDate) => {
  console.log("Exporting data:", { type, startDate, endDate });
  return http.get(`/${base}/export`, {
    params: { type, startDate, endDate },
    headers: authHeader(),
    responseType: 'blob' // Important for file download
  });
};

// Reset stats - super admin only
const resetStats = (confirmation) => {
  console.log("RESETTING VISITOR STATS - ADMIN ACTION");
  return http.delete(`/${base}/reset`, {
    data: { confirm: confirmation },
    headers: authHeader()
  });
};

const VisitorService = {
  // Public methods
  getStats,
  recordVisitor,
  recordDownload,
  healthCheck,
  
  // Admin methods
  getDetailedStats,
  getDownloadStats,
  getAnalytics,
  exportData,
  resetStats,
};

export default VisitorService;