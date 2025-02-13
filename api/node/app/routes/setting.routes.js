const { authJwt } = require("../middleware");

const controller = require("../controllers/setting.controller.js");
const base = "/api/setting/";

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // var router = require("express").Router();

  // Create a new Lokasi
  //app.post("/api/kategori/", kategori.create);

  app.post(base, [authJwt.verifyToken, authJwt.isAdmin], controller.create);

  // Retrieve a single User with id
  app.get(base + "aktif", [authJwt.verifyToken], controller.findAktif);

  // Update a User with id
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );
};
