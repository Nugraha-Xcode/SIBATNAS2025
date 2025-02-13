const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");

const kategoriTematik = db.record;
const dataPublikasi = db.dataPublikasi;

const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.kode && !req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
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
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Kategori with uuid=" + uuid,
      });
    });
};

exports.findAll = (req, res) => {
  kategoriTematik
    .findAll({
      order: [["name", "ASC"]],
      attributes: [
        "identifier",
        "title",
        "abstract",
        "insert_date",
        "date_publication",
        "type",
        "keywords",
        "organization",
        "links",
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

exports.findAllPublik = (req, res) => {
  kategoriTematik
    .findAll({
      order: [["title", "ASC"]],
      attributes: [
        "identifier",
        "title",
        "abstract",
        "insert_date",
        "date_publication",
        "type",
        "keywords",
        "organization",
        "links",
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Record.",
      });
    });
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
exports.delete = (req, res) => {
  const identifier = req.params.identifier;

  kategoriTematik
    .destroy({
      where: { identifier: identifier },
    })
    .then((num) => {
      if (num == 1) {
        const update = {
          identifier: null,
        };
        dataPublikasi
          .update(update, {
            where: { identifier: identifier },
          })
          .then(async (num) => {
            if (num == 1) {
              /*let users = await User.findAll({ attributes: ["id"] });
              for (let i = 0; i < users.length; i++) {
                let notif = {
                  uuid: uuidv4(),
                  waktuKirim: new Date(),
                  subjek: "Publikasi IGT Baru - " + publikasi.tematik.name,
                  pesan:
                    "Walidata baru saja melakukan publikasi data IGT " +
                    publikasi.tematik.name +
                    " (" +
                    publikasi.deskripsi +
                    "). Cek ke menu Data Publikasi ya!",
                  sudahBaca: false,
                  userId: users[i].id,
                };

                notifikasi.create(notif);
              }
                */
              res.send({
                message: "Record was deleted successfully!",
              });
            } else {
              res.send({
                message: `Cannot update Data Publikasi with identifier=${identifier}. Maybe Data Publikasi was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message:
                "Error updating Data Publikasi with identifier=" + identifier,
            });
          });
      } else {
        res.send({
          message: `Cannot delete Record with identifier=${identifier}. Maybe Record was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Record with identifier=" + identifier,
      });
    });
};

exports.countAll = (req, res) => {
  kategoriTematik
    .count()
    .then((count) => {
      res.send({ count });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while counting Record.",
      });
    });
};
