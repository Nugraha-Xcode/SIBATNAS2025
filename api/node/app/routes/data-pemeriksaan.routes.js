const { authJwt } = require("../middleware");

const controller = require("../controllers/dataPemeriksaan.controller.js");
const base = "/api/data-pemeriksaan/";

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
  app.post(base, [authJwt.verifyToken], controller.create);
  app.get(
    base + "produsen/:uuid",
    [authJwt.verifyToken],
    controller.findAllProdusen
  );
  app.get(
    base + "user/:uuid",
    [authJwt.verifyToken],
    controller.findAllProdusenUser
  );

  app.get(base, [authJwt.verifyToken], controller.findAll);

  app.get(base + "unduhFile/:uuid", controller.downloadFile);

  app.get(base + "photo/:uuid", controller.viewPhotoByUUID);

  // Update a User with id
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  // Delete a User with id
  app.delete(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
