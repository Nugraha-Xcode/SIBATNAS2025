const { authJwt } = require("../middleware");

const controller = require("../controllers/publikasi_csw.controller.js");
const base = "/api/publikasi_csw/";

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

  app.put(base + "publish/:uuid", [authJwt.verifyToken], controller.publish);
  app.put(
    base + "deactivate/:uuid",
    [authJwt.verifyToken],
    controller.deactivate
  );

  app.get(
    base + "unduh/indonesia/:uuid/:user_uuid",
    [authJwt.verifyToken],
    controller.unduhIndonesia
  );

  app.get(
    base + "unduh/provinsi/:uuid/:kode/:user_uuid",
    [authJwt.verifyToken],
    controller.unduhProvinsi
  );
  app.get(
    base + "unduh/region/:uuid/:kode/:user_uuid",
    [authJwt.verifyToken],
    controller.unduhRegion
  );

  /*
  app.post(
    "/api/lokasi/",
    [authJwt.verifyToken, authJwt.isAdmin],
    lokasi.create
  );
  */
  // Retrieve all Lokasi
  //app.get(base, [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.get(base, [authJwt.verifyToken], controller.findAll);
  app.get(base + "publik", controller.findAllPublik);
  app.get(
    base + "lokasi/:uuid",
    [authJwt.verifyToken],
    controller.findAllLokasi
  );

  app.get(
    base + "produsen/:uuid",
    [authJwt.verifyToken],
    controller.findAllProdusen
  );

  app.get(
    base + "produsen-admin/:uuid",
    [authJwt.verifyToken],
    controller.findAllProdusenAdmin
  );

  app.get(
    base + "eksternal-user/:uuid",
    [authJwt.verifyToken],
    controller.findAllEksternalUser
  );

  app.get(
    base + "internal-user/:uuid",
    [authJwt.verifyToken],
    controller.findAllInternalUser
  );

  app.get(base + "igt/:query", [authJwt.verifyToken], controller.findAllIGT);

  app.get(base + ":uuid", [authJwt.verifyToken], controller.findByUUID);

  // Retrieve all published Users
  //router.get("/activated", lokasi.findAllActivated);
  app.get(base + "photo/:uuid", controller.viewPhotoByUUID);

  // Retrieve a single User with id
  //app.get(base + ":id", controller.findLokasiById);

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

  // Update a User with id
  //router.put("/:id", users.update);

  // Delete a User with id
  //router.delete("/:id", users.delete);

  // Delete all Users
  //router.delete("/", users.deleteAll);

  //app.use("/api/lokasi", router);
};
