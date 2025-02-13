const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ uuid: user.uuid }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        if (authorities.length > 0) {
          if (authorities[0] == "ROLE_EKSTERNAL") {
            ekst = await user.getEksternals();
            reg = await db.eksternal.findByPk(ekst[0].id, {
              include: [
                {
                  model: db.kategoriEksternal,
                  as: "kategoriEksternal",
                  attributes: ["uuid", "name"],
                },
                {
                  model: db.region,
                  as: "regions",
                  attributes: ["id", "uuid", "kode", "name"],
                  through: {
                    attributes: [],
                  },
                },
              ],
              attributes: ["uuid", "name", "akronim"],
            });
            //khusus region pemerintah kab/kota
            if (ekst[0].kategoriEksternalId == 3) {
              res.status(200).send({
                uuid: user.uuid,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                eksternal: reg,
                refreshToken: refreshToken,
              });
            } else {
              res.status(200).send({
                uuid: user.uuid,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
              });
            }
          } else {
            res.status(200).send({
              uuid: user.uuid,
              username: user.username,
              email: user.email,
              roles: authorities,
              accessToken: token,
              refreshToken: refreshToken,
            });
          }
        } else {
          return res.status(401).send({
            accessToken: null,
            message: "Role not found",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.password = (req, res) => {
  const uuid = req.params.uuid;

  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      } else {
        const passwordIsValid = bcrypt.compareSync(
          req.body.passwordOld,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            message: "Wrong Old Password!",
          });
        }

        if (req.body.passwordNew != req.body.passwordRepeat) {
          return res.status(401).send({
            message: "New Password and Repeat Password does not match!",
          });
        }

        User.update(
          {
            password: bcrypt.hashSync(req.body.passwordNew, 8),
          },
          {
            where: { uuid: uuid },
          }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully.",
              });
            } else {
              res.send({
                message: `Cannot update User with uuid=${uuid}. Maybe User was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating User with uuid=" + uuid,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    console.log(refreshToken);

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
