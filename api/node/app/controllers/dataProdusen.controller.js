const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const uploadProdusen = require("../middleware/uploadProdusen");
const uploadMetadata = require("../middleware/uploadMetadata");

const fs = require("fs");

const {
  validateShapefileZip,
  checkTableExists
} = require("../utils/shapefile_to_postgis");

const { checkSLDExistsInGeoserver } = require("../utils/sld_to_geoserver");

const User = db.user;
const Lokasi = db.lokasi;
const BukuTamu = db.bukutamu;
const Tematik = db.tematik;
const Produsen = db.produsen;

const dataProdusen = db.dataProdusen;
const dataPerbaikanProdusen = db.dataPerbaikanProdusen;
const dataPemeriksaan = db.dataPemeriksaan;

exports.create = async (req, res) => {
  try {
    //console.log(objectValue);
    await uploadProdusen(req, res);
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

    // Validasi shapefile di ZIP
    const zipFilePath = req.files[2].path; // Assumsi shapefile ZIP ada di file ke-3
    let fileBaseName;
    try {
      // validasi isi zip dan nama file
      fileBaseName = await validateShapefileZip(zipFilePath);
      
      // Cek jika nama file dan tabel sama
      await checkTableExists(fileBaseName);

      // Cek jika nama sld sudah ada
      const sldExists = await checkSLDExistsInGeoserver(zipFilePath, fileBaseName);
      console.log(`SLD check result: ${sldExists ? 'SLD already exists in GeoServer' : 'SLD does not exist in GeoServer'}`);

      if (sldExists) {
      return res.status(400).send({
        message: `SLD file for layer '${fileBaseName}' already exists in GeoServer. Please rename your sld.`
      });
    }

    } catch (validationError) {
      return res.status(400).send({
        message: validationError.message
      });
    }

    // // Check if the filename already exists in both tables
    // const originalFilename = req.files[2].filename;
    
    // // More robust filename checking function
    // const checkDuplicateFilename = async (model, filenamePrefix) => {
    //   try {
    //     // Remove any numeric prefix and the specific prefix
    //     const cleanFilename = originalFilename
    //       .replace(/^\d+-/, '')  // Remove any numeric prefix
    //       .replace(new RegExp(`^${filenamePrefix}-`), '');  // Remove specific prefix

    //     // console.log('Debug - Original Filename:', originalFilename);
    //     // console.log('Debug - Clean Filename:', cleanFilename);
    //     // console.log('Debug - Model:', model.name);
    //     // console.log('Debug - Filename Prefix:', filenamePrefix);

    //     const existingFile = await model.findOne({
    //       where: {
    //         filename: {
    //           [Op.like]: `%${cleanFilename}`
    //         }
    //       }
    //     });

    //     console.log('Debug - Existing File:', existingFile);

    //     return existingFile;
    //   } catch (error) {
    //     console.error('Error in checkDuplicateFilename:', error);
    //     throw error;
    //   }
    // };

    // // Check in dataProdusen
    // const existingFileProdusen = await checkDuplicateFilename(dataProdusen, 'produsen');
    // if (existingFileProdusen) {
    //   return res.status(400).send({
    //     message: "File with this name already exists in database!"
    //   });
    // }

    // // Check in dataPerbaikanProdusen
    // const existingFilePerbaikan = await checkDuplicateFilename(dataPerbaikanProdusen, 'produsen');
    // if (existingFilePerbaikan) {
    //   return res.status(400).send({
    //     message: "File with this name already exists in database!"
    //   });
    // }

    //console.log(req.body.kategori);
    // Create a Tutorial
    //console.log(objectValue.waktuDatang);
    let user = await User.findOne({
      where: {
        uuid: objectValue.user.uuid,
      },
    });

    let tematik = await Tematik.findOne({
      where: {
        uuid: objectValue.tematik.uuid,
      },
    });

    const data = {
      uuid: uuidv4(),
      deskripsi: objectValue.deskripsi,
      pdfname: req.files[0].filename,
      metadatafilename: req.files[1].filename,
      filename: req.files[2].filename,
      tematikId: tematik.id,
      userId: user.id,
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
                  attributes: ["id", "name", "is_series"],
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
  dataProdusen
    .findAll({
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
          attributes: ["id", "name", "is_series"],
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
        message: err.message || "Some error occurred while retrieving lokasi.",
      });
    });
};

exports.findAllProdusenUser = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  console.log(`Called findAllProdusenUser with uuid: ${uuid}`);

  try {
    const us = await User.findOne({ where: { uuid: uuid } });

    if (!us) {
      console.log(`User with uuid ${uuid} not found.`);
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    console.log(`User found: id=${us.id}, username=${us.username}`);

    const user_bpkh = await us.getProdusens();
    console.log("Associated Produsens:", user_bpkh.map(p => ({ id: p.id, name: p.name })));

    if (!user_bpkh || user_bpkh.length === 0) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    const produsen = await Produsen.findByPk(user_bpkh[0].id);

    if (!produsen) {
      console.log(`Produsen with ID ${user_bpkh[0].id} not found.`);
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    const tema = await Tematik.findAll({ where: { produsenId: produsen.id } });
    const tematiks = tema.map(t => t.id);

    if (tematiks.length === 0) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    let whereCondition = {
      tematikId: {
        [Op.or]: tematiks,
      }
    };

    if (keyword && keyword.trim() !== "") {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { deskripsi: { [Op.iLike]: `%${keyword}%` } },
          { '$tematik.name$': { [Op.iLike]: `%${keyword}%` } }
        ]
      };
    }

    const { count, rows } = await dataProdusen.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: Tematik,
          as: "tematik",
          include: [
            { model: Produsen, as: "produsen", attributes: ["id", "name"] }
          ],
          attributes: ["id", "name", "is_series"]
        }
      ],
      attributes: [
        "id", "uuid", "deskripsi", "pdfname", "filename",
        "metadatafilename", "createdAt"
      ],
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["createdAt", "DESC"]]
    });

    return res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(size)),
      currentPage: parseInt(page)
    });

  } catch (err) {
    console.error("Error in findAllProdusenUser:", err);
    res.status(500).send({ message: err.message || "Internal server error." });
  }
};

exports.findAllProdusen = async (req, res) => {
  const uuid = req.params.uuid;
  const { page = 0, size = 10, keyword = "" } = req.query;

  try {
    const produsen = await Produsen.findOne({ where: { uuid: uuid } });

    if (!produsen) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    const tema = await Tematik.findAll({ where: { produsenId: produsen.id } });
    const tematiks = tema.map(t => t.id);

    if (tematiks.length === 0) {
      return res.send({
        records: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: parseInt(page)
      });
    }

    let whereCondition = {
      tematikId: {
        [Op.or]: tematiks,
      }
    };

    if (keyword && keyword.trim() !== "") {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { deskripsi: { [Op.iLike]: `%${keyword}%` } },
          { '$tematik.name$': { [Op.iLike]: `%${keyword}%` } }
        ]
      };
    }

    const { count, rows } = await dataProdusen.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: "user", attributes: ["id", "username"] },
        {
          model: Tematik,
          as: "tematik",
          include: [
            { model: Produsen, as: "produsen", attributes: ["id", "name"] }
          ],
          attributes: ["id", "name", "is_series"]
        }
      ],
      attributes: [
        "id", "uuid", "deskripsi", "pdfname", "filename",
        "metadatafilename", "createdAt"
      ],
      limit: parseInt(size),
      offset: parseInt(page) * parseInt(size),
      order: [["createdAt", "DESC"]]
    });

    return res.send({
      records: rows,
      totalItems: count,
      totalPages: Math.ceil(count / parseInt(size)),
      currentPage: parseInt(page)
    });

  } catch (err) {
    console.error("Error in findAllProdusen:", err);
    res.status(500).send({ message: err.message || "Internal server error." });
  }
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
                  attributes: ["id", "name", "is_series"],
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

exports.downloadReferensi = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const data = await dataProdusen.findOne({
      where: {
        uuid: uuid,
      },
    });
    
    if (!data) {
      return res.status(404).send({
        message: "Data not found",
      });
    }
    
    const fileName = data.pdfname;
    const directoryPath = __basedir + "/app/resources/static/assets/produsen/";
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

exports.downloadMetadata = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const data = await dataProdusen.findOne({
      where: {
        uuid: uuid,
      },
    });
    
    if (!data) {
      return res.status(404).send({
        message: "Data not found",
      });
    }
    
    const fileName = data.metadatafilename;
    const directoryPath = __basedir + "/app/resources/static/assets/produsen/";
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

exports.downloadFile = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const data = await dataProdusen.findOne({
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
    const directoryPath = __basedir + "/app/resources/static/assets/produsen/";
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
