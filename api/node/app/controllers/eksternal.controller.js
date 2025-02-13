const db = require("../models");
const kategoriTematik = db.eksternal;
const kategoriEksternal = db.kategoriEksternal;
const mekanismeEksternal = db.mekanismeEksternal;

const Op = db.Sequelize.Op;

const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (
    !req.body.name &&
    !req.body.akronim &&
    !req.body.kategoriEksternal &&
    !req.body.mekanismeEksternal
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  let kat = await kategoriEksternal.findOne({
    where: {
      uuid: req.body.kategoriEksternal.uuid,
    },
  });

  let mek = await mekanismeEksternal.findOne({
    where: {
      uuid: req.body.mekanismeEksternal.uuid,
    },
  });

  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
    akronim: req.body.akronim,
    kategoriEksternalId: kat.id,
    mekanismeEksternalId: mek.id,
  };

  // Save Tutorial in the database
  kategoriTematik
    .create(input)
    .then((data) => {
      //res.send(data);
      kategoriTematik
        .findByPk(data.id, {
          attributes: ["name", "uuid", "akronim", "createdAt"],
          include: [
            {
              model: db.kategoriEksternal,
              as: "kategoriEksternal",
              attributes: ["uuid", "name"],
            },
            {
              model: db.mekanismeEksternal,
              as: "mekanismeEksternal",
              attributes: ["uuid", "name"],
            },
          ],
        })
        .then((pega) => {
          res.send(pega);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Eksternal.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
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
      attributes: ["name", "uuid", "akronim", "createdAt"],
      include: [
        {
          model: db.kategoriEksternal,
          as: "kategoriEksternal",
          attributes: ["uuid", "name"],
          include: [
            {
              model: db.cakupanWilayah,
              as: "cakupanWilayah",
              attributes: ["uuid", "name"],
            },
          ],
        },
        {
          model: db.mekanismeEksternal,
          as: "mekanismeEksternal",
          attributes: ["uuid", "name"],
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

exports.findAllBPKHTL = async (req, res) => {
  const uuid = req.params.uuid;

  let user = await db.user.findOne({
    where: {
      uuid: uuid,
    },
  });
  if (!user) {
    return res.send([]);
    //return res.status(404).send({ message: "User Not found." });
  }
  console.log(user);
  user_bpkh = await user.getBpkhtls();
  //console.log(user_bpkh);
  //bpkhtl
  //  .findByPk(user_bpkh[0].id)
  //  .then(async (data) => {
  //    if (!data) {
  //      res.send([]);
  //return res.status(404).send({ message: "Kategori Not found." });
  //    } else {
  let bpkhtl = await db.bpkhtl.findByPk(user_bpkh[0].id);
  //console.log(bpkhtl);
  if (!bpkhtl) {
    return res.send([]);
    //return res.status(404).send({ message: "User Not found." });
  }

  let bpkhtl_province = await bpkhtl.getProvinces();
  console.log(bpkhtl_province.length);
  if (bpkhtl_province.length == 0) {
    res.send([]);
  } else {
    let provinces = [];
    for (let i = 0; i < bpkhtl_province.length; i++) {
      //console.log(eks_tema[i]);
      provinces.push(bpkhtl_province[i].id);
    }
    console.log(provinces);

    ekstern = await kategoriTematik.findAll();

    let provinsis = [];
    for (let i = 0; i < ekstern.length; i++) {
      //console.log(eks_tema[i]);

      //kategori kabupaten
      if (ekstern[i].kategoriEksternalId < 3) {
        let eksternal_province = await ekstern[i].getProvinces();
        //console.log(eksternal_province);
        for (let j = 0; j < eksternal_province.length; j++) {
          provinsis.push({
            prov_id: eksternal_province[j].id,
            ekst_id: ekstern[i].id,
          });
        }
      } else {
        let eksternal_region = await ekstern[i].getRegions();
        //console.log(eksternal_region);
        for (let l = 0; l < eksternal_region.length; l++) {
          //console.log(eksternal_region[l]);
          //let pro = eksternal_region[l].getProvinces();

          provinsis.push({
            prov_id: eksternal_region[l].provinceId,
            ekst_id: ekstern[i].id,
          });
        }
        //
      }
    }
    console.log(provinsis);
    let clean = [];

    for (k = 0; k < provinces.length; k++) {
      var filtered = provinsis.filter((p) => p.prov_id === provinces[k]);
      console.log(filtered);
      for (m = 0; m < filtered.length; m++) {
        clean.push(filtered[m].ekst_id);
      }
      //if (filtered)
    }
    console.log(clean);
    if (clean.length == 0) {
      res.send([]);
    }

    kategoriTematik
      .findAll({
        //where id eksternal op.or
        where: {
          id: {
            [Op.or]: clean,
          },
        },
        order: [["name", "ASC"]],
        attributes: ["name", "uuid", "akronim", "createdAt"],
        include: [
          {
            model: db.kategoriEksternal,
            as: "kategoriEksternal",
            attributes: ["uuid", "name"],
            include: [
              {
                model: db.cakupanWilayah,
                as: "cakupanWilayah",
                attributes: ["uuid", "name"],
              },
            ],
          },
          {
            model: db.mekanismeEksternal,
            as: "mekanismeEksternal",
            attributes: ["uuid", "name"],
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
        let mek = await mekanismeEksternal.findOne({
          where: {
            uuid: req.body.mekanismeEksternal.uuid,
          },
        });

        if (!mek) {
          return res.status(404).send({ message: "Mekanisme Not found." });
        } else {
          let kat = await kategoriEksternal.findOne({
            where: {
              uuid: req.body.kategoriEksternal.uuid,
            },
          });
          const edit = {
            name: req.body.name,
            akronim: req.body.akronim,
            mekanismeEksternalId: mek.id,
            kategoriEksternalId: kat.id,
          };
          kategoriTematik
            .update(edit, {
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
                  message: `Cannot update Kategori with id=${uuid}. Maybe Kategori was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating Kategori with id=" + uuid,
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
          message: `Cannot delete Kategori with uuid=${uuid}. Maybe Kategori was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Kategori with id=" + uuid,
      });
    });
};
