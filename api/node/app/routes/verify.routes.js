const { authJwt } = require("../middleware");

const controller = require("../controllers/verify.controller.js");
const base = "/api/verify/";

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
  app.post(base, [authJwt.verifyToken], controller.check);
};
