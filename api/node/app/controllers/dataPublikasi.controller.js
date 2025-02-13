const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const {
  importShapefileToPostGIS,
  getTableName,
} = require("../utils/shapefile_to_postgis");
const {
  publishTableAsLayer,
  getUrlGeoserver,
} = require("../utils/postgis_to_geoserver");
const User = db.user;
const Eksternal = db.eksternal;
const Internal = db.internal;

const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const Produsen = db.produsen;

const dataProdusen = db.dataProdusen;
const dataPemeriksaan = db.dataPemeriksaan;
const dataPublikasi = db.dataPublikasi;

const statusPemeriksaan = db.statusPemeriksaan;
const aktifitasUnduh = db.aktifitasUnduh;
const notifikasi = db.notifikasi;

const region = db.region;
const province = db.province;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    //await uploadPemeriksaan(req, res);
    //await uploadMetadata(req, res);
    //console.log(req.files);
    //return res.status(200).send({ message: "Debugging File!" });
    //console.log(req.body.data);
    //console.log(req.file.filename);
    //console.log(req.documentFile);
    //if (req.files == undefined) {
    //  return res.status(400).send({ message: "Please upload a file!" });
    // }
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
      });
      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        filename: req.files[0].filename,
        statusPemeriksaanId: 3,
      };

      dataPemeriksaan
        .update(update, {
          where: { uuid: objectValue.uuid },
        })
        .then((num) => {
          if (num == 1) {
            const publikasi = {
              uuid: uuidv4(),
              deskripsi: objectValue.dataProdusen.deskripsi,
              dataPemeriksaanId: dPeriksa.id,
            };

            dataPublikasi
              .create(publikasi)
              .then((pub) => {
                res.send(pub);
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
              message: `Cannot update Buku Tamu with id=${id}. Maybe Buku Tamu was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating Buku Tamu with id=" + id,
          });
        });
      //insert into data Publikasi
    } else {
      //update status data pemeriksaan == 2, userId, kategori, filename
      let user = await User.findOne({
        where: {
          uuid: objectValue.user.uuid,
        },
      });

      let dPeriksa = await dataPemeriksaan.findOne({
        where: {
          uuid: objectValue.uuid,
        },
      });
      //update status data pemeriksaan == 3, userId, kategori, filename
      const update = {
        kategori: objectValue.kategori.nilai,
        userId: user.id,
        filename: req.files[0].filename,
        statusPemeriksaanId: 2,
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
                    attributes: ["id", "deskripsi"],
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

exports.createDatang = async (req, res) => {
  try {
    await uploadBukuTamu(req, res);
    //console.log(req.body);
    //console.log(req.body.data);
    console.log(req.file.filename);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    //console.log(req.body.data);
    //console.log("%o", req.body.data);
    //console.log(JSON.stringify(req.body.data));
    //console.log(req.body.nip);
    var objectValue = JSON.parse(req.body.data);
    //console.log(Object.keys(objectValue));
    //console.log(Object.values(objectValue));

    //console.log(util.inspect(req.body.data, false, null));

    if (
      !objectValue.namaTamu &&
      !objectValue.tujuan &&
      !objectValue.keperluan &&
      !objectValue.user &&
      !objectValue.lokasi
    ) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    let user = await User.findOne({
      where: {
        uuid: objectValue.user.uuid,
      },
    });

    let lokasi = await Lokasi.findOne({
      where: {
        uuid: objectValue.lokasi.uuid,
      },
    });

    //console.log(req.body.kategori);
    // Create a Tutorial

    const data = {
      uuid: uuidv4(),
      namaTamu: objectValue.namaTamu,
      tujuan: objectValue.tujuan,
      keperluan: objectValue.keperluan,
      tanggal: new Date(),
      waktuDatang: new Date(),
      //waktuPulang: objectValue.waktuPulang,
      userId: user.id,
      lokasiId: lokasi.id,
      foto: fs.readFileSync(req.file.path),
    };
    // Save Tutorial in the database
    BukuTamu.create(data).then((data) => {
      console.log(data);
      BukuTamu.findByPk(data.id, {
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
        .then((pega) => {
          res.send(pega);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the BukuTamu.",
          });
        });

      //res.status(200).send({
      //  message: "Uploaded the file successfully: " + req.file.originalname,
      //});
    });
  } catch (err) {
    console.log(req.file);
    res.status(500).send({
      message: `Could not upload the file:  ${err}`,
    });
  }
};

exports.publish = async (req, res) => {
  const uuid = req.params.uuid;
  console.log(req.body);
  //var objectValue = JSON.parse(req.body.data);
  //console.log(Object.keys(objectValue));
  //console.log(Object.values(objectValue));

  //console.log(util.inspect(req.body.data, false, null));

  if (!req.body.uuid) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  dataPublikasi
    .findOne({
      where: {
        uuid: uuid,
      },

      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name", "is_series"],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "is_published",
        "is_active",
        "urlGeoserver",
        "waktuPublish",
        "filename",
        "createdAt",
      ],
    })
    .then(async (publikasi) => {
      if (!publikasi) {
        return res.status(404).send({ message: "Publikasi Not found." });
      }

      //const url = config.api_grass + "/konversi/publikasi/" + publikasi.uuid; // Replace with your API endpoint URL
      //console.log(url);
      //const response = await axios.get(url);
      //console.log(response.data);
      // Send the image data as the response

      //if non  series
      if (!publikasi.tematik.is_series) {
        const upd = {
          is_active: false,
        };
        await dataPublikasi.update(upd, {
          where: { tematikId: publikasi.tematik.id },
        });

        let us = await User.findOne({
          where: {
            uuid: req.body.uuid,
          },
        });
        //axios? trigger publish to grass
        //get geoserver?

        //return res.status(404).send({ message: "Please Check GRASS.." });
        //proses postgis
        const shapefileZipPath =
          __basedir +
          "/app/resources/static/assets/publikasi/" +
          publikasi.filename;
        await importShapefileToPostGIS(shapefileZipPath);
        let tableName = await getTableName(shapefileZipPath);
        await publishTableAsLayer(
          tableName,
          publikasi.tematik.name,
          publikasi.deskripsi
        );

        let urlGeoserver = await getUrlGeoserver(tableName);
        console.log(urlGeoserver);
        const update = {
          userId: us.id,
          is_published: true,
          is_active: true,
          waktuPublish: new Date(),
          urlGeoserver: urlGeoserver,
        };
        dataPublikasi
          .update(update, {
            where: { id: publikasi.id },
          })
          .then(async (num) => {
            if (num == 1) {
              let users = await User.findAll({ attributes: ["id"] });
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
              dataPublikasi
                .findByPk(publikasi.id, {
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["id", "username"],
                    },
                    {
                      model: dataPemeriksaan,
                      as: "dataPemeriksaan",
                      attributes: ["id", "kategori"],
                    },
                    {
                      model: Tematik,
                      as: "tematik",
                      attributes: ["id", "name", "is_series"],
                    },
                  ],
                  attributes: [
                    "id",
                    "uuid",
                    "deskripsi",
                    "is_published",
                    "is_active",
                    "urlGeoserver",
                    "waktuPublish",
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
                      "Some error occurred while querying the Data Publikasi.",
                  });
                });
            } else {
              res.send({
                message: `Cannot update Data Publikasi with id=${uuid}. Maybe Data Publikasi was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message: "Error updating Data Publikasi with uuid=" + uuid,
            });
          });
      } else {
        //else non series
        let us = await User.findOne({
          where: {
            uuid: req.body.uuid,
          },
        });
        //axios? trigger publish to grass
        //get geoserver?

        //return res.status(404).send({ message: "Please Check GRASS.." });
        const shapefileZipPath =
          __basedir +
          "/app/resources/static/assets/publikasi/" +
          publikasi.filename;
        await importShapefileToPostGIS(shapefileZipPath);
        await importShapefileToPostGIS(shapefileZipPath);
        let tableName = await getTableName(shapefileZipPath);
        //console.log(tableName);
        await publishTableAsLayer(
          tableName,
          publikasi.tematik.name,
          publikasi.deskripsi
        );
        let urlGeoserver = await getUrlGeoserver(tableName);
        console.log(urlGeoserver);
        const update = {
          userId: us.id,
          is_published: true,
          is_active: true,
          waktuPublish: new Date(),
          urlGeoserver: urlGeoserver,
        };
        dataPublikasi
          .update(update, {
            where: { id: publikasi.id },
          })
          .then(async (num) => {
            if (num == 1) {
              let users = await User.findAll({ attributes: ["id"] });
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
              dataPublikasi
                .findByPk(publikasi.id, {
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["id", "username"],
                    },
                    {
                      model: dataPemeriksaan,
                      as: "dataPemeriksaan",
                      attributes: ["id", "kategori"],
                    },
                    {
                      model: Tematik,
                      as: "tematik",
                      attributes: ["id", "name", "is_series"],
                    },
                  ],
                  attributes: [
                    "id",
                    "uuid",
                    "deskripsi",
                    "is_published",
                    "is_active",
                    "urlGeoserver",
                    "waktuPublish",
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
                      "Some error occurred while querying the Data Publikasi.",
                  });
                });
            } else {
              res.send({
                message: `Cannot update Data Publikasi with id=${uuid}. Maybe Data Publikasi was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message: "Error updating Data Publikasi with uuid=" + uuid,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deactivate = async (req, res) => {
  const uuid = req.params.uuid;
  console.log(req.body);
  //var objectValue = JSON.parse(req.body.data);
  //console.log(Object.keys(objectValue));
  //console.log(Object.values(objectValue));

  //console.log(util.inspect(req.body.data, false, null));

  if (!req.body.uuid) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  dataPublikasi
    .findOne({
      where: {
        uuid: uuid,
      },
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name", "is_series"],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "is_published",
        "is_active",
        "urlGeoserver",
        "waktuPublish",
        "createdAt",
      ],
    })
    .then(async (publikasi) => {
      if (!publikasi) {
        return res.status(404).send({ message: "Publikasi Not found." });
      }

      let us = await User.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });
      //axios? trigger publish to grass
      //get geoserver?

      //return res.status(404).send({ message: "Please Check GRASS.." });

      const update = {
        userId: us.id,
        is_active: false,
      };
      dataPublikasi
        .update(update, {
          where: { id: publikasi.id },
        })
        .then(async (num) => {
          if (num == 1) {
            dataPublikasi
              .findByPk(publikasi.id, {
                include: [
                  { model: User, as: "user", attributes: ["id", "username"] },
                  {
                    model: dataPemeriksaan,
                    as: "dataPemeriksaan",
                    attributes: ["id", "kategori"],
                  },
                  {
                    model: Tematik,
                    as: "tematik",
                    attributes: ["id", "name", "is_series"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "deskripsi",
                  "is_published",
                  "is_active",
                  "urlGeoserver",
                  "waktuPublish",
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
                    "Some error occurred while querying the Data Publikasi.",
                });
              });
          } else {
            res.send({
              message: `Cannot update Data Publikasi with id=${uuid}. Maybe Data Publikasi was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: "Error updating Data Publikasi with uuid=" + uuid,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.unduhRegion = async (req, res) => {
  const uuid = req.params.uuid;
  const kode = req.params.kode;
  const user_uuid = req.params.user_uuid;
  console.log(uuid);
  console.log(kode);
  try {
    let us = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });

    let cek = await aktifitasUnduh.findOne({
      where: { userId: us.id },
      order: [["id", "DESC"]],
    });

    //console.log(cek.createdAt);
    if (cek) {
      let t = new Date(cek.createdAt);
      let n = new Date();

      if (n.getTime() - t.getTime() < 300000) {
        return res.status(400).send({
          message:
            "Tunggu " +
            (300 - Math.ceil((n.getTime() - t.getTime()) / 1000)) +
            " detik untuk mengunduh kembali",
        });
      }
    }
    let dPublikasi = await dataPublikasi.findOne({
      where: {
        uuid: uuid,
      },
    });

    let regi = await region.findOne({
      where: {
        kode: kode,
      },
    });
    const aktivitas = {
      uuid: uuidv4(),
      wilayah: kode,
      wilayahName: regi.name,
      waktuMulai: new Date(),
      status: "processing",
      dataPublikasiId: dPublikasi.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*
        const url =
          config.api_grass +
          "/unduh/produsen/kabkot/" +
          uuid +
          "/" +
          kode +
          "/" +
          user_uuid; // Replace with your API endpoint URL
          */
        const url = config.api_grass + "/unduh/publikasi/" + pub.uuid;
        console.log(url);
        const response = await axios.get(url);
        console.log(response.data);

        if (response.data.status == "success") {
          res.status(200).send({
            message: "Successfully processing the request",
          });
        } else {
          res.status(500).send({
            message: "Something wrong happened",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the Data Pemeriksaan.",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: `Could not process the request:  ${err}`,
    });
  }
};

exports.unduh = async (req, res) => {
  const uuid = req.params.uuid;
  const user_uuid = req.params.user_uuid;
  let us = await User.findOne({
    where: {
      uuid: user_uuid,
    },
  });
  let data = await dataPublikasi.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.filename;
  const directoryPath = __basedir + "/app/resources/static/assets/publikasi/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    } else {
      const aktivitas = {
        uuid: uuidv4(),
        wilayah: "-",
        wilayahName: "-",
        waktuMulai: new Date(),
        status: "done",
        dataPublikasiId: data.id,
        userId: us.id,
      };

      aktifitasUnduh
        .create(aktivitas)
        .then((pub) => {
          res.status(200).send({
            message: "Successfully processing the request",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Data Aktivitas.",
          });
        });
    }
  });
};

exports.unduhIndonesia = async (req, res) => {
  const uuid = req.params.uuid;
  const user_uuid = req.params.user_uuid;

  console.log(uuid);
  try {
    let us = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });

    let cek = await aktifitasUnduh.findOne({
      where: { userId: us.id },
      order: [["id", "DESC"]],
    });
    if (cek) {
      //console.log(cek.createdAt);
      let t = new Date(cek.createdAt);
      let n = new Date();

      if (n.getTime() - t.getTime() < 300000) {
        return res.status(400).send({
          message:
            "Tunggu " +
            (300 - Math.ceil((n.getTime() - t.getTime()) / 1000)) +
            " detik untuk mengunduh kembali",
        });
      }
    }

    let dPublikasi = await dataPublikasi.findOne({
      where: {
        uuid: uuid,
      },
    });
    const aktivitas = {
      uuid: uuidv4(),
      wilayah: "indonesia",
      wilayahName: "Indonesia",
      waktuMulai: new Date(),
      status: "processing",
      dataPublikasiId: dPublikasi.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*
        const url =
          config.api_grass +
          "/unduh/produsen/indonesia/" +
          uuid +
          "/" +
          user_uuid; // Replace with your API endpoint URL
        */
        const url = config.api_grass + "/unduh/publikasi/" + pub.uuid;
        console.log(url);
        const response = await axios.get(url);
        console.log(response.data);

        if (response.data.status == "success") {
          res.status(200).send({
            message: "Successfully processing the request",
          });
        } else {
          res.status(500).send({
            message: "Something wrong happened",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the Data Pemeriksaan.",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: `Could not process the request:  ${err}`,
    });
  }
};

exports.unduhProvinsi = async (req, res) => {
  const uuid = req.params.uuid;
  const kode = req.params.kode;
  const user_uuid = req.params.user_uuid;

  console.log(uuid);
  console.log(kode);
  try {
    let us = await User.findOne({
      where: {
        uuid: user_uuid,
      },
    });

    let cek = await aktifitasUnduh.findOne({
      where: { userId: us.id },
      order: [["id", "DESC"]],
    });

    //console.log(cek.createdAt);
    if (cek) {
      let t = new Date(cek.createdAt);
      let n = new Date();

      if (n.getTime() - t.getTime() < 300000) {
        return res.status(400).send({
          message:
            "Tunggu " +
            (300 - Math.ceil((n.getTime() - t.getTime()) / 1000)) +
            " detik untuk mengunduh kembali",
        });
      }
    }

    console.log(us);

    let dPublikasi = await dataPublikasi.findOne({
      where: {
        uuid: uuid,
      },
    });
    let regi = await province.findOne({
      where: {
        kode: kode,
      },
    });
    const aktivitas = {
      uuid: uuidv4(),
      wilayah: kode,
      wilayahName: regi.name,
      waktuMulai: new Date(),
      status: "processing",
      dataPublikasiId: dPublikasi.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*
        const url =
          config.api_grass +
          "/unduh/produsen/provinsi/" +
          uuid +
          "/" +
          kode +
          "/" +
          user_uuid; // Replace with your API endpoint URL
        */
        const url = config.api_grass + "/unduh/publikasi/" + pub.uuid;
        console.log(url);
        const response = await axios.get(url);
        console.log(response.data);

        if (response.data.status == "success") {
          res.status(200).send({
            message: "Successfully processing the request",
          });
        } else {
          res.status(500).send({
            message: "Something wrong happened",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the Data Pemeriksaan.",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: `Could not process the request:  ${err}`,
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
  dataPublikasi
    .findAll({
      order: [["deskripsi", "ASC"]],
      offset: 0,
      limit: 100,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
          include: [
            {
              model: dataProdusen,
              as: "dataProdusen",
              attributes: ["id", "uuid", "deskripsi", "urlGeoserver"],
              include: [
                {
                  model: Tematik,
                  as: "tematik",
                  attributes: ["id", "name", "is_series"],
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "is_published",
        "is_active",
        "identifier",
        "urlGeoserver",
        "waktuPublish",
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
            dataPublikasi
              .findAll({
                where: {
                  tematikId: {
                    [Op.or]: tematiks,
                  },
                  is_active: true,
                },
                order: [["deskripsi", "ASC"]],

                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "username"],
                  },
                  {
                    model: dataPemeriksaan,
                    as: "dataPemeriksaan",
                    attributes: ["id", "uuid", "kategori"],
                    include: [
                      {
                        model: db.dataPerbaikanProdusen,
                        as: "dataPerbaikanProdusen",
                      },
                    ],
                  },
                  {
                    model: Tematik,
                    as: "tematik",
                    attributes: ["id", "name", "is_series"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "deskripsi",
                  "is_published",
                  "is_active",
                  "urlGeoserver",
                  "waktuPublish",
                  "createdAt",
                ],
              })
              .then((daPub) => {
                res.send(daPub);
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

exports.findAllIGT = (req, res) => {
  const query = req.params.query;

  Tematik.findAll({
    where: {
      name: {
        [Op.iLike]: `%${query}%`,
      },
    },
  })
    .then((tema) => {
      //console.log(tema);
      let tematiks = [];
      for (let i = 0; i < tema.length; i++) {
        tematiks.push(tema[i].id);
      }
      dataPublikasi
        .findAll({
          where: {
            tematikId: {
              [Op.or]: tematiks,
            },
            is_active: true,
          },
          order: [
            [{ model: Tematik }, "name", "ASC"],
            ["deskripsi", "ASC"],
          ],

          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
            {
              model: dataPemeriksaan,
              as: "dataPemeriksaan",
              attributes: ["id", "uuid", "kategori"],
              include: [
                {
                  model: db.dataPerbaikanProdusen,
                  as: "dataPerbaikanProdusen",
                },
              ],
            },
            {
              model: Tematik,
              as: "tematik",
              attributes: ["id", "name", "is_series"],
            },
          ],
          attributes: [
            "id",
            "uuid",
            "deskripsi",
            "is_published",
            "is_active",
            "urlGeoserver",
            "waktuPublish",
            "createdAt",
          ],
        })
        .then((daPub) => {
          res.send(daPub);
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
        message: err.message || "Some error occurred while retrieving Tematik.",
      });
    });
};

exports.findAllProdusenAdmin = (req, res) => {
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
            dataPublikasi
              .findAll({
                where: {
                  tematikId: {
                    [Op.or]: tematiks,
                  },
                },
                order: [["deskripsi", "ASC"]],

                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "username"],
                  },
                  {
                    model: dataPemeriksaan,
                    as: "dataPemeriksaan",
                    attributes: ["id", "kategori"],
                    include: [
                      {
                        model: db.dataPerbaikanProdusen,
                        as: "dataPerbaikanProdusen",
                      },
                    ],
                  },
                  {
                    model: Tematik,
                    as: "tematik",
                    attributes: ["id", "name", "is_series"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "deskripsi",
                  "is_published",
                  "is_active",
                  "urlGeoserver",
                  "waktuPublish",
                  "createdAt",
                ],
              })
              .then((daPub) => {
                res.send(daPub);
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

exports.findAllEksternalUser = (req, res) => {
  const uuid = req.params.uuid;
  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (us) => {
      user_ekse = await us.getEksternals();
      Eksternal.findByPk(user_ekse[0].id)
        .then(async (eks) => {
          if (!eks) {
            res.send([]);
            //return res.status(404).send({ message: "Kategori Not found." });
          } else {
            let eks_tema = await eks.getTematiks();
            if (eks_tema.length == 0) {
              res.send([]);
            } else {
              let tematiks = [];
              for (let i = 0; i < eks_tema.length; i++) {
                //console.log(eks_tema[i]);
                tematiks.push(eks_tema[i].id);
              }
              Tematik.findAll({
                where: {
                  id: {
                    [Op.or]: tematiks,
                  },
                },
              })
                .then((tema) => {
                  console.log(tema);
                  let tematiks = [];
                  for (let i = 0; i < tema.length; i++) {
                    tematiks.push(tema[i].id);
                  }
                  dataPublikasi
                    .findAll({
                      where: {
                        tematikId: {
                          [Op.or]: tematiks,
                        },
                        is_active: true,
                      },
                      order: [["deskripsi", "ASC"]],

                      include: [
                        {
                          model: User,
                          as: "user",
                          attributes: ["id", "username"],
                        },
                        {
                          model: dataPemeriksaan,
                          as: "dataPemeriksaan",
                          attributes: ["id", "kategori"],
                          include: [
                            {
                              model: db.dataPerbaikanProdusen,
                              as: "dataPerbaikanProdusen",
                            },
                          ],
                        },
                        {
                          model: Tematik,
                          as: "tematik",
                          attributes: ["id", "name", "is_series"],
                        },
                      ],
                      attributes: [
                        "id",
                        "uuid",
                        "deskripsi",
                        "is_published",
                        "is_active",
                        "urlGeoserver",
                        "waktuPublish",
                        "createdAt",
                      ],
                    })
                    .then((daPub) => {
                      res.send(daPub);
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

exports.findAllInternalUser = (req, res) => {
  const uuid = req.params.uuid;
  User.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (us) => {
      user_ekse = await us.getInternals();
      Internal.findByPk(user_ekse[0].id)
        .then(async (eks) => {
          if (!eks) {
            res.send([]);
            //return res.status(404).send({ message: "Kategori Not found." });
          } else {
            let eks_tema = await eks.getTematiks();
            if (eks_tema.length == 0) {
              res.send([]);
            } else {
              let tematiks = [];
              for (let i = 0; i < eks_tema.length; i++) {
                //console.log(eks_tema[i]);
                tematiks.push(eks_tema[i].id);
              }
              Tematik.findAll({
                where: {
                  id: {
                    [Op.or]: tematiks,
                  },
                },
              })
                .then((tema) => {
                  console.log(tema);
                  let tematiks = [];
                  for (let i = 0; i < tema.length; i++) {
                    tematiks.push(tema[i].id);
                  }
                  dataPublikasi
                    .findAll({
                      where: {
                        tematikId: {
                          [Op.or]: tematiks,
                        },
                        is_active: true,
                      },
                      order: [["deskripsi", "ASC"]],

                      include: [
                        {
                          model: User,
                          as: "user",
                          attributes: ["id", "username"],
                        },
                        {
                          model: dataPemeriksaan,
                          as: "dataPemeriksaan",
                          attributes: ["id", "kategori"],
                          include: [
                            {
                              model: db.dataPerbaikanProdusen,
                              as: "dataPerbaikanProdusen",
                            },
                          ],
                        },
                        {
                          model: Tematik,
                          as: "tematik",
                          attributes: ["id", "name", "is_series"],
                        },
                      ],
                      attributes: [
                        "id",
                        "uuid",
                        "deskripsi",
                        "is_published",
                        "is_active",
                        "urlGeoserver",
                        "waktuPublish",
                        "createdAt",
                      ],
                    })
                    .then((daPub) => {
                      res.send(daPub);
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

exports.findByUUID = (req, res) => {
  //console.log(req);
  const { uuid } = req.params;
  console.log(uuid);
  return dataPublikasi
    .findOne({
      where: { uuid: uuid },
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
          include: [
            {
              model: db.dataPerbaikanProdusen,
              as: "dataPerbaikanProdusen",
            },
          ],
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name", "is_series"],
        },
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "is_published",
        "is_active",
        "waktuPublish",
        "urlGeoserver",
        "createdAt",
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding Data Publikasi: ", err);
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
  const uuid = req.params.uuid;

  dataPublikasi
    .destroy({
      where: { uuid: uuid },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data Publikasi was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Data Publikasi with id=${id}. Maybe Data Publikasi was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not Data Publikasi with id=" + id,
      });
    });
};
