const { authJwt } = require("../middleware");

const controller = require("../controllers/dataProdusen.controller.js");
const base = "/api/data-produsen/";

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
  /*
  app.post(base + "datang", [authJwt.verifyToken], controller.createDatang);

  app.put(
    base + "pulang/:uuid",
    [authJwt.verifyToken],
    controller.updatePulang
  );
  
  app.post(
    "/api/lokasi/",
    [authJwt.verifyToken, authJwt.isAdmin],
    lokasi.create
  );
  */
  // Retrieve all Lokasi
  //app.get(base, [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
  app.get(base, [authJwt.verifyToken], controller.findAll);
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

  // Retrieve all published Users
  //router.get("/activated", lokasi.findAllActivated);
  app.get(base + "photo/:uuid", controller.viewPhotoByUUID);

  // Retrieve a single User with id
  app.get(base + ":id", controller.findLokasiById);

  app.get(base + "unduhReferensi/:uuid", controller.downloadReferensi);
  app.get(base + "unduhMetadata/:uuid", controller.downloadMetadata);
  app.get(base + "unduhFile/:uuid", controller.downloadFile);

  // Update a User with id
  app.put(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  // Delete a User with id
  app.delete(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isProdusenOrAdmin],
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
