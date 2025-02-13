const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const uploadEksternal = require("../middleware/uploadEksternal");

const fs = require("fs");

const User = db.user;
const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const eksternal = db.eksternal;
const region = db.region;
const province = db.province;

const igtEksternal = db.igtEksternal;

const dataEksternal = db.dataEksternal;
const aktifitasUnduh = db.aktifitasUnduh;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    await uploadEksternal(req, res);
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

    if (!objectValue.deskripsi && !objectValue.user && !objectValue.tematik) {
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

    let igtEkst = await db.igtEksternal.findOne({
      where: {
        uuid: objectValue.tematik.uuid,
      },
    });

    const data = {
      uuid: uuidv4(),
      deskripsi: objectValue.deskripsi,
      pdfname: req.files[0].filename,
      filename: req.files[1].filename,
      igtEksternalId: igtEkst.id,
      userId: user.id,
    };
    // Save Tutorial in the database
    dataEksternal
      .create(data)
      .then(async (data) => {
        const url = config.api_grass + "/konversi/eksternal/" + data.uuid; // Replace with your API endpoint URL
        console.log(url);
        const response = await axios.get(url);
        console.log(response.data);
        // Send the image data as the response
        if (response.data.status == "success") {
          dataEksternal
            .findByPk(data.id, {
              include: [
                { model: User, as: "user", attributes: ["id", "username"] },
                {
                  model: igtEksternal,
                  as: "igtEksternal",
                  attributes: ["id", "name"],
                },
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
                  "Some error occurred while creating the Data Eksternal.",
              });
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

exports.updatePulang = async (req, res) => {
  const uuid = req.params.uuid;
  BukuTamu.findOne({
    where: {
      uuid: uuid,
    },
  })
    .then(async (bukutamu) => {
      if (!bukutamu) {
        return res.status(404).send({ message: "Buku Tamu Not found." });
      }
      let user = await User.findOne({
        where: {
          uuid: req.body.uuid,
        },
      });

      const update = {
        reporterId: user.id,
        waktuPulang: new Date(),
      };
      BukuTamu.update(update, {
        where: { id: bukutamu.id },
      })
        .then((num) => {
          if (num == 1) {
            BukuTamu.findByPk(bukutamu.id, {
              include: [
                { model: User, as: "user", attributes: ["uuid", "username"] },
                {
                  model: Lokasi,
                  as: "lokasi",
                  attributes: ["uuid", "lokasiName"],
                },
                {
                  model: User,
                  as: "reporter",
                  attributes: ["uuid", "username"],
                },
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
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAllUser = async (req, res) => {
  const uuid = req.params.uuid;
  let user = await User.findOne({
    where: {
      uuid: uuid,
    },
  });
  if (!user) {
    return res.send([]);

    //return res.status(404).send({ message: "User Not found." });
  }
  let eks = await user.getEksternals();

  if (eks.length == 0) {
    res.send([]);
  } else {
    eksternal
      .findOne({
        where: {
          id: eks[0].id,
        },
      })
      .then(async (data) => {
        if (!data) {
          return res.send([]);
          //return res.status(404).send({ message: "Produsen Not found." });
        } else {
          let eks_user = await data.getUsers();
          console.log(eks_user.length);
          if (eks_user.length == 0) {
            res.send([]);
          } else {
            let users = [];
            for (let i = 0; i < eks_user.length; i++) {
              //console.log(eks_tema[i]);
              users.push(eks_user[i].id);
            }
            dataEksternal
              .findAll({
                where: {
                  userId: {
                    [Op.or]: users,
                  },
                },
                include: [
                  { model: User, as: "user", attributes: ["id", "username"] },
                  {
                    model: igtEksternal,
                    as: "igtEksternal",
                    attributes: ["id", "name"],
                  },
                ],
                attributes: [
                  "id",
                  "uuid",
                  "deskripsi",
                  "urlGeoserver",
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
          }
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving lokasi.",
        });
      });
  }
  /*
  dataEksternal
    .findAll({
      where: {
        userId: user.id,
      },
      order: [["id", "ASC"]],
      offset: 0,
      limit: 100,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: igtEksternal, as: "igtEksternal", attributes: ["id", "name"] },
      ],
      attributes: ["id", "uuid", "deskripsi", "urlGeoserver", "createdAt"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data BPKHTL.",
      });
    });
    */
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
  dataEksternal
    .findAll({
      order: [["id", "ASC"]],
      offset: 0,
      limit: 100,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        { model: igtEksternal, as: "igtEksternal", attributes: ["id", "name"] },
      ],
      attributes: ["id", "uuid", "deskripsi", "createdAt"],
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
  const uuid = req.params.uuid;

  dataEksternal
    .destroy({
      where: { uuid: uuid },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Data Eksternal was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Data Eksternal with id=${uuid}. Maybe Data Eksternal was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Data Eksternal with id=" + uuid,
      });
    });
};

exports.findAllEksternal = (req, res) => {
  const uuid = req.params.uuid;
  eksternal
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
        let eks_user = await data.getUsers();
        console.log(eks_user.length);
        if (eks_user.length == 0) {
          res.send([]);
        } else {
          let users = [];
          for (let i = 0; i < eks_user.length; i++) {
            //console.log(eks_tema[i]);
            users.push(eks_user[i].id);
          }
          dataEksternal
            .findAll({
              where: {
                userId: {
                  [Op.or]: users,
                },
              },
              include: [
                { model: User, as: "user", attributes: ["id", "username"] },
                {
                  model: igtEksternal,
                  as: "igtEksternal",
                  attributes: ["id", "name"],
                },
              ],
              attributes: [
                "id",
                "uuid",
                "deskripsi",
                "urlGeoserver",
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
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving lokasi.",
      });
    });
};

exports.downloadReferensi = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataEksternal.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.pdfname;
  const directoryPath = __basedir + "/app/resources/static/assets/eksternal/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.downloadMetadata = async (req, res) => {
  const uuid = req.params.uuid;
  let data = await dataEksternal.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.metadatafilename;
  const directoryPath = __basedir + "/app/resources/static/assets/eksternal/";

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
  let data = await dataEksternal.findOne({
    where: {
      uuid: uuid,
    },
  });
  const fileName = data.filename;
  const directoryPath = __basedir + "/app/resources/static/assets/eksternal/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.findByUUID = (req, res) => {
  //console.log(req);
  const { uuid } = req.params;
  console.log(uuid);
  return dataEksternal
    .findOne({
      where: { uuid: uuid },
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: igtEksternal,
          as: "igtEksternal",
          attributes: ["id", "name"],
          include: [
            {
              model: eksternal,
              as: "eksternal",
              include: [{ model: region, as: "regions" }],
            },
          ],
        },
      ],
      attributes: ["id", "uuid", "deskripsi", "urlGeoserver", "createdAt"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(">> Error while finding Data Eksternal: ", err);
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
    let dProdusen = await dataEksternal.findOne({
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
      dataEksternalId: dProdusen.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*const url =
          config.api_grass +
          "/unduh/eksternal/kabkot/" +
          uuid +
          "/" +
          kode +
          "/" +
          user_uuid; // Replace with your API endpoint URL
          */
        const url = config.api_grass + "/unduh/eksternal/" + pub.uuid; // Replace with your API endpoint URL
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

    let dProdusen = await dataEksternal.findOne({
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
      dataEksternalId: dProdusen.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*
        const url =
          config.api_grass +
          "/unduh/eksternal/indonesia/" +
          uuid +
          "/" +
          user_uuid; // Replace with your API endpoint URL
          */
        const url = config.api_grass + "/unduh/eksternal/" + pub.uuid; // Replace with your API endpoint URL

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

    let dProdusen = await dataEksternal.findOne({
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
      dataEksternalId: dProdusen.id,
      userId: us.id,
    };

    aktifitasUnduh
      .create(aktivitas)
      .then(async (pub) => {
        console.log(pub);
        /*const url =
          config.api_grass +
          "/unduh/eksternal/provinsi/" +
          uuid +
          "/" +
          kode +
          "/" +
          user_uuid; // Replace with your API endpoint URL
          */
        const url = config.api_grass + "/unduh/eksternal/" + pub.uuid; // Replace with your API endpoint URL

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
