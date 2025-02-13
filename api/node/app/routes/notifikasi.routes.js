const { authJwt } = require("../middleware");

const controller = require("../controllers/notifikasi.controller.js");
const base = "/api/notifikasi/";

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(base, [authJwt.verifyToken], controller.findAll);
  app.get(base + "user/:uuid", [authJwt.verifyToken], controller.findAllUser);
};
