require("dotenv").config();
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
var bcrypt = require("bcryptjs");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (
    !req.body.username &&
    !req.body.email &&
    !req.body.password &&
    !req.body.roles
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const user = {
    uuid: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };

  // Save Tutorial in the database
  User.create(user)
    .then((user) => {
      if (req.body.roles) {
        console.log(req.body.roles);
        const q = req.body.roles.name;
        Role.findAll({
          where: {
            name: {
              [Op.or]: [q],
            },
          },
        }).then((roles) => {
          console.log(roles);
          user.setRoles(roles).then(() => {
            //res.send({ message: "User was registered successfully!" });
            User.findByPk(user.id, {
              include: [
                {
                  model: Role,
                  attributes: ["id", "name"],
                  through: {
                    attributes: [],
                  },
                },
              ],
              attributes: { exclude: ["password"] },
            })
              .then((user_) => {
                res.send(user_);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the User.",
                });
              });
          });
        });
      } else {
        // user role = 1
        user.setRoles([5]).then(() => {
          res.send({ message: "User was created successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findUserEksternal = (req, res) => {
  Role.findOne({
    where: {
      name: "eksternal",
    },
  })
    .then(async (role) => {
      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      } else {
        //role.getUsers();
        let role_user = await role.getUsers();
        console.log(role_user.length);
        if (role_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < role_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(role_user[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Users.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findUserInternal = (req, res) => {
  Role.findOne({
    where: {
      name: "internal",
    },
  })
    .then(async (role) => {
      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      } else {
        //role.getUsers();
        let role_user = await role.getUsers();
        console.log(role_user.length);
        if (role_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < role_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(role_user[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Users.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.findUserBpkhtl = (req, res) => {
  Role.findOne({
    where: {
      name: "bpkhtl",
    },
  })
    .then(async (role) => {
      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      } else {
        //role.getUsers();
        let role_user = await role.getUsers();
        console.log(role_user.length);
        if (role_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < role_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(role_user[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Users.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.findUserProdusen = (req, res) => {
  Role.findOne({
    where: {
      name: "produsen",
    },
  })
    .then(async (role) => {
      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      } else {
        //role.getUsers();
        let role_user = await role.getUsers();
        console.log(role_user.length);
        if (role_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < role_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(role_user[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Users.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};
exports.findUserWalidata = (req, res) => {
  Role.findOne({
    where: {
      name: "walidata",
    },
  })
    .then(async (role) => {
      if (!role) {
        return res.status(404).send({ message: "Role Not found." });
      } else {
        //role.getUsers();
        let role_user = await role.getUsers();
        console.log(role_user.length);
        if (role_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < role_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(role_user[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving Users.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findByRoleId = (req, res) => {
  const id = req.params.id;
  Role.findByPk(id)
    .then(async (data) => {
      if (!data) {
        res.send([]);
        //return res.status(404).send({ message: "Kategori Not found." });
      } else {
        let user_role = await data.getUsers();
        console.log(user_role.length);
        if (user_role.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < user_role.length; i++) {
            //console.log(eks_tema[i]);
            users.push(user_role[i].id);
          }
          User.findAll({
            where: {
              id: {
                [Op.or]: users,
              },
            },
            order: [["username", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              {
                model: Role,
                as: "roles",
                attributes: ["id", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["password"] },
          })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving Provinces.",
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Role with id=" + id,
      });
    });
};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  User.findAll({
    where: condition,
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
    attributes: { exclude: ["password"] },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single Tutorial with an id
exports.findUserById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

exports.findUserByUuid = (req, res) => {
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
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
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
        User.update(req.body, {
          where: { uuid: uuid },
        })
          .then((num) => {
            if (num == 1) {
              //res.send({
              //message: "User was updated successfully.",
              //});
              const q = req.body.roles[0].name;
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: [q],
                  },
                },
              })
                .then((roles) => {
                  console.log(roles);
                  User.findByPk(user.id, {
                    include: [
                      {
                        model: Role,
                        attributes: ["id", "name"],
                        through: {
                          attributes: [],
                        },
                      },
                    ],
                    attributes: { exclude: ["password"] },
                  })
                    .then((user_) => {
                      user_
                        .setRoles(roles)
                        .then(() => {
                          res.send(user_);
                        })
                        .catch((err) => {
                          res.status(500).send({ message: err.message });
                        });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while updating the User.",
                      });
                    });
                })
                .catch((err) => {
                  res.status(500).send({ message: err.message });
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

exports.resetPassword = (req, res) => {
  const uuid = req.params.uuid;
  const update = {
    password: bcrypt.hashSync(process.env.RESET_PASSWORD, 8),
  };

  User.update(update, {
    where: { uuid: uuid },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot reset User with uuid=${uuid}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error resetting User with uuid=" + uuid,
      });
    });
};
exports.profile = (req, res) => {
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
        console.log(req.body);
        User.update(req.body, {
          where: { uuid: uuid },
        })
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
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const uuid = req.params.uuid;

  User.destroy({
    where: { uuid: uuid },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${uuid}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + uuid,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} User were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

// Find all activated Users
exports.findAllActivated = (req, res) => {
  User.findAll({ where: { isActive: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving active users.",
      });
    });
};
