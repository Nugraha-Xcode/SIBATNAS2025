const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const uploadCSW = require("../middleware/uploadCSW");
const path = require('path');

const { publishMetadata } = require("../utils/xml_to_csw");

const User = db.user;
const Eksternal = db.eksternal;
const Internal = db.internal;

const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const Produsen = db.produsen;

const dataProdusen = db.dataProdusen;
const dataPemeriksaan = db.dataPemeriksaan;
const dataPerbaikanProdusen = db.dataPerbaikanProdusen;
const dataPublikasi = db.dataPublikasi;
const record = db.record;
const statusPemeriksaan = db.statusPemeriksaan;
const aktifitasUnduh = db.aktifitasUnduh;
const notifikasi = db.notifikasi;

const region = db.region;
const province = db.province;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    // console.log("Request Body:", req.body);
    // console.log("Request Files:", req.files);
    // console.log("Request File:", req.file);
    await uploadCSW(req, res);
    //await uploadMetadata(req, res);
    //return res.status(200).send({ message: "Debugging File!" });
    if (req.file == undefined) {
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

    if (!objectValue.uuid) {
      return res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    try {
      const directoryPath =
        __basedir + "/app/resources/static/assets/publikasi/";
      const metadataPath = directoryPath + req.file.filename; // Example file path
      const result = await publishMetadata(metadataPath);
      console.log(result);
      if (result.includes("Error") || result.includes("Exception")) {
        return res.status(400).send({
          message: "Metadata XML gagal diproses! \n" + result,
        });
      } else {
        const regex = /<dc:identifier>(.*?)<\/dc:identifier>/;

        // Execute the regex on the string
        const match = result.match(regex);

        if (match) {
          // console.log("dc:identifier:", match[1]); // Output: Atlas_250K_BatuBara
          const identifier = match[1];
          // console.log("identifier", identifier);
          // console.log("objectValue.uuid", objectValue.uuid);
          const update = {
            identifier: identifier,
          };
          dataPublikasi
            .update(update, {
              where: { uuid: objectValue.uuid },
            })
            .then(async (num) => {
              if (num == 1) {
                // Ambil data publikasi untuk dipakai di notifikasi
                const publikasi = await dataPublikasi.findOne({
                  where: { uuid: objectValue.uuid },
                  include: [
                    {
                      model: Tematik,
                      as: "tematik",
                      attributes: ["name"],
                    },
                  ],
                });

                if (!publikasi) {
                  return res.status(404).send({
                    message: "Publikasi tidak ditemukan.",
                  });
                }

                let users = await User.findAll({ attributes: ["id"] });
                for (let i = 0; i < users.length; i++) {
                  let notif = {
                    uuid: uuidv4(),
                    waktuKirim: new Date(),
                    subjek: "Publikasi IGT Baru - " + publikasi.tematik.name,
                    pesan:
                      "Walidata baru saja melakukan publikasi metadata IGT " +
                      publikasi.tematik.name +
                      " (" +
                      publikasi.deskripsi +
                      "). Cek ke menu Data Publikasi dan Katalog ya!",
                    sudahBaca: false,
                    userId: users[i].id,
                  };

                  notifikasi.create(notif);
                }

                res.send({
                  message: "Record was published successfully!",
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
          console.log("dc:identifier not found.");
          return res.status(400).send({
            message: "dc:identifier not found",
          });
        }
      }
    } catch (error) {
      console.error("Error in processing:", error);
    }
  } catch (err) {
    console.log(req.files);
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

        const update = {
          userId: us.id,
          is_published: true,
          is_active: true,
          waktuPublish: new Date(),
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

        const update = {
          userId: us.id,
          is_published: true,
          is_active: true,
          waktuPublish: new Date(),
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

// Update method findAll untuk support search dan pagination (untuk admin)
exports.findAll = (req, res) => {
  // Get pagination parameters from query
  const { page = 0, size = 20, keyword = "" } = req.query;
  const pageInt = parseInt(page);
  const sizeInt = parseInt(size);
  const offset = pageInt * sizeInt;
  const limit = sizeInt;

  // Build where condition for search
  const whereConditions = {
    identifier: null,
    is_active: true,
    is_published: true,
  };
  
  // Add search condition if keyword provided
  const searchConditions = keyword ? {
    [Op.or]: [
      { deskripsi: { [Op.iLike]: `%${keyword}%` } },
      { "$dataPemeriksaan.dataProdusen.tematik.name$": { [Op.iLike]: `%${keyword}%` } }
    ]
  } : {};

  // Get total count first for pagination metadata
  dataPublikasi
    .count({
      where: {
        ...whereConditions,
        ...searchConditions
      },
      include: [
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          required: true,
          include: [
            {
              model: dataProdusen,
              as: "dataProdusen",
              required: true,
              include: [
                {
                  model: Tematik,
                  as: "tematik",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    })
    .then(totalItems => {
      // Then get paginated data
      dataPublikasi
        .findAll({
          where: {
            ...whereConditions,
            ...searchConditions
          },
          order: [
            [{ model: dataPemeriksaan, as: "dataPemeriksaan" }, 
             { model: dataProdusen, as: "dataProdusen" }, 
             { model: Tematik, as: "tematik" }, 
             "name", "ASC"],
            ["deskripsi", "ASC"]
          ],
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
                {
                  model: dataPerbaikanProdusen,
                  as: "dataPerbaikanProdusen",
                  attributes: ["id", "uuid", "kategori"],
                  order: [["createdAt", "DESC"]],  // Urutkan dari yang terbaru
                  limit: 1, // Ambil hanya satu data terakhir
                  separate: true, // Pastikan pengambilan dilakukan terpisah agar limit berlaku
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
          offset,
          limit,
        })
        .then((data) => {
          // Send pagination metadata along with the data
          res.send({
            totalItems,
            records: data,
            totalPages: Math.ceil(totalItems / sizeInt),
            currentPage: pageInt,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while counting records.",
      });
    });
};

exports.findAllPublik = (req, res) => {
  // Get pagination parameters from query
  const { page = 0, size = 20, keyword = "" } = req.query;
  const pageInt = parseInt(page);
  const sizeInt = parseInt(size);
  const offset = pageInt * sizeInt;
  const limit = sizeInt;

  // Build where condition for search
  const whereConditions = {
    identifier: { [Op.ne]: null },
    is_active: true,
    is_published: true,
  };
  
  // Add search condition if keyword provided
  const searchConditions = keyword ? {
    [Op.or]: [
      { deskripsi: { [Op.iLike]: `%${keyword}%` } },
      { "$dataPemeriksaan.dataProdusen.tematik.name$": { [Op.iLike]: `%${keyword}%` } }
    ]
  } : {};

  // Get total count first for pagination metadata
  dataPublikasi
    .count({
      where: {
        ...whereConditions,
        ...searchConditions
      },
      include: [
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          required: true,
          include: [
            {
              model: dataProdusen,
              as: "dataProdusen",
              required: true,
              include: [
                {
                  model: Tematik,
                  as: "tematik",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    })
    .then(totalItems => {
      // Then get paginated data
      dataPublikasi
        .findAll({
          where: {
            ...whereConditions,
            ...searchConditions
          },
          order: [
            [{ model: dataPemeriksaan, as: "dataPemeriksaan" }, 
             { model: dataProdusen, as: "dataProdusen" }, 
             { model: Tematik, as: "tematik" }, 
             "name", "ASC"],
            ["deskripsi", "ASC"]
          ],
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
                {
                  model: dataPerbaikanProdusen,
                  as: "dataPerbaikanProdusen",
                  attributes: ["id", "uuid", "kategori"],
                  order: [["createdAt", "DESC"]],  // Urutkan dari yang terbaru
                  limit: 1, // Ambil hanya satu data terakhir
                  separate: true, // Pastikan pengambilan dilakukan terpisah agar limit berlaku
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
          offset,
          limit,
        })
        .then((data) => {
          // Send pagination metadata along with the data
          res.send({
            totalItems,
            records: data,
            totalPages: Math.ceil(totalItems / sizeInt),
            currentPage: pageInt,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while counting records.",
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

exports.downloadMetadata = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataPerbaikanProdusen.findOne({
    where: { uuid },
  });

  let folder = 'perbaikan'; // default

  // Jika tidak ditemukan di perbaikan, cari di produsen
  if (!data) {
    data = await dataProdusen.findOne({
      where: { uuid },
    });
    folder = 'produsen';
  }

  if (!data) {
    return res.status(404).json({ message: 'Data tidak ditemukan.' });
  }

  if (!data.metadatafilename) {
    return res.status(400).json({ message: 'File metadata tidak tersedia.' });
  }

  const filePath = path.join(
    __basedir,
    'app',
    'resources',
    'static',
    'assets',
    folder,
    data.metadatafilename
  );

  res.download(filePath, data.metadatafilename);
};
