const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /*
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );
  */
  
  // Regular login routes
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signinCaptcha", controller.signinCaptcha);
  
  // New INA Geo login route
  app.post("/api/auth/signinInaGeo", controller.signinInaGeo);

  app.put(
    "/api/auth/password/" + ":uuid",
    [authJwt.verifyToken],
    controller.password
  );
  app.post("/api/auth/refreshtoken", controller.refreshToken);
};