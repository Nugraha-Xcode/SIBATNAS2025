const db = require("../models");
const config = require("../config/api.config");
const axios = require("axios");

const recordCsw = db.record;
const dataPublikasi = db.dataPublikasi;
const Tematik = db.tematik;
const User = db.user;
const notifikasi = db.notifikasi;
const aktifitasUnduh = db.aktifitasUnduh;

const { Op, fn, col, where } = require("sequelize");


const { v4: uuidv4 } = require("uuid");
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.kode && !req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const input = {
    uuid: uuidv4(),
    name: req.body.name,
  };

  // Save Tutorial in the database
  recordCsw
    .create(input)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findKategoriById = (id) => {
  return recordCsw
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
  recordCsw
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
  recordCsw
    .findAll({
      order: [["name", "ASC"]],
      attributes: [
        "identifier",
        "title",
        "abstract",
        "insert_date",
        "date_publication",
        "type",
        "keywords",
        "organization",
        "links",
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

exports.findAllPublikPaginated = (req, res) => {
  // Get pagination param
  const { page = 0, size = 20, keyword = "" } = req.query;
  const pageInt = parseInt(page);
  const sizeInt = parseInt(size);
  const offset = pageInt * sizeInt;
  const limit = sizeInt;

  // Where condition for keywords and identifier
  const condition = keyword
  ? {
      [Op.or]: [
        {
          keywords: {
            [Op.iLike]: `%${keyword}%`
          }
        },
        {
          identifier: {
            [Op.iLike]: `%${keyword}%`
          }
        }
      ]
    }
  : {};


  // Get total count first for pagination metadata
  recordCsw
    .count({ where: condition })
    .then(totalItems => {
      // Then get paginated data
      recordCsw
        .findAll({
          where: condition,
          order: [["title", "ASC"]],
          attributes: [
            "identifier",
            "title",
            "abstract",
            "insert_date",
            "date_publication",
            "type",
            "keywords",
            "organization",
            "links",
          ],
          include: [
            {
              model: dataPublikasi,
              as: "dataPublikasi",
              attributes: ["uuid", "is_public", "filename"],
            },
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
            message: err.message || "Some error occurred while retrieving Record.",
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
  recordCsw
    .findAll({
      order: [["title", "ASC"]],
      attributes: [
        "identifier",
        "title",
        "abstract",
        "insert_date",
        "date_publication",
        "type",
        "keywords",
        "organization",
        "links",
      ],
      include: [
        {
          model: dataPublikasi,
          as: "dataPublikasi",
          attributes: ["uuid","is_public", "filename"],
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Record.",
      });
    });
};

// Update a Kategori by the id in the request
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  recordCsw
    .findOne({
      where: {
        uuid: uuid,
      },
    })
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({ message: "Kategori Not found." });
      } else {
        recordCsw
          .update(req.body, {
            where: { id: data.id },
          })
          .then((num) => {
            if (num == 1) {
              recordCsw
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
exports.delete = async (req, res) => {
  const identifier = req.params.identifier;

  console.log("[DELETE] Request received for identifier:", identifier);
  console.log("[DELETE] User UUID from body:", req.body.uuid);

  if (!req.body.uuid) {
    console.warn("[DELETE] User UUID is missing in request body.");
    return res.status(400).send({
      message: "User UUID is required in the request body"
    });
  }

  try {
    const deleted = await recordCsw.destroy({
      where: { identifier: identifier },
    });

    console.log("[DELETE] recordCsw deleted count:", deleted);

    if (deleted !== 1) {
      console.warn("[DELETE] Record not found or already deleted:", identifier);
      return res.send({
        message: `Cannot delete Record with identifier=${identifier}. Maybe Record was not found!`,
      });
    }

    const update = { identifier: null };
    const updated = await dataPublikasi.update(update, {
      where: { identifier: identifier },
    });

    console.log("[DELETE] dataPublikasi update count:", updated[0]);

    if (updated[0] !== 1) {
      console.warn("[DELETE] DataPublikasi update failed for identifier:", identifier);
      return res.send({
        message: `Cannot update Data Publikasi with identifier=${identifier}. Maybe Data Publikasi was not found or req.body is empty!`,
      });
    }

    const publikasi = await dataPublikasi.findOne({
      where: { identifier: null },
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: Tematik,
          as: "tematik",
          attributes: ["name"],
        },
      ],
    });

    console.log("[DELETE] Fetched latest publikasi with identifier=null:", publikasi?.uuid);

    if (!publikasi) {
      console.warn("[DELETE] No publikasi found after identifier null update.");
      return res.status(404).send({
        message: "Data publikasi tidak ditemukan.",
      });
    }

    const user = await User.findOne({
      where: { uuid: req.body.uuid }
    });

    if (!user) {
      console.warn("[DELETE] User not found for UUID:", req.body.uuid);
      return res.status(404).send({ message: "User not found" });
    }

    console.log("[DELETE] User who deleted the record:", user.username);

    const users = await User.findAll({ attributes: ["id"] });

    console.log("[DELETE] Total users to notify:", users.length);

    for (let i = 0; i < users.length; i++) {
      const notif = {
        uuid: uuidv4(),
        waktuKirim: new Date(),
        subjek: "Publikasi metadata IGT - " + publikasi.tematik.name + " telah di-unpublish",
        pesan:
          "Publikasi metadata IGT " +
          publikasi.deskripsi +
          " telah di-unpublish oleh " +
          (user?.username || "sistem"),
        sudahBaca: false,
        userId: users[i].id,
      };

      await notifikasi.create(notif);
      console.log(`[DELETE] Notification sent to user ID: ${users[i].id}`);
    }

    res.send({
      message: "Record was deleted successfully!",
    });
  } catch (err) {
    console.error("[DELETE] Unexpected error:", err);
    res.status(500).send({
      message: "Terjadi kesalahan saat menghapus data dengan identifier=" + identifier,
    });
  }
};


exports.countAll = (req, res) => {
  recordCsw
    .count()
    .then((count) => {
      res.send({ count });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while counting Record.",
      });
    });
};

exports.unduhPublik = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    const data = await dataPublikasi.findOne({ where: { uuid } });
    if (!data) return res.status(404).send({ message: "Data not found" });

    const record = await recordCsw.findOne({ where: { identifier: data.identifier } });
    if (!record || !record.links) {
      return res.status(404).send({ message: "Record or link information not found" });
    }

    // Parse link format
    const linkParts = record.links.split(',');
    if (linkParts.length < 4) {
      return res.status(400).send({ message: "Invalid link format in record" });
    }

    const nameLayerPart = linkParts[0];
    const protocol = linkParts[2].trim();
    const originalUrl = linkParts[3].trim();

    const layerInfo = nameLayerPart.includes(':') ? nameLayerPart.split(':') : [null, nameLayerPart];
    const workspace = layerInfo[0];
    const layerName = layerInfo[1];

    console.log("Debug Info:");
    console.log(`Workspace: ${workspace}`);
    console.log(`Layer: ${layerName}`);
    console.log(`Protocol: ${protocol}`);
    console.log(`Original URL: ${originalUrl}`);

    if (!workspace || !layerName) {
      return res.status(400).send({ message: "Unable to extract workspace and layer information" });
    }

    // Tentukan baseGeoserverUrl berdasarkan apakah localhost atau bukan
    let baseGeoserverUrl;
    const geoserverHost = originalUrl.split('/geoserver')[0];

    if (geoserverHost.includes('localhost')) {
      baseGeoserverUrl = 'http://geoserver:8080/geoserver';
    } else {
      baseGeoserverUrl = geoserverHost + '/geoserver';
    }

    console.log(`Base Geoserver URL: ${baseGeoserverUrl}`);

    switch (protocol) {
      case 'OGC:WFS':
        outputFormat = 'shape-zip';
        downloadUrl = `${baseGeoserverUrl}/${workspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=${outputFormat}`;
        break;

      case 'OGC:WCS':
        outputFormat = 'geotiff';
        downloadUrl = `${baseGeoserverUrl}/${workspace}/ows?service=WCS&version=2.0.1&request=GetCoverage&coverageId=${workspace}:${layerName}&format=${outputFormat}`;
        break;

      case 'OGC:WMS':
        outputFormat = 'shape-zip';
        downloadUrl = `${baseGeoserverUrl}/${workspace}/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=${outputFormat}`;
        break;

      default:
        return res.status(400).send({
          message: `Unsupported protocol: ${protocol}. Only OGC:WFS, OGC:WCS, and OGC:WMS are supported.`,
        });
    }

    console.log(`Generated download URL: ${downloadUrl}`);

    const aktivitas = await aktifitasUnduh.create({
      uuid: uuidv4(),
      wilayah: "-",
      wilayahName: "-",
      waktuMulai: new Date(),
      status: "processing",
      dataPublikasiId: data.id,
    });

    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
      timeout: 60000,
    });

    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${layerName}.${outputFormat === 'shape-zip' ? 'zip' : 'tiff'}`;

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', response.headers['content-type']);

    await aktifitasUnduh.update(
      { status: "done", waktuSelesai: new Date() },
      { where: { uuid: aktivitas.uuid } }
    );

    response.data.pipe(res);
    response.data.on('error', (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).send({ message: "Streaming error: " + err.message });
      }
    });

  } catch (error) {
    console.error("Unduh error:", error.message);
    if (error.response) {
      res.status(error.response.status).send({
        message: `Geoserver error (${error.response.status}): ${error.message}`,
      });
    } else {
      res.status(500).send({ message: "Download failed: " + error.message });
    }
  }
};
