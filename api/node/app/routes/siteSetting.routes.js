const { authJwt } = require("../middleware");
const controller = require("../controllers/siteSetting.controller");
const base = "/api/site-settings/";

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get site settings
  app.get(
    base,
    [authJwt.verifyToken],
    controller.getSiteSettings
  );

  // Update site settings (admin only)
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateSiteSettings
  );

  // Upload video large file (admin only)
  app.post(
    base + "chunk-upload",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.uploadChunk
  );

  // Get site settings (public)
  app.get(
    base + "public",
    controller.getPublicSiteSettings
  );

  // Get site logo (public)
  app.get(
    base + "logo",
    controller.getLogo
  );

  // Get site icon (public)
  app.get(
    base + "icon",
    controller.getIcon
  );

  // Get site background (public)
  app.get(
    base + "background",
    controller.getBackground
  );
};