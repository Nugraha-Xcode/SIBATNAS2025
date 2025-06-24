const { authJwt } = require("../middleware");

const user = require("../controllers/user.controller.js");
const base = "/api/user/";

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

  app.post(base, [authJwt.verifyToken, authJwt.isAdmin], user.create);

  // Retrieve all Lokasi
  //app.get("/api/kategori/", kategori.findAll);
  app.get(base, [authJwt.verifyToken], user.findAll);
  app.get(
    base + "eksternal",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.findUserEksternal
  );

  app.get(
    base + "produsen",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.findUserProdusen
  );
  app.get(
    base + "walidata",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.findUserWalidata
  );

  app.get(
    "/api/user/role/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.findByRoleId
  );
  // Retrieve all published Users
  //router.get("/activated", lokasi.findAllActivated);

  // Retrieve a single User with id
  app.get(base + ":uuid", [authJwt.verifyToken], user.findUserByUuid);

  // Update a User with id
  app.put(base + ":uuid", [authJwt.verifyToken, authJwt.isAdmin], user.update);

  app.put(base + "profile/:uuid", [authJwt.verifyToken], user.profile);
  app.put(
    base + "reset/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.resetPassword
  );
  // Delete a User with id
  app.delete(
    base + ":uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    user.delete
  );
};
