const { authJwt } = require("../middleware");

const role = require("../controllers/role.controller.js");

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
  /*
  app.post(
    "/api/role/",
    [authJwt.verifyToken, authJwt.isAdmin],
    kategori.create
  );
    */
  // Retrieve all Lokasi
  //app.get("/api/kategori/", kategori.findAll);
  app.get("/api/role/", [authJwt.verifyToken, authJwt.isAdmin], role.findAll);

  // Retrieve all published Users
  //router.get("/activated", lokasi.findAllActivated);
  /*
  // Retrieve a single User with id
  app.get(
    "/api/kategori/:id",
    [authJwt.verifyToken],
    kategori.findKategoriById
  );

  // Update a User with id
  app.put(
    "/api/kategori/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    kategori.update
  );

  // Delete a User with id
  app.delete(
    "/api/kategori/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    kategori.delete
  );

  // Delete all Users
  //router.delete("/", users.deleteAll);

  //app.use("/api/lokasi", router);
  */
};
