const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.uuid;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findOne({
    where: {
      uuid: req.userId,
    },
  }).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

isWalidataOrAdmin = (req, res, next) => {
  User.findOne({
    where: {
      uuid: req.userId,
    },
  }).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "walidata") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Walidata or Admin Role!",
      });
    });
  });
};

isEksternalOrAdmin = (req, res, next) => {
  User.findOne({
    where: {
      uuid: req.userId,
    },
  }).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "eksternal") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Eksternal or Admin Role!",
      });
    });
  });
};

isProdusenOrAdmin = (req, res, next) => {
  User.findOne({
    where: {
      uuid: req.userId,
    },
  }).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "produsen") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Eksternal or Admin Role!",
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isWalidataOrAdmin: isWalidataOrAdmin,
  isProdusenOrAdmin: isProdusenOrAdmin,
  isEksternalOrAdmin: isEksternalOrAdmin,
};
module.exports = authJwt;
