const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Op, Sequelize } = require("sequelize");
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const {
  importShapefileToPostGIS,
  deletePostGISTable,
  getTableName,
} = require("../utils/shapefile_to_postgis");
const {
  publishTableAsLayer,
  getUrlGeoserver,
  unpublishLayer,
  deleteFeatureType,
} = require("../utils/postgis_to_geoserver");
const { 
  processSLDInZip,
} = require('../utils/sld_to_geoserver');
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

const statusPemeriksaan = db.statusPemeriksaan;
const aktifitasUnduh = db.aktifitasUnduh;
const notifikasi = db.notifikasi;

const region = db.region;
const province = db.province;
const recordCsw = db.record;

const sequelize = db.sequelize;

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

  if (!req.body.uuid) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Start database transaction
  const transaction = await sequelize.transaction();
  
  // Variables to track what needs to be rolled back - MOVED TO FUNCTION SCOPE
  let cleanTableName = null;
  let publishedToGeoServer = false;
  let sldProcessed = false;
  let deactivatedPreviousPublications = false;
  let publikasi = null; // Add publikasi to function scope
  
  try {
    // Step 1: Fetch publikasi data
    publikasi = await dataPublikasi.findOne({
      where: { uuid },
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
      transaction, // Include transaction
    });

    if (!publikasi) {
      await transaction.rollback();
      return res.status(404).send({ message: "Publikasi Not found." });
    }

    const user = await User.findOne({ 
      where: { uuid: req.body.user.uuid },
      transaction 
    });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).send({ message: "User not found." });
    }

    console.log("USER", user);
    
    const shapefileZipPath = __basedir + "/app/resources/static/assets/publikasi/" + publikasi.filename;
    const is_public = req.body.is_public !== undefined ? req.body.is_public : false;

    if (publikasi.tematik.is_series) {
      // ===== Series Section =====
      console.log("Series: Menonaktifkan publikasi sebelumnya...");
      
      // Step 2: Deactivate previous publications (database operation)
      await dataPublikasi.update(
        { is_active: false },
        { 
          where: { tematikId: publikasi.tematik.id },
          transaction 
        }
      );
      deactivatedPreviousPublications = true;

      // Step 3: Import shapefile to PostGIS (external operation)
      console.log("Importing shapefile to PostGIS...");
      await importShapefileToPostGIS(shapefileZipPath);

      let tableName = await getTableName(shapefileZipPath);
      cleanTableName = tableName.replace(/['"]/g, '');
      console.log(`Table name from shapefile: ${cleanTableName}`);

      // Step 4: Publish to GeoServer (external operation)
      console.log(`Publishing ${cleanTableName} to GeoServer...`);
      await publishTableAsLayer(cleanTableName, publikasi.tematik.name, publikasi.deskripsi);
      publishedToGeoServer = true;

      // Step 5: Process SLD (external operation)
      console.log("Processing SLD...");
      const sldResult = await processSLDInZip(shapefileZipPath, cleanTableName);
      if (sldResult) {
        console.log("SLD processed successfully.");
        sldProcessed = true;
      } else {
        console.log("No SLD or failed processing.");
      }

      const urlGeoserver = await getUrlGeoserver(cleanTableName);
      const update = {
        userId: user.id,
        is_published: true,
        is_active: true,
        waktuPublish: new Date(),
        urlGeoserver,
        is_public: is_public,
      };

      // Step 6: Update publikasi and send notifications (database operations)
      const updatedPublikasi = await updatePublikasiDanKirimNotif(publikasi.id, update, publikasi, transaction);
      
      // Commit transaction before sending response
      await transaction.commit();
      console.log("Transaction committed successfully");
      
      // Send successful response
      res.send(updatedPublikasi);

    } else {
      // ===== Non-Series Section =====
      console.log("Non-Series: Langsung publish tanpa menonaktifkan sebelumnya...");

      // Step 2: Import shapefile to PostGIS (external operation)
      let tableName = await getTableName(shapefileZipPath);
      cleanTableName = tableName.replace(/['"]/g, '');
      console.log(`Table name from shapefile: ${cleanTableName}`);

      console.log("Importing shapefile to PostGIS...");
      await importShapefileToPostGIS(shapefileZipPath);

      // Step 3: Publish to GeoServer (external operation)
      console.log(`Publishing ${cleanTableName} to GeoServer...`);
      await publishTableAsLayer(cleanTableName, publikasi.tematik.name, publikasi.deskripsi);
      publishedToGeoServer = true;

      // Step 4: Process SLD (external operation)
      console.log("Processing SLD...");
      const sldResult = await processSLDInZip(shapefileZipPath, cleanTableName);
      if (sldResult) {
        console.log("SLD processed successfully.");
        sldProcessed = true;
      } else {
        console.log("No SLD or failed processing.");
      }

      const urlGeoserver = await getUrlGeoserver(cleanTableName);
      const update = {
        userId: user.id,
        is_published: true,
        is_active: true,
        waktuPublish: new Date(),
        urlGeoserver,
        is_public: is_public,
      };

      // Step 5: Update publikasi and send notifications (database operations)
      const updatedPublikasi = await updatePublikasiDanKirimNotif(publikasi.id, update, publikasi, transaction);
      
      // Commit transaction before sending response
      await transaction.commit();
      console.log("Transaction committed successfully");
      
      // Send successful response
      res.send(updatedPublikasi);
    }

  } catch (err) {
    console.error("Error during publish process:", err);
    
    // Rollback database transaction
    try {
      await transaction.rollback();
      console.log("🔄 Database transaction rolled back");
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }

    // Additional cleanup for external operations
    await performCleanupOperations(cleanTableName, publishedToGeoServer, publikasi);

    return res.status(500).send({
      message: err.message || "Terjadi kesalahan saat memproses publikasi.",
    });
  }
};

// Helper function untuk update dan kirim notifikasi dengan transaction
async function updatePublikasiDanKirimNotif(publikasiId, update, publikasi, transaction) {
  try {
    // Update publikasi data
    const updated = await dataPublikasi.update(update, {
      where: { id: publikasiId },
      transaction, // Use the passed transaction
    });

    if (updated[0] !== 1) {
      throw new Error(`Gagal update Data Publikasi dengan id=${publikasiId}.`);
    }

    // Get all users for notification
    const users = await User.findAll({ 
      attributes: ["id"],
      transaction 
    });

    // Create notifications for all users
    const notificationPromises = users.map(user => {
      const notif = {
        uuid: uuidv4(),
        waktuKirim: new Date(),
        subjek: "Publikasi IGT Baru - " + publikasi.tematik.name,
        pesan:
          "Walidata baru saja melakukan publikasi service data IGT " +
          publikasi.tematik.name +
          " (" +
          publikasi.deskripsi +
          ").",
        sudahBaca: false,
        userId: user.id,
      };
      return notifikasi.create(notif, { transaction });
    });

    // Wait for all notifications to be created
    await Promise.all(notificationPromises);

    // Fetch updated publikasi data
    const updatedPublikasi = await dataPublikasi.findByPk(publikasiId, {
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "kategori"],
          include: [
            {
              model: dataPerbaikanProdusen,
              as: "dataPerbaikanProdusen",
              attributes: ["id", "uuid", "kategori"],
              order: [["createdAt", "DESC"]],
              limit: 1,
              separate: true,
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
      transaction, // Use transaction here too
    });

    // Return the updated publikasi data
    return updatedPublikasi;
    
  } catch (error) {
    console.error("Error in updatePublikasiDanKirimNotif:", error);
    throw error; // Re-throw to trigger rollback
  }
}

// Cleanup function for external operations
async function performCleanupOperations(cleanTableName, publishedToGeoServer, publikasi) {
  console.log("Starting cleanup operations...");
  console.log("cleanTableName",cleanTableName)
  
  try {
    // Cleanup PostGIS table if it was imported
    if (cleanTableName) {
      console.log(`Cleaning up PostGIS table: ${cleanTableName}`);
      try {
        await deletePostGISTable(cleanTableName);
        console.log(`PostGIS table ${cleanTableName} cleaned up successfully`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup PostGIS table ${cleanTableName}:`, cleanupError);
      }
    }

    // Cleanup GeoServer layer if it was published
    if (publishedToGeoServer && cleanTableName) {
      console.log(`Cleaning up GeoServer layer: ${cleanTableName}`);
      try {
        await unpublishLayer(cleanTableName);
        console.log(`GeoServer layer ${cleanTableName} cleaned up successfully`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup GeoServer layer ${cleanTableName}:`, cleanupError);
      }
    }

  } catch (error) {
    console.error("Error during cleanup operations:", error);
  }
}

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

/*
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
*/

/*
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
*/

exports.unduh = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const user_uuid = req.params.user_uuid;
    
    // Find user and data
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
    
    if (!data || !us) {
      return res.status(404).send({
        message: "User or publication not found",
      });
    }
    
    const fileName = data.filename;
    const directoryPath = __basedir + "/app/resources/static/assets/publikasi/";
    
    // Create activity record before download
    const aktivitas = {
      uuid: uuidv4(),
      wilayah: "-",
      wilayahName: "-",
      waktuMulai: new Date(),
      status: "done",
      dataPublikasiId: data.id,
      userId: us.id,
    };
    
    await aktifitasUnduh.create(aktivitas);
    
    // Then download the file
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        // Just log the error, don't try to send another response
        console.error("Download error:", err);
      }
    });
  } catch (error) {
    // If anything fails before the download starts, send error response
    console.error("Unduh error:", error);
    res.status(500).send({
      message: "Failed to process download request: " + error.message,
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

exports.findAllProdusen = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  try {
    const produsen = await Produsen.findOne({ where: { uuid } });
    if (!produsen) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }
    
    // Cari tematik berdasarkan produsen
    const tematiks = await Tematik.findAll({
      where: {
        produsenId: produsen.id,
      },
    });
    
    // Buat array untuk menyimpan ID tematik
    let tematikIds = [];
    for (let i = 0; i < tematiks.length; i++) {
      tematikIds.push(tematiks[i].id);
    }
    
    // Buat kondisi pencarian (search)
    let whereCondition = {
      tematikId: {
        [Op.or]: tematikIds,
      },
      is_active: true
    };
    
    // Tambahkan kondisi pencarian jika keyword ada
    if (keyword && keyword.trim() !== "") {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { deskripsi: { [Op.iLike]: `%${keyword}%` } },
          { '$tematik.name$': { [Op.iLike]: `%${keyword}%` } }
        ]
      };
    }
    
    // Cari data publikasi dengan pagination
    const { count, rows } = await dataPublikasi.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
          include: [
            {
              model: dataPerbaikanProdusen,
              as: "dataPerbaikanProdusen",
              attributes: ["id", "uuid", "kategori"],
              order: [["createdAt", "DESC"]],
              limit: 1,
              separate: true,
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
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["deskripsi", "ASC"]],
    });
    
    // Kirim respons dengan format pagination
    res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(size)),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving data publikasi.",
    });
  }
};

// Implementasi yang sama untuk findAllProdusenAdmin dengan perbedaan tidak adanya filter is_active: true

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

// Modifikasi endpoint findAllProdusenAdmin untuk mendukung pencarian dan pagination
exports.findAllProdusenAdmin = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  try {
    const produsen = await Produsen.findOne({ where: { uuid } });
    if (!produsen) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }
    
    // Cari tematik berdasarkan produsen
    const tematiks = await Tematik.findAll({
      where: {
        produsenId: produsen.id,
      },
    });
    
    // Buat array untuk menyimpan ID tematik
    let tematikIds = [];
    for (let i = 0; i < tematiks.length; i++) {
      tematikIds.push(tematiks[i].id);
    }
    
    // Buat kondisi pencarian (search)
    let whereCondition = {
      tematikId: {
        [Op.in]: tematikIds,
      },
      // Tidak ada filter is_active untuk Admin
    };
    
    // Tambahkan kondisi pencarian jika keyword ada
    if (keyword && keyword.trim() !== "") {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { deskripsi: { [Op.iLike]: `%${keyword}%` } },
          { '$tematik.name$': { [Op.iLike]: `%${keyword}%` } }
        ]
      };
    }
    
    // Cari data publikasi dengan pagination
    const { count, rows } = await dataPublikasi.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"],
          include: [
            {
              model: dataPerbaikanProdusen,
              as: "dataPerbaikanProdusen",
              attributes: ["id", "uuid", "kategori"],
              order: [["createdAt", "DESC"]],
              limit: 1,
              separate: true,
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
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["deskripsi", "ASC"]],
    });
    
    // Kirim respons dengan format pagination
    res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(size)),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving data publikasi.",
    });
  }
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
exports.delete = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const publikasi = await dataPublikasi.findOne({
      where: { uuid: uuid },
      include: [
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"]
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name"]
        }
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "filename",
        "pdfname",
        "metadatafilename",
        "identifier",
        "waktuPublish"
      ]
    });

    if (!publikasi) {
      return res.status(404).send({ message: "Publication not found" });
    }

    const filePathShapefile = __basedir + "/app/resources/static/assets/publikasi/" + publikasi.filename;
    const filePathPDF = __basedir + "/app/resources/static/assets/publikasi/" + publikasi.pdfname;
    const filePathMetadata = __basedir + "/app/resources/static/assets/publikasi/" + publikasi.metadatafilename;

    const deleteFileIfExists = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        }
      }
    };

    if (!publikasi.waktuPublish) {
      // Jika belum dipublish: hanya hapus file dan record database
      deleteFileIfExists(filePathShapefile);
      deleteFileIfExists(filePathPDF);
      deleteFileIfExists(filePathMetadata);

      await dataPublikasi.destroy({ where: { uuid: uuid } });

      return res.send({
        message: "Unpublished publication was deleted (file and database only)."
      });
    }

    // Proses lengkap jika sudah pernah dipublish
    const tableName = await getTableName(filePathShapefile);

    await unpublishLayer(tableName.replace(/^"(.*)"$/, "$1"));
    await deletePostGISTable(tableName);

    await aktifitasUnduh.destroy({
      where: { dataPublikasiId: publikasi.id }
    });

    await recordCsw.destroy({
      where: { identifier: publikasi.identifier }
    });

    const deleted = await dataPublikasi.destroy({ where: { uuid: uuid } });

    if (deleted === 1) {
      deleteFileIfExists(filePathShapefile);
      deleteFileIfExists(filePathPDF);
      deleteFileIfExists(filePathMetadata);

      res.send({
        message: "Publication was successfully deleted along with its layer and files"
      });
    } else {
      res.status(500).send({
        message: "Could not delete publication record"
      });
    }
  } catch (err) {
    console.error("Error deleting publication:", err);
    res.status(500).send({
      message: "Error deleting publication: " + err.message
    });
  }
};

exports.unpublish = async (req, res) => {
  const uuid = req.params.uuid;
  
  if (!req.body.uuid) {
    return res.status(400).send({
      message: "User UUID is required in the request body"
    });
  }

  try {
    const publikasi = await dataPublikasi.findOne({
      where: { uuid: uuid },
      include: [
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "uuid", "kategori"]
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name"]
        }
      ],
      attributes: [
        "id",
        "uuid",
        "deskripsi",
        "filename",
        "pdfname",
        "metadatafilename",
        "identifier",
        "waktuPublish"
      ]
    });

    if (!publikasi) {
      return res.status(404).send({ message: "Publication not found" });
    }

    // Find the user
    const user = await User.findOne({
      where: { uuid: req.body.uuid }
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get the table name from the shapefile
    const shapefileZipPath = __basedir + 
      "/app/resources/static/assets/publikasi/" + 
      publikasi.filename;
    
    const tableName = await getTableName(shapefileZipPath);
    
    // // Unpublish from GeoServer
    // const layerUnpublished = await unpublishLayer(tableName.replace(/^"(.*)"$/, "$1"));
    
    // if (!layerUnpublished) {
    //   return res.status(500).send({ 
    //     message: "Failed to unpublish layer from GeoServer" 
    //   });
    // }

    await unpublishLayer(tableName.replace(/^"(.*)"$/, "$1"));
    await deletePostGISTable(tableName);

    console.log("Identifier:", publikasi.identifier);

    await recordCsw.destroy({
      where: { identifier: publikasi.identifier }
    });

    // Update the publication record
    const update = {
      userId: user.id,
      identifier: null,
      is_published: false,
      is_active: false,
      waktuPublish: null,
      urlGeoserver: null  
    };

    await dataPublikasi.update(update, {
      where: { id: publikasi.id }
    });

    // Create notification for administrators
    // const notifMessage = {
    //   uuid: uuidv4(),
    //   waktuKirim: new Date(),
    //   subjek: "Publikasi IGT - " + publikasi.tematik.name + "telah di-unpublish",
    //   pesan: "Publikasi IGT " + publikasi.deskripsi + " telah di-unpublish oleh " + user.username,
    //   sudahBaca: false,
    //   userId: 1
    // };

    // Create notification for all users
    const users = await User.findAll({ attributes: ["id"] });

    for (let i = 0; i < users.length; i++) {
      const notif = {
        uuid: uuidv4(),
        waktuKirim: new Date(),
        subjek: "Publikasi service IGT - " + publikasi.tematik.name + " telah di-unpublish",
        pesan: "Publikasi service IGT " + publikasi.deskripsi + " telah di-unpublish oleh " + user.username,
        sudahBaca: false,
        userId: users[i].id,
      };
      await notifikasi.create(notif);
    }

    // Return the updated publication
    const updatedPublication = await dataPublikasi.findByPk(publikasi.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: dataPemeriksaan,
          as: "dataPemeriksaan",
          attributes: ["id", "kategori"]
        },
        {
          model: Tematik,
          as: "tematik",
          attributes: ["id", "name", "is_series"]
        }
      ],
      attributes: [
        "id", "uuid", "deskripsi", "is_published", "is_active",
        "urlGeoserver", "waktuPublish", "createdAt"
      ]
    });

    res.send(updatedPublication);
  } catch (err) {
    console.error("Error unpublishing layer:", err);
    res.status(500).send({
      message: "Error unpublishing layer: " + err.message
    });
  }
};

