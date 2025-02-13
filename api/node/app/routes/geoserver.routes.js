const { authJwt } = require("../middleware");

const controller = require("../controllers/geoserver.controller.js");
const base = "/api/geoserver/";

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

  app.get(base + "wms/reflect", [], controller.forwardRequest);
};
