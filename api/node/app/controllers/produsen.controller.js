const db = require("../models");
const produsen = db.produsen;
const KategoriTematik = db.kategoriTematik;
const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name && !req.body.akronim && !req.body.kategoriTematik) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
    akronim: req.body.akronim,
    kategoriTematikId: req.body.kategoriTematik.id,
  };

  // Save Tutorial in the database
  produsen
    .create(input)
    .then((data) => {
      //res.send(data);
      produsen
        .findByPk(data.id, {
          attributes: ["id", "name", "uuid", "akronim", "createdAt"],
          include: [
            {
              model: KategoriTematik,
              as: "kategoriTematik",
              attributes: ["id", "uuid", "name"],
            },
          ],
        })
        .then((pega) => {
          res.send(pega);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the BukuTamu.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findKategoriById = (id) => {
  return produsen
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
  produsen
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Produsen Not found." });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Produsen with uuid=" + uuid,
      });
    });
};

exports.findByKategoriUuid = (req, res) => {
  const uuid = req.params.uuid;
  KategoriTematik.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (data) => {
      if (!data) {
        return res.send([]);
        //return res.status(404).send({ message: "Kategori Tematik Not found." });
      } else {
        produsen
          .findAll({
            where: {
              kategoriTematikId: data.id,
            },
            order: [["name", "ASC"]],
            attributes: ["id", "name", "uuid", "akronim", "createdAt"],
            include: [
              {
                model: KategoriTematik,
                as: "kategoriTematik",
                attributes: ["id", "uuid", "name"],
              },
            ],
          })
          .then((prod) => {
            res.send(prod);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Kategori.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tematik Produsen with uuid=" + uuid,
      });
    });
};
exports.findAll = (req, res) => {
  produsen
    .findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name", "uuid", "akronim", "createdAt"],
      include: [
        {
          model: KategoriTematik,
          as: "kategoriTematik",
          attributes: ["id", "uuid", "name"],
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
};

// Update a Kategori by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  produsen
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Produsen Not found." });
      } else {
        const _update = {
          name: req.body.name,
          akronim: req.body.akronim,
          kategoriTematikId: req.body.kategoriTematik.id,
        };
        produsen
          .update(_update, {
            where: { id: data.id },
          })
          .then((num) => {
            if (num == 1) {
              produsen
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
exports.delete = (req, res) => {
  const uuid = req.params.uuid;

  produsen
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
};
