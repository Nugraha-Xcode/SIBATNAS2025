const { authJwt } = require("../middleware");

const controller = require("../controllers/kategoriTematik.controller.js");
const base = "/api/kategori-tematik/";

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

  // Retrieve all Lokasi
  //app.get("/api/kategori/", kategori.findAll);
  app.get(base, [authJwt.verifyToken], controller.findAll);

  // Retrieve all published Users
  //router.get("/activated", lokasi.findAllActivated);

  // Retrieve a single User with id
  app.get(base + ":uuid", [authJwt.verifyToken], controller.findByUuid);

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
