const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");
const kategoriTematik = db.region;
const Provinsi = db.province;
const Op = db.Sequelize.Op;

const uploadRegion = require("../middleware/uploadRegion");

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  //var objectValue = JSON.parse(req.body.provinsi);
  //console.log(objectValue);
  //console.log(req.body);

  if (!req.body.kode && !req.body.name && !req.body.province) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  //console.log(req.body.province);
  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    kode: req.body.kode,
    name: req.body.name,
    has_geometry: false,
    is_grass: false,
    provinceId: req.body.province.id,
  };

  // Save Tutorial in the database
  kategoriTematik
    .create(input)
    .then((data) => {
      kategoriTematik
        .findByPk(data.id, {
          attributes: [
            "kode",
            "name",
            "uuid",
            "has_geometry",
            "is_grass",
            "filename",
            "urlGeoserver",
          ],
          include: [
            {
              model: Provinsi,
              as: "province",
              attributes: ["id", "kode", "uuid", "name"],
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

exports.uploadPolygon = async (req, res) => {
  const uuid = req.params.uuid;

  await uploadRegion(req, res);
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
        return res.status(404).send({ message: "Region Not found." });
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
                  "kode",
                  "name",
                  "uuid",
                  "has_geometry",
                  "is_grass",
                  "filename",
                  "urlGeoserver",
                ],
                include: [
                  {
                    model: Provinsi,
                    as: "province",
                    attributes: ["id", "kode", "uuid", "name"],
                  },
                ],
              })
              .then((data) => {
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while querying the Region.",
                });
              });
          } else {
            res.send({
              message: `Cannot update Region with uuid=${uuid}. Maybe Region was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Region with uuid=" + uuid,
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
    .then(async (region) => {
      if (!region) {
        return res.status(404).send({ message: "Region Not found." });
      }
      if (!region.kode) {
        return res.status(404).send({ message: "Region tidak memiliki kode." });
      }
      const url = config.api_grass + "/konversi/kabkot/" + region.kode; // Replace with your API endpoint URL

      const response = await axios.get(url);
      console.log(response.data);
      // Send the image data as the response
      if (response.data.status == "success") {
        const update = {
          is_grass: true,
        };
        kategoriTematik
          .update(update, {
            where: { id: region.id },
          })
          .then((num) => {
            if (num == 1) {
              kategoriTematik
                .findByPk(region.id, {
                  order: [["name", "ASC"]],
                  include: [
                    {
                      model: Provinsi,
                      as: "province",
                      attributes: ["id", "kode", "uuid", "name"],
                    },
                  ],
                  attributes: [
                    "id",
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
              message: "Error updating Region with uuid=" + uuid,
            });
          });
      } else {
        res.status(500).send({
          message: "Error converting Region with uuid=" + uuid,
        });
      }
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

exports.findByProvinsiUuid = (req, res) => {
  const uuid = req.params.uuid;
  Provinsi.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (data) => {
      if (!data) {
        res.send([]);
        //return res.status(404).send({ message: "Kategori Not found." });
      } else {
        kategoriTematik
          .findAll({
            where: { provinceId: data.id },
            order: [["name", "ASC"]],
            attributes: [
              "kode",
              "name",
              "uuid",
              "has_geometry",
              "is_grass",
              "filename",
              "urlGeoserver",
            ],
            include: [
              {
                model: Provinsi,
                as: "province",
                attributes: ["id", "kode", "uuid", "name"],
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
        "kode",
        "name",
        "uuid",
        "has_geometry",
        "is_grass",
        "filename",
        "urlGeoserver",
      ],
      include: [
        {
          model: Provinsi,
          as: "province",
          attributes: ["id", "kode", "uuid", "name"],
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

exports.downloadFile = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await kategoriTematik.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.filename;
  const directoryPath = __basedir + "/app/resources/static/assets/region/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
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
        return res.status(404).send({ message: "Region Not found." });
      } else {
        const _update = {
          name: req.body.name,
          kode: req.body.kode,
          provinceId: req.body.province.id,
        };
        kategoriTematik
          .update(_update, {
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
