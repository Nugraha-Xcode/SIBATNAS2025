const db = require("../models");
const { Sequelize, Op } = require('sequelize');
const dataPublikasiController = require('./dataPublikasi.controller');

// Tambahkan logging untuk debugging
console.log('Loaded DB Models:', Object.keys(db));

// Pastikan semua model diimpor
const {
  kategoriTematik,
  produsen,
  tematik,
  dataProdusen,
  dataPemeriksaan,
  dataPerbaikanProdusen,
  dataPublikasi,
  record,
  aktifitasUnduh,
  user
} = db;


const sequelize = db.sequelize;

const { v4: uuidv4 } = require("uuid");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
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
  kategoriTematik
    .create(input)
    .then((data) => {
      res.send(data);
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
exports.findAll = (req, res) => {
  kategoriTematik
    .findAll({
      order: [["name", "ASC"]],
      attributes: ["id", "name", "uuid"],
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
        kategoriTematik
          .update(req.body, {
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
// exports.delete = (req, res) => {
//   const uuid = req.params.uuid;

//   kategoriTematik
//     .destroy({
//       where: { uuid: uuid },
//     })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "Kategori was deleted successfully!",
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Kategori with uuid=${id}. Maybe Kategori was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Could not delete Kategori with id=" + id,
//       });
//     });
// };

exports.delete = async (req, res) => {
  const uuid = req.params.uuid;

  // Validasi jika sequelize tidak ditemukan
  if (!sequelize) {
    console.error('Sequelize is undefined');
    return res.status(500).send({
      message: "Database connection error: Sequelize not found"
    });
  }

  let t;
  try {
    // Membuat transaksi baru untuk memastikan operasi delete dilakukan secara atomik
    t = await sequelize.transaction();

    // Mengambil instance kategoriTematik berdasarkan uuid yang diberikan
    const kategoriTematikInstance = await kategoriTematik.findOne({
      where: { uuid: uuid },
      transaction: t
    });

    // Jika kategoriTematik tidak ditemukan, rollback transaksi dan kirimkan error
    if (!kategoriTematikInstance) {
      await t.rollback();
      return res.status(404).send({
        message: `Kategori dengan uuid=${uuid} tidak ditemukan!`
      });
    }

    // Menemukan semua produsen yang terkait dengan kategoriTematik ini
    const produsensInstances = await produsen.findAll({
      where: { kategoriTematikId: kategoriTematikInstance.id },
      transaction: t
    });

    // Mengambil semua produsenId dari hasil pencarian
    const produsenIds = produsensInstances.map(p => p.id);

    // Menemukan semua tematik yang terkait dengan produsenId
    const tematiksInstances = await tematik.findAll({
      where: { produsenId: { [Op.in]: produsenIds } },
      transaction: t
    });

    // Mengambil semua tematikId dari hasil pencarian
    const tematikIds = tematiksInstances.map(t => t.id);

    // Menemukan semua dataPublikasi yang terkait dengan tematikId
    const dataPublikasisInstances = await dataPublikasi.findAll({
      where: {
        [Op.or]: [
          { tematikId: { [Op.in]: tematikIds || [] } }
        ]
      },
      transaction: t
    });

    // Mencari user admin untuk melakukan proses unpublish
    const adminUser = await user.findOne({
      where: { username: 'admin' },
      transaction: t
    });

    // Jika user admin tidak ditemukan, rollback transaksi dan kirimkan error
    if (!adminUser) {
      await t.rollback();
      return res.status(404).send({
        message: "User admin tidak ditemukan!"
      });
    }

    // Melakukan unpublish untuk setiap publikasi yang terbit (is_published = true)
    for (const publikasi of dataPublikasisInstances) {
      if (publikasi.is_published) {
        // Membuat mock request dan response untuk memanggil fungsi unpublish
        await new Promise((resolve, reject) => {
          const mockReq = {
            params: { uuid: publikasi.uuid },
            body: { uuid: adminUser.uuid }
          };
          const mockRes = {
            send: (data) => resolve(data),
            status: (code) => ({
              send: (message) => reject(new Error(`Status ${code}: ${JSON.stringify(message)}`))
            })
          };

          dataPublikasiController.unpublish(mockReq, mockRes);
        });
      }
    }

    // Urutan penghapusan - mulai dari relasi yang paling bawah ke atas
    const deletionOrder = [
      // Menghapus dataPerbaikanProdusen yang terkait dengan dataPemeriksaan
      {
        model: dataPerbaikanProdusen,
        where: {
          dataPemeriksaanId: {
            [Op.in]: (await dataPemeriksaan.findAll({
              where: {
                dataProdusenId: {
                  [Op.in]: (await dataProdusen.findAll({
                    where: { tematikId: { [Op.in]: tematikIds || [] } },
                    transaction: t
                  })).map(dp => dp.id) || []
                }
              },
              transaction: t
            })).map(dp => dp.id) || []
          }
        }
      },
      // Menghapus aktifitasUnduh yang terkait dengan dataPublikasi
      {
        model: aktifitasUnduh,
        where: { dataPublikasiId: { [Op.in]: dataPublikasisInstances.map(dp => dp.id) || [] } }
      },
      // Menghapus record yang terkait dengan dataPublikasi berdasarkan identifier
      {
        model: record,
        where: {
          identifier: {
            [Op.in]: dataPublikasisInstances
              .filter(dp => dp.identifier)
              .map(dp => dp.identifier) || []
          }
        }
      },
      // Menghapus dataPublikasi yang terkait dengan tematikId
      {
        model: dataPublikasi,
        where: {
          tematikId: { [Op.in]: tematikIds || [] }
        }
      },
      // Menghapus dataPemeriksaan yang terkait dengan dataProdusen
      {
        model: dataPemeriksaan,
        where: {
          dataProdusenId: {
            [Op.in]: (await dataProdusen.findAll({
              where: { tematikId: { [Op.in]: tematikIds || [] } },
              transaction: t
            })).map(dp => dp.id) || []
          }
        }
      },
      // Menghapus dataProdusen yang terkait dengan tematikId
      {
        model: dataProdusen,
        where: { tematikId: { [Op.in]: tematikIds || [] } }
      },
      // Menghapus tematik yang terkait dengan produsenId
      {
        model: tematik,
        where: { produsenId: { [Op.in]: produsenIds || [] } }
      },
      // Menghapus produsen yang terkait dengan kategoriTematik
      {
        model: produsen,
        where: { kategoriTematikId: kategoriTematikInstance.id }
      },
      // Menghapus kategoriTematik itu sendiri
      {
        model: kategoriTematik,
        where: { uuid: uuid }
      }
    ];

    // Melakukan penghapusan sesuai urutan
    for (const deletion of deletionOrder) {
      // Lewati penghapusan jika kondisi tidak ada ID atau kosong
      if (Object.keys(deletion.where).some(key =>
        deletion.where[key][Op.in] && deletion.where[key][Op.in].length === 0
      )) continue;

      await deletion.model.destroy({
        where: deletion.where,
        transaction: t
      });
    }

    // Jika semua berhasil, commit transaksi
    await t.commit();

    return res.send({
      message: "Kategori berhasil dihapus beserta data terkait!",
      deletedUuid: uuid
    });

  } catch (error) {
    // Rollback transaksi jika terjadi error
    if (t) {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    console.error('Error penghapusan:', error);

    return res.status(500).send({
      message: "Tidak bisa menghapus Kategori dengan uuid=" + uuid,
      error: error.message
    });
  }
};
