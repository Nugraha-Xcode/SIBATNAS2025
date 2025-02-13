const db = require("../models");
const tematik = db.tematik;
const produsen = db.produsen;
const user = db.user;

const kategoriTematik = db.kategoriTematik;

const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  //var objectValue = JSON.parse(req.body.provinsi);
  //console.log(objectValue);
  //console.log(req.body);

  if (!req.body.name && !req.body.produsen && !req.body.is_series) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  //console.log(req.body.province);
  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
    is_series: req.body.is_series,
    produsenId: req.body.produsen.id,
  };

  // Save Tutorial in the database
  tematik
    .create(input)
    .then((data) => {
      tematik
        .findByPk(data.id, {
          attributes: ["name", "uuid", "is_series", "createdAt"],
          include: [
            {
              model: produsen,
              as: "produsen",
              attributes: ["id", "uuid", "name"],
              include: [
                {
                  model: kategoriTematik,
                  as: "kategoriTematik",
                  attributes: ["id", "uuid", "name"],
                },
              ],
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
        return res.send([]);
        //return res.status(404).send({ message: "Produsen Not found." });
      } else {
        tematik
          .findAll({
            where: {
              produsenId: data.id,
            },
            order: [["name", "ASC"]],
            attributes: ["name", "uuid", "is_series", "createdAt"],
            include: [
              {
                model: produsen,
                as: "produsen",
                attributes: ["id", "uuid", "name"],
                include: [
                  {
                    model: kategoriTematik,
                    as: "kategoriTematik",
                    attributes: ["id", "uuid", "name"],
                  },
                ],
              },
            ],
          })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Tematik.",
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

exports.findByUserUuid = (req, res) => {
  const uuid = req.params.uuid;
  user
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "User Not found." });
      } else {
        let prod = await data.getProdusens();
        console.log(data);
        console.log(prod);

        tematik
          .findAll({
            where: {
              produsenId: prod[0].id,
            },
            order: [["name", "ASC"]],
            attributes: ["name", "uuid", "is_series", "createdAt"],
            include: [
              {
                model: produsen,
                as: "produsen",
                attributes: ["id", "uuid", "name"],
                include: [
                  {
                    model: kategoriTematik,
                    as: "kategoriTematik",
                    attributes: ["id", "uuid", "name"],
                  },
                ],
              },
            ],
          })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Tematik.",
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

exports.findByKategoriUuid = (req, res) => {
  const uuid = req.params.uuid;
  kategoriTematik
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Kategori Tematik Not found." });
      } else {
        produsen
          .findAll({
            where: {
              kategoriTematikId: data.id,
            },
            order: [["id", "ASC"]],
            attributes: ["id"],
          })
          .then((prod) => {
            //console.log(data);
            //res.send(data);
            let produsens = [];
            for (let i = 0; i < prod.length; i++) {
              produsens.push(prod[i].id);
            }

            tematik
              .findAll({
                where: {
                  produsenId: {
                    [Op.or]: produsens,
                  },
                },
                order: [["name", "ASC"]],
                attributes: ["name", "uuid", "is_series", "createdAt"],
                include: [
                  {
                    model: produsen,
                    as: "produsen",
                    attributes: ["id", "uuid", "name"],
                    include: [
                      {
                        model: kategoriTematik,
                        as: "kategoriTematik",
                        attributes: ["id", "uuid", "name"],
                      },
                    ],
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
                    "Some error occurred while retrieving Tematik.",
                });
              });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Tematik.",
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
  tematik
    .findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name", "uuid", "is_series", "createdAt"],
      include: [
        {
          model: produsen,
          as: "produsen",
          attributes: ["id", "uuid", "name"],
          include: [
            {
              model: kategoriTematik,
              as: "kategoriTematik",
              attributes: ["id", "uuid", "name"],
            },
          ],
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Tematik.",
      });
    });
};

// Update a Kategori by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  tematik
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Tematik Not found." });
      } else {
        let prod = await produsen.findOne({
          where: {
            uuid: req.body.produsen.uuid,
          },
        });

        if (!prod) {
          return res.status(404).send({ message: "Produsen Not found." });
        } else {
          const edit = {
            name: req.body.name,
            produsenId: prod.id,
            is_series: req.body.is_series,
          };

          //console.log(edit);
          tematik
            .update(edit, {
              where: { id: data.id },
            })
            .then((num) => {
              if (num == 1) {
                tematik
                  .findByPk(data.id, {
                    attributes: ["name", "uuid", "is_series", "createdAt"],
                    include: [
                      {
                        model: produsen,
                        as: "produsen",
                        attributes: ["id", "uuid", "name"],
                        include: [
                          {
                            model: kategoriTematik,
                            as: "kategoriTematik",
                            attributes: ["id", "uuid", "name"],
                          },
                        ],
                      },
                    ],
                  })
                  .then((update) => {
                    res.send(update);
                  });

                //res.send({
                //  message: "Katagori was updated successfully.",
                //});
              } else {
                res.send({
                  message: `Cannot update Tematik with id=${uuid}. Maybe Tematik was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating Tematik with id=" + uuid,
              });
            });
        }
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

  tematik
    .destroy({
      where: { uuid: uuid },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tematik was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tematik with uuid=${id}. Maybe Tematik was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tematik with id=" + id,
      });
    });
};
