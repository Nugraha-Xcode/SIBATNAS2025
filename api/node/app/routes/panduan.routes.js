const { authJwt } = require("../middleware");
const controller = require("../controllers/panduan.controller");
const base = "/api/panduan/";

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get panduan
  app.get(
    base,
    [authJwt.verifyToken],
    controller.getAllPanduan
  );

  app.post(base, [authJwt.verifyToken, authJwt.isAdmin], controller.createPanduan);

  // Update panduan (admin only)
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updatePanduan
  );

  app.delete(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deletePanduan
  );

    // Get panduan (public)
    app.get(
      base + "public",
      controller.getAllPublicPanduan
    );
};