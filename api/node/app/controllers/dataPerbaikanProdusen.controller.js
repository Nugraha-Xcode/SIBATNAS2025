const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const uploadPerbaikanProdusen = require("../middleware/uploadPerbaikanProdusen");
const uploadMetadata = require("../middleware/uploadMetadata");

const fs = require("fs");

const User = db.user;
const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const Produsen = db.produsen;

const dataProdusen = db.dataProdusen;
const dataPerbaikanProdusen = db.dataPerbaikanProdusen;
const dataPublikasi = db.dataPublikasi;

const dataPemeriksaan = db.dataPemeriksaan;
const statusPemeriksaan = db.statusPemeriksaan;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    await uploadPerbaikanProdusen(req, res);
    //await uploadMetadata(req, res);
    //console.log(req.files);
    //return res.status(200).send({ message: "Debugging File!" });
    //console.log(req.body.data);
    //console.log(req.file.filename);
    //console.log(req.documentFile);
    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    //
    //console.log("%o", req.body.data);
    //console.log(JSON.stringify(req.body.data));
    //console.log(req.body.nip);
    console.log("test");
    console.log(req.body.data);
    var objectValue = JSON.parse(req.body.data);
    //console.log(Object.keys(objectValue));
    //console.log(Object.values(objectValue));

    //console.log(util.inspect(req.body.data, false, null));

    if (!objectValue.user && !objectValue.dataPemeriksaan) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    //console.log(req.body.kategori);
    // Create a Tutorial
    //console.log(objectValue.waktuDatang);
    let user = await User.findOne({
      where: {
        uuid: objectValue.user.uuid,
      },
    });

    let dPeriksa = await dataPemeriksaan.findOne({
      where: {
        uuid: objectValue.dataPemeriksaan.uuid,
      },
    });

    const data = {
      uuid: uuidv4(),
      pdfname: req.files[0].filename,
      metadatafilename: req.files[1].filename,
      filename: req.files[2].filename,
      userId: user.id,
      dataPemeriksaanId: dPeriksa.id,
      statusPemeriksaanId: 1,
    };
    // Save Tutorial in the database
    dataPerbaikanProdusen.create(data).then((data) => {
      console.log(data);
      dataPerbaikanProdusen
        .findByPk(data.id, {
          include: [
            { model: User, as: "user", attributes: ["id", "username"] },
            {
              model: dataPemeriksaan,
              as: "dataPemeriksaan",
              include: [
                {
                  model: dataProdusen,
                  as: "dataProdusen",
                  attributes: ["id", "uuid", "deskripsi"],
                },
              ],
              attributes: ["id", "uuid"],
            },
            {
              model: statusPemeriksaan,
              as: "statusPemeriksaan",
              attributes: ["id", "name"],
            },
          ],
          attributes: [
            "id",
            "uuid",
            "pdfname",
            "filename",
            "metadatafilename",
            "createdAt",
          ],
        })
        .then((pega) => {
          res.send(pega);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Data Produsen.",
          });
        });
    });
  } catch (err) {
    console.log(req.files);
    res.status(500).send({
      message: `Could not upload the file:  ${err}`,
    });
  }
};

exports.periksa = async (req, res) => {
  try {
    //console.log(objectValue);
    await uploadPerbaikanProdusen(req, res);
    //await uploadMetadata(req, res);
    //console.log(req.files);
    //return res.status(200).send({ message: "Debugging File!" });
    //console.log(req.body.data);
    //console.log(req.file.filename);
    //console.log(req.documentFile);
    if (req.files == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    //
    //console.log("%o", req.body.data);
    //console.log(JSON.stringify(req.body.data));
    //console.log(req.body.nip);
    console.log("test");
    console.log(req.body.data);
    var objectValue = JSON.parse(req.body.data);
    //console.log(Object.keys(objectValue));
    //console.log(Object.values(objectValue));

    //console.log(util.inspect(req.body.data, false, null));

    if (
      !objectValue.user &&
      !objectValue.kategori &&
      !objectValue.dataPerbaikanProdusen &&
      !objectValue.uuid // uuid dataPerbaikanProdusen
    ) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    console.log(objectValue.kategori.nilai);
    if (
      objectValue.kategori.nilai == "A" ||
      objectValue.kategori.nilai == "B"
    ) {
      let user = await User.findOne({
        where: {
          uuid: objectValue.user.uuid,
        },
      });

      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        pemeriksaanfilename: req.files[0].filename,
        statusPemeriksaanId: 3,
        need_reupload: false,
      };

      dataPerbaikanProdusen
        .update(update, {
          where: { uuid: objectValue.uuid },
        })
        .then(async (num) => {
          if (num == 1) {
            let dPerbaikanProdusen = await dataPerbaikanProdusen.findOne({
              where: {
                uuid: objectValue.uuid,
              },
              include: [
                {
                  model: dataPemeriksaan,
                  as: "dataPemeriksaan",
                  attributes: ["id", "uuid"],
                  include: [
                    {
                      model: dataProdusen,
                      as: "dataProdusen",
                      attributes: ["id", "uuid", "deskripsi"],
                      include: [
                        {
                          model: Tematik,
                          as: "tematik",
                          attributes: ["id", "name"],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: statusPemeriksaan,
                  as: "statusPemeriksaan",
                  attributes: ["id", "name"],
                },
              ],
              attributes: [
                "id",
                "uuid",
                "kategori",
                "createdAt",
                "pdfname",
                "filename",
                "metadatafilename",
                "dataPemeriksaanId",
              ],
            });
            const publikasi = {
              uuid: uuidv4(),
              deskripsi:
                dPerbaikanProdusen.dataPemeriksaan.dataProdusen.deskripsi,
              filename: dPerbaikanProdusen.filename,
              pdfname: dPerbaikanProdusen.pdfname,
              metadatafilename: dPerbaikanProdusen.metadatafilename,
              dataPemeriksaanId: dPerbaikanProdusen.dataPemeriksaanId,
              tematikId:
                dPerbaikanProdusen.dataPemeriksaan.dataProdusen.tematik.id,
            };

            dataPublikasi
              .create(publikasi)
              .then((pub) => {
                //res.send(pub);

                //pindahkan file2 ke folder publikasi
                const pemeriksaanPath =
                  __basedir + "/app/resources/static/assets/perbaikan/";
                const publikasiPath =
                  __basedir + "/app/resources/static/assets/publikasi/";

                fs.copyFile(
                  pemeriksaanPath + dPerbaikanProdusen.filename,
                  publikasiPath + dPerbaikanProdusen.filename,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );
                fs.copyFile(
                  pemeriksaanPath + dPerbaikanProdusen.pdfname,
                  publikasiPath + dPerbaikanProdusen.pdfname,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );
                fs.copyFile(
                  pemeriksaanPath + dPerbaikanProdusen.metadatafilename,
                  publikasiPath + dPerbaikanProdusen.metadatafilename,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );

                dataPerbaikanProdusen
                  .findByPk(dPerbaikanProdusen.id, {
                    include: [
                      {
                        model: User,
                        as: "user",
                        attributes: ["id", "username"],
                      },
                      {
                        model: dataPemeriksaan,
                        as: "dataPemeriksaan",
                        include: [
                          {
                            model: dataProdusen,
                            as: "dataProdusen",
                            attributes: ["id", "uuid", "deskripsi"],
                          },
                        ],
                        attributes: ["id", "uuid"],
                      },
                      {
                        model: statusPemeriksaan,
                        as: "statusPemeriksaan",
                        attributes: ["id", "name"],
                      },
                    ],
                    attributes: [
                      "id",
                      "uuid",
                      "pdfname",
                      "filename",
                      "metadatafilename",
                      "createdAt",
                    ],
                  })
                  .then((data) => {
                    res.send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while querying the Buku Tamu.",
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the Data Pemeriksaan.",
                });
              });
          } else {
            res.send({
              message: `Cannot update Buku Tamu with id=${uuid}. Maybe Buku Tamu was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: "Error updating Buku Tamu with id=" + uuid,
          });
        });
      //insert into data Publikasi
    } else {
      //update belum lolos
      let user = await User.findOne({
        where: {
          uuid: objectValue.user.uuid,
        },
      });

      let dPerbaikanProdusen = await dataPerbaikanProdusen.findOne({
        where: {
          uuid: objectValue.uuid,
        },
      });
      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        pemeriksaanfilename: req.files[0].filename,
        statusPemeriksaanId: 2,
        need_reupload: true,
      };

      dataPerbaikanProdusen
        .update(update, {
          where: { uuid: objectValue.uuid },
        })
        .then((num) => {
          if (num == 1) {
            dataPerbaikanProdusen
              .findByPk(dPerbaikanProdusen.id, {
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "username"],
                  },
                  {
                    model: dataPemeriksaan,
                    as: "dataPemeriksaan",
                    include: [
                      {
                        model: dataProdusen,
                        as: "dataProdusen",
                        attributes: ["id", "uuid", "deskripsi"],
                      },
                    ],
                    attributes: ["id", "uuid"],
                  },
                  {
                    model: statusPemeriksaan,
                    as: "statusPemeriksaan",
                    attributes: ["id", "name"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "pdfname",
                  "filename",
                  "metadatafilename",
                  "createdAt",
                ],
              })
              .then((data) => {
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while querying the Buku Tamu.",
                });
              });
          } else {
            res.send({
              message: `Cannot update Buku Tamu with id=${id}. Maybe Buku Tamu was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Buku Tamu with id=" + id,
          });
        });
    }
    //console.log(req.body.kategori);
    // Create a Tutorial
    //console.log(objectValue.waktuDatang);
    /*
    const data = {
      uuid: uuidv4(),
      deskripsi: objectValue.deskripsi,
      pdfname: req.files[0].filename,
      metadatafilename: req.files[1].filename,
      filename: req.files[2].filename,
      tematikId: objectValue.tematik.id,
      userId: objectValue.user.id,
    };
    // Save Tutorial in the database
    dataProdusen.create(data).then((data) => {
      console.log(data);
      const periksa = {
        uuid: uuidv4(),
        statusPemeriksaanId: 1,
        dataProdusenId: data.id,
      };
      dataPemeriksaan
        .create(periksa)
        .then((periksa) => {
          dataProdusen
            .findByPk(data.id, {
              include: [
                { model: User, as: "user", attributes: ["id", "username"] },
                { model: Tematik, as: "tematik", attributes: ["id", "name"] },
              ],
              attributes: ["id", "uuid", "deskripsi", "createdAt"],
            })
            .then((pega) => {
              res.send(pega);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Data Produsen.",
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Data Pemeriksaan.",
          });
        });
      //res.status(200).send({
      //  message: "Uploaded the file successfully: " + req.file.originalname,
      //});
    });
    */
  } catch (err) {
    console.log(req.files);
    res.status(500).send({
      message: `Could not upload the file:  ${err}`,
    });
  }
};

exports.findLokasiById = (id) => {
  return BukuTamu.findByPk(id, {
    include: [{ model: Kategori, as: "kategori", attributes: ["id", "name"] }],
    attributes: [
      "id",
      "lokasiName",
      "address",
      "radius",
      "latitude",
      "longitude",
      "createdAt",
    ],
  })
    .then((lokasi) => {
      return lokasi;
    })
    .catch((err) => {
      console.log(">> Error while finding lokasi: ", err);
    });
};

exports.viewPhotoByUUID = (req, res) => {
  //console.log(req);
  const { uuid } = req.params;
  console.log(uuid);
  return BukuTamu.findAll(
    { where: { uuid: uuid } },
    {
      attributes: ["uuid", "foto"],
    }
  )
    .then((data) => {
      const image = data[0];
      const imageBuffer = image.foto;
      const imageName = image.uuid;
      console.log(uuid);
      res.set("Content-Type", "image/jpeg");
      res.set("Content-Disposition", `inline; filename="${imageName}"`);
      res.send(imageBuffer);
    })
    .catch((err) => {
      console.log(">> Error while finding Working: ", err);
    });
};

exports.findAll = (req, res) => {
  dataPerbaikanProdusen
    .findAll({
      order: [["id", "ASC"]],
      offset: 0,
      limit: 100,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          include: [
            {
              model: dataProdusen,
              as: "dataProdusen",
              attributes: ["id", "uuid", "deskripsi"],
            },
          ],
          attributes: ["id", "uuid"],
        },
        {
          model: statusPemeriksaan,
          as: "statusPemeriksaan",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "pdfname",
        "filename",
        "metadatafilename",
        "createdAt",
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving lokasi.",
      });
    });
};

exports.findAllPemeriksaan = (req, res) => {
  const uuid = req.params.uuid;
  dataPemeriksaan
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
        dataPerbaikanProdusen
          .findAll({
            where: {
              dataPemeriksaanId: data.id,
            },
            order: [["id", "ASC"]],
            offset: 0,
            limit: 100,
            include: [
              { model: User, as: "user", attributes: ["id", "username"] },
              {
                model: dataPemeriksaan,
                as: "dataPemeriksaan",
                include: [
                  {
                    model: dataProdusen,
                    as: "dataProdusen",
                    attributes: ["id", "uuid", "deskripsi"],
                  },
                ],
                attributes: ["id", "uuid"],
              },
              {
                model: statusPemeriksaan,
                as: "statusPemeriksaan",
                attributes: ["id", "name"],
              },
            ],
            attributes: [
              "id",
              "uuid",
              "pdfname",
              "filename",
              "metadatafilename",
              "createdAt",
            ],
          })
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving lokasi.",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};

exports.findAllProdusenUser = async (req, res) => {
  const uuid = req.params.uuid;
  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (us) => {
      user_bpkh = await us.getProdusens();
      console.log(user_bpkh);

      Produsen.findByPk(user_bpkh[0].id)
        .then(async (data) => {
          if (!data) {
            return res.send([]);
            //return res.status(404).send({ message: "Produsen Not found." });
          } else {
            Tematik.findAll({
              where: {
                produsenId: data.id,
              },
            })
              .then((tema) => {
                console.log(tema);
                let tematiks = [];
                for (let i = 0; i < tema.length; i++) {
                  tematiks.push(tema[i].id);
                }
                dataProdusen
                  .findAll({
                    where: {
                      tematikId: {
                        [Op.or]: tematiks,
                      },
                    },
                    include: [
                      {
                        model: User,
                        as: "user",
                        attributes: ["id", "username"],
                      },
                      {
                        model: Tematik,
                        as: "tematik",
                        include: [
                          {
                            model: Produsen,
                            as: "produsen",
                            attributes: ["id", "name"],
                          },
                        ],
                        attributes: ["id", "name"],
                      },
                    ],
                    attributes: [
                      "id",
                      "uuid",
                      "deskripsi",
                      "pdfname",
                      "filename",
                      "metadatafilename",
                      "createdAt",
                    ],
                  })
                  .then((daProd) => {
                    res.send(daProd);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while retrieving Data Produsen.",
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while retrieving Tematik.",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving lokasi.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving User with uuid=" + uuid,
      });
    });
};

exports.findAllProdusen = (req, res) => {
  const uuid = req.params.uuid;
  Produsen.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (data) => {
      if (!data) {
        return res.send([]);
        //return res.status(404).send({ message: "Produsen Not found." });
      } else {
        Tematik.findAll({
          where: {
            produsenId: data.id,
          },
        })
          .then((tema) => {
            console.log(tema);
            let tematiks = [];
            for (let i = 0; i < tema.length; i++) {
              tematiks.push(tema[i].id);
            }
            dataProdusen
              .findAll({
                where: {
                  tematikId: {
                    [Op.or]: tematiks,
                  },
                },
                include: [
                  { model: User, as: "user", attributes: ["id", "username"] },
                  {
                    model: Tematik,
                    as: "tematik",
                    include: [
                      {
                        model: Produsen,
                        as: "produsen",
                        attributes: ["id", "name"],
                      },
                    ],
                    attributes: ["id", "name"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "deskripsi",
                  "pdfname",
                  "filename",
                  "metadatafilename",
                  "createdAt",
                ],
              })
              .then((daProd) => {
                res.send(daProd);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while retrieving Data Produsen.",
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
        message: err.message || "Some error occurred while retrieving lokasi.",
      });
    });
};

exports.findAllLokasi = (req, res) => {
  const uuid = req.params.uuid;
  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      let produsen = await user.getProdusens();
      console.log(produsen.length);

      Tematik.findAll({
        where: {
          produsenId: produsen[0].id,
        },
        order: [["id", "ASC"]],
        attributes: ["id"],
      })
        .then((data) => {
          //console.log(data);
          //res.send(data);
          let tematiks = [];
          for (let i = 0; i < data.length; i++) {
            tematiks.push(data[i].id);
          }

          dataProdusen
            .findAll({
              where: {
                tematikId: {
                  [Op.or]: tematiks,
                },
              },
              order: [["id", "ASC"]],
              offset: 0,
              limit: 100,
              include: [
                { model: User, as: "user", attributes: ["id", "username"] },
                {
                  model: Tematik,
                  as: "tematik",
                  include: [
                    {
                      model: Produsen,
                      as: "produsen",
                      attributes: ["id", "name"],
                    },
                  ],
                  attributes: ["id", "name"],
                },
              ],
              attributes: [
                "id",
                "uuid",
                "deskripsi",
                "pdfname",
                "filename",
                "metadatafilename",
                "createdAt",
              ],
            })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving Buku Tamu.",
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Tematik.",
          });
        });

      //user.getRoles().then(async (roles) => {
      //  for (let i = 0; i < roles.length; i++) {
      //    authorities.push("ROLE_" + roles[i].name.toUpperCase());
      //  }

      /*
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
      */
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.downloadReferensi = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataPerbaikanProdusen.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.pdfname;
  const directoryPath = __basedir + "/app/resources/static/assets/perbaikan/";

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
  const id = req.params.id;
  console.log(req.body);
  const lokasi = {
    lokasiName: req.body.lokasiName,
    address: req.body.address,
    radius: req.body.radius,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    kategoriId: req.body.kategori.id,
  };
  BukuTamu.update(lokasi, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        Lokasi.findByPk(id, {
          include: [
            { model: Kategori, as: "kategori", attributes: ["id", "name"] },
          ],
          attributes: [
            "id",
            "lokasiName",
            "address",
            "radius",
            "latitude",
            "longitude",
            "createdAt",
          ],
        })
          .then((lokasi) => {
            res.send(lokasi);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while querying the Lokasi.",
            });
          });
        //res.send({
        //  message: "Lokasi was updated successfully.",
        //});
      } else {
        res.send({
          message: `Cannot update Lokasi with id=${id}. Maybe Lokasi was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Lokasi with id=" + id,
      });
    });
};

// Delete a Kategori with the specified id in the request
exports.delete = async (req, res) => {
  const uuid = req.params.uuid;
  var daProd = await dataProdusen.findOne({
    where: { uuid: uuid },
  });

  dataPemeriksaan
    .destroy({
      where: { id: daProd.id },
    })
    .then((num) => {
      if (num == 1) {
        dataProdusen
          .destroy({
            where: { uuid: uuid },
          })
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "Data Produsen was deleted successfully!",
              });
            } else {
              res.send({
                message: `Cannot delete Data Produsen with id=${uuid}. Maybe Data Produsen was not found!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Could not delete Data Produsen with id=" + uuid,
            });
          });
      } else {
        res.send({
          message: `Cannot delete Data Produsen with id=${uuid}. Maybe Data Produsen was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Data Pemeriksaan with uuid=" + uuid,
      });
    });
};

exports.downloadMetadata = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataPerbaikanProdusen.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.metadatafilename;
  const directoryPath = __basedir + "/app/resources/static/assets/perbaikan/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.downloadFile = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataPerbaikanProdusen.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.filename;
  const directoryPath = __basedir + "/app/resources/static/assets/perbaikan/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.downloadQA = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataPerbaikanProdusen.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.pemeriksaanfilename;
  const directoryPath = __basedir + "/app/resources/static/assets/perbaikan/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
