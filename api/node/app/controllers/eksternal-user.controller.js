const db = require("../models");
const eksternal = db.eksternal;
const user = db.user;
const KategoriTematik = db.kategoriTematik;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eksternal && !req.body.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  eksternal
    .findOne({ where: { uuid: req.body.eksternal.uuid } })
    .then((bp) => {
      if (!bp) {
        console.log("Eksternal not found!");
        return null;
      }
      return user.findByPk(req.body.user.id).then((us) => {
        if (!us) {
          console.log("User not found!");
          return null;
        }

        bp.addUser(us);
        console.log(`>> added User id=${us.id} to Produsen id=${bp.id}`);
        //return bp;
        return res.send({
          uuid: us.uuid,
          username: us.username,
          eksternals: [
            {
              uuid: bp.uuid,
              name: bp.name,
              akronim: bp.akronim,
            },
          ],
        });
      });
    })
    .catch((err) => {
      console.log(">> Error while adding User to Produsen: ", err);
    });
  /*
  // Create a Tutorial
  const input = {
    // uuid: uuidv4(),
    bpkhtlId: req.body.bpkhtl.id,
    provinceId: req.body.province.id,
  };

  // Save Tutorial in the database
  kategoriTematik
    .create(input)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
    */
};

exports.findKategoriById = (id) => {
  return kategoriTematik
    .findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Kategori.",
      });
    });
};

exports.findByUuid = (req, res) => {
  const uuid = req.params.uuid;
  user
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Kategori Not found." });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Kategori with uuid=" + uuid,
      });
    });
};

exports.findByEksternalUuid = (req, res) => {
  const uuid = req.params.uuid;
  eksternal
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        res.send([]);
        //return res.status(404).send({ message: "Kategori Not found." });
      } else {
        let eks_user = await data.getUsers();
        console.log(eks_user.length);
        if (eks_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < eks_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(eks_user[i].id);
          }
          user
            .findAll({
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
                  model: eksternal,
                  as: "eksternals",
                  attributes: ["uuid", "name", "akronim"],
                  through: {
                    attributes: [],
                  },
                },
              ],
              attributes: ["id", "uuid", "username"],
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
        //console.log(tematiks);
        //res.send(eks_tema);
        //data.().then(async (tematik) => {
        //  console.log(tematik);
        //});
        /*
        eksternal
          .findAll({
            where: { id: data.id },
            include: [
              {
                model: tematik,
                as: "tematiks",
                attributes: ["uuid", "name"],
                through: {
                  attributes: [],
                },
              },
            ],
          })
          .then((data) => {
            res.send(data);
            //console.log(data);
            //var results = [];
            //data.forEach((da) => {
            //  if (da.tematiks) {
            //    if (da.tematiks.length) {
            //      results.push(da);
            //   }
            //}
            //});

            //res.send(results);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Kategori.",
            });
          });
          */
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving Eksternal with uuid=" + uuid,
      });
    });
};

exports.findAll = (req, res) => {
  /*province
    .findAll({
      include: [
        {
          model: bpkhtl,
          as: "bpkhtls",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Kategori.",
      });
    });
    */

  eksternal
    .findAll({
      include: [
        {
          model: user,
          as: "users",
          attributes: ["id", "uuid", "username"],
          through: {
            attributes: [],
          },
        },
      ],
    })
    .then((data) => {
      //console.log(data);
      var results = [];
      data.forEach((da) => {
        if (da.users) {
          if (da.users.length) {
            results.push(da);
          }
        }
      });

      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Kategori.",
      });
    });
  //console.log("Browser: " + req.headers["user-agent"]);
  /*
  kategoriTematik
    .findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name", "location", "uuid", "createdAt"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Kategori.",
      });
    });
    */
};
// Delete a Kategori with the specified id in the request
exports.delete = (req, res) => {
  const uuid1 = req.params.uuid1;
  const uuid2 = req.params.uuid2;

  eksternal
    .findOne({
      where: {
        uuid: uuid1,
      },
    })
    .then(async (data) => {
      if (!data) {
        //res.send([]);
        return res.status(404).send({ message: "Eksternal Not found." });
      } else {
        let eks_user = await data.getUsers();
        console.log(eks_user.length);
        if (eks_user.length == 0) {
          //res.send([]);
          return res.status(404).send({ message: "User Not found." });
        } else {
          let users = [];
          let id_to_removed = 0;
          for (let i = 0; i < eks_user.length; i++) {
            //console.log(eks_tema[i]);
            if (uuid2 != eks_user[i].uuid) users.push(eks_user[i].id);
            else id_to_removed = eks_user[i].id;
          }
          data.removeUser(id_to_removed);
          res.send({
            message: "User was deleted successfully!",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving Eksternal with uuid=" + uuid1,
      });
    });

  /*
  const uuid = req.params.uuid;

  kategoriTematik
    .destroy({
      where: { uuid: uuid },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Kategori was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Kategori with uuid=${id}. Maybe Kategori was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Kategori with id=" + id,
      });
    });
    */
};
