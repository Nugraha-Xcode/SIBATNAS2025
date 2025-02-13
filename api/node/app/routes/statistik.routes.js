const { authJwt } = require("../middleware");

const controller = require("../controllers/statistik.controller.js");
const base = "/api/statistik/";

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(base, [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.get(base, [authJwt.verifyToken], controller.findAll);

  app.get(
    base + "latest_five",
    [authJwt.verifyToken],
    controller.findLatestFive
  );

  app.get(base + "number", controller.findNumber);

  app.get(base + ":uuid", [authJwt.verifyToken], controller.findByUuid);
  // app.get(base + "image/:uuid", controller.imageByUuid);
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
  app.delete(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
