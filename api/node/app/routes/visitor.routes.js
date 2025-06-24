const { authJwt } = require("../middleware");
const controller = require("../controllers/visitor.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  // Record visitor - public endpoint untuk tracking
  app.post("/api/visitors/record", controller.recordVisitor);

  // Record download - public endpoint untuk tracking download
  app.post("/api/visitors/download", controller.recordDownload);

  // Get basic stats - public endpoint untuk menampilkan statistik
  app.get("/api/visitors/stats", controller.getStats);

  // Health check - public endpoint
  app.get("/api/visitors/health", controller.healthCheck);

  // Private/Admin routes (memerlukan auth)

  // Get detailed visitor data - hanya untuk admin
  app.get(
    "/api/visitors/detailed",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDetailedStats
  );

  // Get download stats by type - hanya untuk admin
  app.get(
    "/api/visitors/download-stats",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDownloadStats
  );

  // Get visitor analytics - hanya untuk admin
  app.get(
    "/api/visitors/analytics",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAnalytics
  );

  // Export visitor data - hanya untuk admin
  app.get(
    "/api/visitors/export",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.exportData
  );

  // Reset visitor stats - hanya untuk super admin
  app.delete(
    "/api/visitors/reset",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.resetStats
  );
};