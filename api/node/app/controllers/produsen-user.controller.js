const db = require("../models");
const produsen = db.produsen;
const user = db.user;
const KategoriTematik = db.kategoriTematik;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = async (req, res) => {
  try {
    const { produsen: produsenData, user: userData } = req.body;

    if (!produsenData || !userData) {
      console.log("Request body tidak lengkap.");
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    console.log("Cek Produsen dan User...");
    const bp = await produsen.findOne({ where: { uuid: produsenData.uuid } });
    if (!bp) {
      console.log("Produsen tidak ditemukan.");
      return res.status(404).send({ message: "Produsen not found!" });
    }

    const us = await user.findOne({
      where: { uuid: userData.uuid },
      include: {
        model: produsen,
        as: "produsens",
        attributes: ["uuid", "name"],
        through: { attributes: [] },
      },
    });

    if (!us) {
      console.log("User tidak ditemukan.");
      return res.status(404).send({ message: "User not found!" });
    }

    // Cek apakah sudah ada relasi user-produsen yang sama
    const isAlreadyLinked = us.produsens.some((p) => p.uuid === bp.uuid);
    if (isAlreadyLinked) {
      console.log("User sudah terhubung dengan produsen yang sama.");
      return res.status(409).send({ message: "User sudah terhubung dengan produsen ini." });
    }

    // Cek apakah user sudah terhubung ke produsen lain
    if (us.produsens.length > 0) {
      console.log("User sudah terhubung ke produsen lain:", us.produsens);
      return res.status(409).send({
        message: "User sudah terhubung ke produsen lain.",
        existingProdusen: us.produsens,
      });
    }

    // Lakukan asosiasi jika semua pengecekan lolos
    await bp.addUser(us);
    console.log(`User ${us.uuid} ditambahkan ke produsen ${bp.uuid}`);

    return res.send({
      uuid: us.uuid,
      username: us.username,
      email: us.email,
      produsens: [
        {
          uuid: bp.uuid,
          name: bp.name,
          akronim: bp.akronim,
        },
      ],
    });
  } catch (err) {
    console.error("Terjadi error saat menambahkan user ke produsen:", err);
    return res.status(500).send({
      message: "Internal server error.",
    });
  }
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

exports.findByProdusenUuid = (req, res) => {
  const uuid = req.params.uuid;
  produsen
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
        let bpkhtl_province = await data.getUsers();
        console.log(bpkhtl_province.length);
        if (bpkhtl_province.length == 0) {
          res.send([]);
        } else {
          let provinces = [];
          for (let i = 0; i < bpkhtl_province.length; i++) {
            //console.log(eks_tema[i]);
            provinces.push(bpkhtl_province[i].id);
          }
          user
            .findAll({
              where: {
                id: {
                  [Op.or]: provinces,
                },
              },
              order: [["username", "ASC"]],
              offset: 0,
              limit: 100,
              include: [
                {
                  model: produsen,
                  as: "produsens",
                  attributes: ["uuid", "name", "akronim"],
                  through: {
                    attributes: [],
                  },
                },
              ],
              attributes: ["uuid", "username", "email"],
            })
            .then((data) => {
              //sconsole.log(data);
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
      console.log(err);
      res.status(500).send({
        message: "Error retrieving Produsen with uuid=" + uuid,
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

  produsen
    .findAll({
      include: [
        {
          model: KategoriTematik,
          as: "kategoriTematik",
          attributes: ["id", "uuid", "name"],
        },
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

// Update a Kategori by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  kategoriTematik
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Kategori Not found." });
      } else {
        kategoriTematik
          .update(req.body, {
            where: { id: data.id },
          })
          .then((num) => {
            if (num == 1) {
              kategoriTematik
                .findByPk(data.id)

                .then((update) => {
                  res.send(update);
                });

              //res.send({
              //  message: "Katagori was updated successfully.",
              //});
            } else {
              res.send({
                message: `Cannot update Kategori with id=${id}. Maybe Kategori was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Kategori with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Kategori.",
      });
    });
};

// Delete a Kategori with the specified id in the request

// Delete a Kategori with the specified id in the request
exports.delete = (req, res) => {
  const uuid1 = req.params.uuid1;
  const uuid2 = req.params.uuid2;

  produsen
    .findOne({
      where: {
        uuid: uuid1,
      },
    })
    .then(async (data) => {
      if (!data) {
        //res.send([]);
        return res.status(404).send({ message: "Produsen Not found." });
      } else {
        let eks_tema = await data.getUsers();
        console.log(eks_tema.length);
        if (eks_tema.length == 0) {
          //res.send([]);
          return res.status(404).send({ message: "User Not found." });
        } else {
          let tematiks = [];
          let id_to_removed = 0;
          for (let i = 0; i < eks_tema.length; i++) {
            //console.log(eks_tema[i]);
            if (uuid2 != eks_tema[i].uuid) tematiks.push(eks_tema[i].id);
            else id_to_removed = eks_tema[i].id;
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
        message: "Error retrieving Produsen with uuid=" + uuid1,
      });
    });
};
