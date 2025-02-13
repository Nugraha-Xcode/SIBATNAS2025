const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");

const kategoriTematik = db.province;
const Op = db.Sequelize.Op;
const uploadProvinsi = require("../middleware/uploadProvinsi");

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
    kode: req.body.kode,
    name: req.body.name,
    has_geometry: false,
    is_grass: false,
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

exports.uploadPolygon = async (req, res) => {
  const uuid = req.params.uuid;

  await uploadProvinsi(req, res);
  //console.log(req.body);
  //console.log(req.body.data);

  if (req.files == undefined) {
    return res.status(400).send({ message: "Please upload a file!" });
  }
  //console.log(req.body.data);
  //console.log("%o", req.body.data);
  //console.log(JSON.stringify(req.body.data));
  //console.log(req.body.nip);
  //var objectValue = JSON.parse(req.body.user);
  //console.log(objectValue);
  //console.log("oke bos");
  kategoriTematik
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (prov) => {
      if (!prov) {
        return res.status(404).send({ message: "Provinsi Not found." });
      }

      const update = {
        has_geometry: true,
        is_grass: false,
        filename: req.files[0].filename,
      };
      kategoriTematik
        .update(update, {
          where: { id: prov.id },
        })
        .then((num) => {
          if (num == 1) {
            kategoriTematik
              .findByPk(prov.id, {
                order: [["name", "ASC"]],
                attributes: [
                  "id",
                  "uuid",
                  "kode",
                  "name",
                  "has_geometry",
                  "is_grass",
                  "filename",
                  "urlGeoserver",
                  "uuid",
                ],
              })
              .then((data) => {
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while querying the Provinsi.",
                });
              });
          } else {
            res.send({
              message: `Cannot update Provinsi with uuid=${uuid}. Maybe Provinsi was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Provinsi with uuid=" + uuid,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.grass = async (req, res) => {
  const uuid = req.params.uuid;

  kategoriTematik
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (prov) => {
      if (!prov) {
        return res.status(404).send({ message: "Provinsi Not found." });
      }
      if (!prov.kode) {
        return res
          .status(404)
          .send({ message: "Provinsi tidak memiliki kode." });
      }
      const url = config.api_grass + "/konversi/provinsi/" + prov.kode; // Replace with your API endpoint URL

      const response = await axios.get(url);
      console.log(response.data);
      // Send the image data as the response
      if (response.data.status == "success") {
        const update = {
          is_grass: true,
        };
        kategoriTematik
          .update(update, {
            where: { id: prov.id },
          })
          .then((num) => {
            if (num == 1) {
              kategoriTematik
                .findByPk(prov.id, {
                  order: [["name", "ASC"]],
                  attributes: [
                    "id",
                    "uuid",
                    "kode",
                    "name",
                    "has_geometry",
                    "is_grass",
                    "filename",
                    "urlGeoserver",
                    "uuid",
                  ],
                })
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while querying the Provinsi.",
                  });
                });
            } else {
              res.send({
                message: `Cannot convert Provinsi with uuid=${uuid}. Maybe Provinsi was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            //console.log(err);
            res.status(500).send({
              message: "Error updating Provinsi with uuid=" + uuid,
            });
          });
      } else {
        res.status(500).send({
          message: "Error converting Provinsi with uuid=" + uuid,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.downloadFile = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await kategoriTematik.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.filename;
  const directoryPath = __basedir + "/app/resources/static/assets/provinsi/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
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
        "id",
        "uuid",
        "kode",
        "name",
        "has_geometry",
        "is_grass",
        "filename",
        "urlGeoserver",
        "uuid",
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

exports.findAllEksternal = async (req, res) => {
  const uuid = req.params.uuid;

  dataEkst = await db.dataEksternal.findOne({
    where: {
      uuid: uuid,
    },
    include: [{ model: db.user, as: "user", attributes: ["id", "username"] }],
  });
  //console.log(dataEkst);
  dataUser = await db.user.findByPk(dataEkst.user.id);
  //console.log(dataUser);

  ekst = await dataUser.getEksternals();
  //console.log(ekst);

  d = await db.eksternal.findByPk(ekst[0].id);
  let dataProv = await d.getProvinces();
  console.log(dataProv.length);
  if (dataProv.length == 0) {
    res.send([]);
  } else {
    let provinces = [];
    for (let i = 0; i < dataProv.length; i++) {
      //console.log(eks_tema[i]);
      provinces.push(dataProv[i].id);
    }
    console.log(provinces);
    kategoriTematik
      .findAll({
        where: {
          id: {
            [Op.or]: provinces,
          },
        },
        order: [["name", "ASC"]],
        attributes: [
          "id",
          "uuid",
          "kode",
          "name",
          "has_geometry",
          "is_grass",
          "filename",
          "urlGeoserver",
          "uuid",
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
  }
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
};
