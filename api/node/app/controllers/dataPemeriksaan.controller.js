const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const uploadPemeriksaan = require("../middleware/uploadPemeriksaan");

const fs = require("fs");
const { constants } = require("buffer");

const User = db.user;
const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const Produsen = db.produsen;

const dataProdusen = db.dataProdusen;
const dataPemeriksaan = db.dataPemeriksaan;
const dataPublikasi = db.dataPublikasi;

const statusPemeriksaan = db.statusPemeriksaan;
const notifikasi = db.notifikasi;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    await uploadPemeriksaan(req, res);
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
      !objectValue.dataProdusen &&
      !objectValue.uuid
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

      let dPeriksa = await dataPemeriksaan.findOne({
        where: {
          uuid: objectValue.uuid,
        },
        include: [
          {
            model: dataProdusen,
            as: "dataProdusen", // alias relasi
            attributes: ["id", "deskripsi", "userId"] // field
          }
        ]
      });

      let notif = {
              uuid: uuidv4(),
              waktuKirim: new Date(),
              subjek: "Data " + dPeriksa.dataProdusen.deskripsi + " Sudah Lolos Pemeriksaan",
              pesan:
                "Data Anda sudah lolos pemeriksaan, silahkan tunggu publikasi data anda pada menu publikasi",
              sudahBaca: false,
              userId: dPeriksa.dataProdusen.userId,
            };

      notifikasi.create(notif);

      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        filename: req.files[0].filename,
        statusPemeriksaanId: 3,
        need_reupload: false,
      };

      dataPemeriksaan
        .update(update, {
          where: { uuid: objectValue.uuid },
        })
        .then(async (num) => {
          if (num == 1) {
            let dProdusen = await dataProdusen.findOne({
              where: {
                uuid: objectValue.dataProdusen.uuid,
              },
            });
            const publikasi = {
              uuid: uuidv4(),
              deskripsi: dProdusen.deskripsi,
              filename: dProdusen.filename,
              pdfname: dProdusen.pdfname,
              metadatafilename: dProdusen.metadatafilename,
              dataPemeriksaanId: dPeriksa.id,
              tematikId: dProdusen.tematikId,
            };

            dataPublikasi
              .create(publikasi)
              .then((pub) => {
                //res.send(pub);

                //pindahkan file2 ke folder publikasi
                const produsenPath =
                  __basedir + "/app/resources/static/assets/produsen/";
                const publikasiPath =
                  __basedir + "/app/resources/static/assets/publikasi/";

                fs.copyFile(
                  produsenPath + dProdusen.filename,
                  publikasiPath + dProdusen.filename,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );
                fs.copyFile(
                  produsenPath + dProdusen.pdfname,
                  publikasiPath + dProdusen.pdfname,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );
                fs.copyFile(
                  produsenPath + dProdusen.metadatafilename,
                  publikasiPath + dProdusen.metadatafilename,
                  function (err) {
                    if (err) throw err;
                    console.log("Successfully renamed - AKA moved filename!");
                  }
                );

                dataPemeriksaan
                  .findByPk(dPeriksa.id, {
                    include: [
                      {
                        model: User,
                        as: "user",
                        attributes: ["id", "username"],
                      },
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
                      {
                        model: statusPemeriksaan,
                        as: "statusPemeriksaan",
                        attributes: ["id", "name"],
                      },
                    ],
                    attributes: ["id", "uuid", "kategori", "createdAt"],
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
              message: `Cannot update Data Pemeriksaan with id=${objectValue.uuid}. Maybe Data Pemeriksaan was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message:
              "Error updating Data Pemeriksaan with id=" + objectValue.uuid,
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

      let dPeriksa = await dataPemeriksaan.findOne({
        where: {
          uuid: objectValue.uuid,
        },
        include: [
          {
            model: dataProdusen,
            as: "dataProdusen", // alias relasi
            attributes: ["id", "deskripsi", "userId"] // field
          }
        ]
      });

      let notif = {
              uuid: uuidv4(),
              waktuKirim: new Date(),
              subjek: "Data " + dPeriksa.dataProdusen.deskripsi + " Belum Lolos Pemeriksaan",
              pesan:
                "Data Anda belum lolos pemeriksaan, silahkan perbaiki data anda dan upload ulang pada menu pemeriksaan -> data perbaikan",
              sudahBaca: false,
              userId: dPeriksa.dataProdusen.userId,
            };

      notifikasi.create(notif);

      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        filename: req.files[0].filename,
        statusPemeriksaanId: 2,
        need_reupload: true,
      };

      dataPemeriksaan
        .update(update, {
          where: { uuid: objectValue.uuid },
        })
        .then((num) => {
          if (num == 1) {
            dataPemeriksaan
              .findByPk(dPeriksa.id, {
                include: [
                  { model: User, as: "user", attributes: ["id", "username"] },
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
                  {
                    model: statusPemeriksaan,
                    as: "statusPemeriksaan",
                    attributes: ["id", "name"],
                  },
                ],
                attributes: ["id", "uuid", "kategori", "createdAt"],
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
  dataPemeriksaan
    .findAll({
      order: [["id", "ASC"]],
      offset: 0,
      limit: 100,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataProdusen,
          as: "dataProdusen",
          attributes: ["id", "uuid", "deskripsi"],
          include: [
            { model: Tematik, as: "tematik", attributes: ["id", "name"] },
          ],
        },
        {
          model: statusPemeriksaan,
          as: "statusPemeriksaan",
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "uuid", "kategori", "createdAt"],
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

exports.findAllLokasi = (req, res) => {
  const uuid = req.params.uuid;
  Lokasi.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then((lokasi) => {
      if (!lokasi) {
        return res.status(404).send({ message: "Lokasi Not found." });
      }
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      console.log(firstDay); // Sun Jan 01 2023 ...
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      console.log(lastDay); // Sun Jan 01 2023 ...

      BukuTamu.findAll({
        where: {
          tanggal: {
            [Op.between]: [firstDay, lastDay],
          },
          lokasiId: lokasi.id,
        },
        order: [["id", "ASC"]],
        offset: 0,
        limit: 100,
        include: [
          { model: User, as: "user", attributes: ["uuid", "username"] },
          { model: Lokasi, as: "lokasi", attributes: ["uuid", "lokasiName"] },
          { model: User, as: "reporter", attributes: ["uuid", "username"] },
        ],
        attributes: [
          "uuid",
          "namaTamu",
          "tujuan",
          "keperluan",
          "tanggal",
          "waktuDatang",
          "waktuPulang",
          "createdAt",
        ],
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Buku Tamu.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
exports.delete = (req, res) => {
  const id = req.params.id;

  BukuTamu.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Buku Tamu was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Buku Tamu with id=${id}. Maybe Buku Tamu was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Buku Tamu with id=" + id,
      });
    });
};


exports.downloadFile = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const data = await dataPemeriksaan.findOne({
      where: {
        uuid: uuid,
      },
    });
    
    if (!data) {
      return res.status(404).send({
        message: "Data not found",
      });
    }
    
    const fileName = data.filename;
    const directoryPath = __basedir + "/app/resources/static/assets/pemeriksaan/";
    const filePath = directoryPath + fileName;
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({
        message: "File not found",
      });
    }

    res.download(filePath, fileName, (err) => {
      if (err && !res.headersSent) {
        return res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
      // Don't send any response here, as the download response is already sent
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).send({
        message: "Error processing download request: " + error.message,
      });
    }
  }
};

exports.findAllProdusen = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  try {
    const produsen = await Produsen.findOne({ where: { uuid } });
    if (!produsen) return res.send([]);

    const tematiks = await Tematik.findAll({ where: { produsenId: produsen.id } });
    const tematikIds = tematiks.map(t => t.id);

    const dataProdusens = await dataProdusen.findAll({
      where: { tematikId: { [Op.in]: tematikIds } },
      attributes: ["id"]
    });
    const dataProdusenIds = dataProdusens.map(dp => dp.id);

    const searchCondition = keyword ? {
      [Op.or]: [
        { kategori: { [Op.iLike]: `%${keyword}%` } },
        { '$dataProdusen.deskripsi$': { [Op.iLike]: `%${keyword}%` } },
        { '$dataProdusen.tematik.name$': { [Op.iLike]: `%${keyword}%` } }
      ]
    } : {};

    const { count, rows } = await dataPemeriksaan.findAndCountAll({
      where: {
        dataProdusenId: { [Op.in]: dataProdusenIds },
        ...searchCondition
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: dataProdusen,
          as: "dataProdusen",
          attributes: ["id", "uuid", "deskripsi"],
          include: [
            {
              model: Tematik,
              as: "tematik",
              attributes: ["id", "name"]
            }
          ]
        },
        {
          model: statusPemeriksaan,
          as: "statusPemeriksaan",
          attributes: ["id", "name"]
        }
      ],
      attributes: ["id", "uuid", "kategori", "createdAt"],
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["id", "DESC"]],
    });

    res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: parseInt(page)
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving data."
    });
  }
};

exports.findAllProdusenUser = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  try {
    const user = await User.findOne({ where: { uuid } });
    const produsens = await user.getProdusens();

    if (!produsens.length) return res.send([]);

    const produsen = produsens[0]; // ambil salah satu
    const tematiks = await Tematik.findAll({ where: { produsenId: produsen.id } });
    const tematikIds = tematiks.map(t => t.id);

    const dataProdusens = await dataProdusen.findAll({
      where: { tematikId: { [Op.in]: tematikIds } },
      attributes: ["id"]
    });
    const dataProdusenIds = dataProdusens.map(dp => dp.id);

    const searchCondition = keyword ? {
      [Op.or]: [
        { kategori: { [Op.iLike]: `%${keyword}%` } },
        { '$dataProdusen.deskripsi$': { [Op.iLike]: `%${keyword}%` } },
        { '$dataProdusen.tematik.name$': { [Op.iLike]: `%${keyword}%` } }
      ]
    } : {};

    const { count, rows } = await dataPemeriksaan.findAndCountAll({
      where: {
        dataProdusenId: { [Op.in]: dataProdusenIds },
        ...searchCondition
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: dataProdusen,
          as: "dataProdusen",
          attributes: ["id", "uuid", "deskripsi"],
          include: [
            {
              model: Tematik,
              as: "tematik",
              attributes: ["id", "name"]
            }
          ]
        },
        {
          model: statusPemeriksaan,
          as: "statusPemeriksaan",
          attributes: ["id", "name"]
        }
      ],
      attributes: ["id", "uuid", "kategori", "createdAt"],
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["id", "DESC"]],
    });

    res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: parseInt(page)
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving data."
    });
  }
};

