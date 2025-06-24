const db = require("../models");
const Berita = db.berita;
const { v4: uuidv4 } = require("uuid");
const Op = db.Sequelize.Op;
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__basedir, "/app/resources/static/assets/berita/");

// Create and Save new Berita
exports.create = async (req, res) => {
  try {
    if (!req.body.judul || !req.body.konten || !req.body.kategori) {
      return res.status(400).send({
        message: "Judul, konten, dan kategori tidak boleh kosong!",
      });
    }

    let gambarPath = null;

    if (req.file) {
      console.log("File received:", req.file.originalname);
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}${ext}`;

      gambarPath = `/api/berita/image/${filename}`;

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Tulis file dari buffer ke disk
      const targetPath = path.join(uploadDir, filename);
      fs.writeFileSync(targetPath, req.file.buffer);
      console.log("File saved to:", targetPath);
    }

    const user = await db.user.findOne({ where: { uuid: req.userId } });
    if (!user) {
      return res.status(400).send({ message: "User tidak ditemukan!" });
    }

    const berita = {
      uuid: uuidv4(),
      judul: req.body.judul,
      konten: req.body.konten,
      kategori: req.body.kategori,
      gambar: gambarPath,
      userId: user.id,
    };

    const data = await Berita.create(berita);
    res.send(data);
  } catch (err) {
    console.error("Error creating berita:", err);
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat membuat berita.",
    });
  }
};

// Retrieve all Berita (Protected - requires auth) - dengan user info untuk admin
exports.findAll = (req, res) => {
  const { kategori } = req.query;
  const condition = kategori ? { kategori: { [Op.like]: `%${kategori}%` } } : null;

  Berita.findAll({
    where: condition,
    order: [['createdAt', 'DESC']],
    include: ["user"] // Include user info untuk admin
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Terjadi kesalahan saat mengambil berita.",
      });
    });
};

// Retrieve all Public Berita (tanpa auth dan tanpa user info)
exports.findAllPublic = (req, res) => {
  console.log("Public berita endpoint hit"); // Debug log

  try {
    Berita.findAll({
      attributes: ['id', 'uuid', 'judul', 'konten', 'kategori', 'gambar', 'createdAt', 'updatedAt', 'userId'],
      order: [['createdAt', 'DESC']]
      // Tidak include user untuk endpoint public
    })
      .then((data) => {
        console.log(`Found ${data.length} berita records`); // Debug log

        // Format data untuk frontend tanpa user info
        const formattedData = data.map(berita => ({
          uuid: berita.uuid,
          judul: berita.judul,
          konten: berita.konten,
          kategori: berita.kategori,
          gambar: berita.gambar,
          createdAt: berita.createdAt,
          updatedAt: berita.updatedAt
          // Tidak sertakan userId atau user info untuk public
        }));

        res.status(200).json(formattedData);
      })
      .catch((err) => {
        console.error("Database error in findAllPublic:", err);
        res.status(500).send({
          message: err.message || "Terjadi kesalahan saat mengambil berita public.",
        });
      });
  } catch (err) {
    console.error("Error in findAllPublic:", err);
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat mengambil berita public.",
    });
  }
};

// Find a single Berita with uuid - PERBAIKAN: gunakan where clause dengan uuid
exports.findOne = (req, res) => {
  const uuid = req.params.uuid;

  Berita.findOne({
    where: { uuid: uuid },
    include: ["user"]
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan Berita dengan uuid=${uuid}.`,
        });
      }
    })
    .catch((err) => {
      console.error("Error finding berita:", err);
      res.status(500).send({
        message: "Error mengambil Berita dengan uuid=" + uuid,
      });
    });
};

// Find a single Public Berita with uuid (tanpa auth) - BARU
exports.findOnePublic = (req, res) => {
  const uuid = req.params.uuid;
  console.log(`Public berita detail endpoint hit for uuid: ${uuid}`); // Debug log

  try {
    Berita.findOne({
      where: { uuid: uuid },
      attributes: ['id', 'uuid', 'judul', 'konten', 'kategori', 'gambar', 'createdAt', 'updatedAt', 'userId']
      // Tidak include user untuk endpoint public
    })
      .then((data) => {
        if (data) {
          console.log(`Found berita: ${data.judul}`); // Debug log

          // Format data untuk frontend tanpa user info
          const formattedData = {
            uuid: data.uuid,
            judul: data.judul,
            konten: data.konten,
            kategori: data.kategori,
            gambar: data.gambar,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };

          res.status(200).json(formattedData);
        } else {
          res.status(404).send({
            message: `Tidak dapat menemukan Berita dengan uuid=${uuid}.`,
          });
        }
      })
      .catch((err) => {
        console.error("Database error in findOnePublic:", err);
        res.status(500).send({
          message: err.message || "Terjadi kesalahan saat mengambil detail berita public.",
        });
      });
  } catch (err) {
    console.error("Error in findOnePublic:", err);
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat mengambil detail berita public.",
    });
  }
};

// Update a Berita by the uuid in the request - PERBAIKAN: gunakan where clause dengan uuid
exports.update = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    // Ambil data berita lama - PERBAIKAN: gunakan findOne dengan where clause
    const oldBerita = await Berita.findOne({ where: { uuid: uuid } });
    if (!oldBerita) {
      return res.status(404).send({
        message: `Berita dengan uuid=${uuid} tidak ditemukan.`,
      });
    }

    let gambarPath = oldBerita.gambar; // keep existing image by default

    // Jika ada file gambar baru yang diupload
    if (req.file) {
      console.log("New file received:", req.file.originalname);
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}${ext}`;
      gambarPath = `/api/berita/image/${filename}`;

      // Buat direktori jika belum ada
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Tulis file dari buffer ke disk
      const targetPath = path.join(uploadDir, filename);
      fs.writeFileSync(targetPath, req.file.buffer);
      console.log("File saved to:", targetPath);

      // Delete old image if exists
      if (oldBerita.gambar && oldBerita.gambar.includes('/api/berita/image/')) {
        const oldFilename = oldBerita.gambar.split('/').pop();
        const oldImagePath = path.join(uploadDir, oldFilename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        }
      }
    }

    const beritaData = {
      judul: req.body.judul || oldBerita.judul,
      konten: req.body.konten || oldBerita.konten,
      kategori: req.body.kategori || oldBerita.kategori,
      gambar: gambarPath,
    };

    const [num] = await Berita.update(beritaData, {
      where: { uuid: uuid }, // PERBAIKAN: gunakan uuid bukan id
    });

    if (num == 1) {
      res.send({
        message: "Berita berhasil diperbarui.",
      });
    } else {
      res.send({
        message: `Tidak dapat memperbarui Berita dengan uuid=${uuid}. Mungkin Berita tidak ditemukan atau req.body kosong!`,
      });
    }
  } catch (err) {
    console.error("Error updating berita:", err);
    res.status(500).send({
      message: "Error memperbarui Berita dengan uuid=" + req.params.uuid,
    });
  }
};

// Delete a Berita with the specified uuid in the request - PERBAIKAN: gunakan where clause dengan uuid
exports.delete = async (req, res) => {
  try {
    const uuid = req.params.uuid;

    console.log(`Attempting to delete berita with uuid: ${uuid}`); 

    const berita = await Berita.findOne({ where: { uuid: uuid } });
    if (!berita) {
      return res.status(404).send({
        message: `Berita dengan uuid=${uuid} tidak ditemukan!`,
      });
    }

    // Delete image file if exists
    if (berita.gambar && berita.gambar.includes('/api/berita/image/')) {
      const filename = berita.gambar.split('/').pop();
      const imagePath = path.join(uploadDir, filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", imagePath);
      }
    }

    // Delete berita record - PERBAIKAN: gunakan uuid bukan id
    const num = await Berita.destroy({
      where: { uuid: uuid },
    });

    if (num == 1) {
      console.log(`Successfully deleted berita with uuid: ${uuid}`);
      res.send({
        message: "Berita berhasil dihapus!",
      });
    } else {
      res.send({
        message: `Tidak dapat menghapus Berita dengan uuid=${uuid}. Mungkin Berita tidak ditemukan!`,
      });
    }
  } catch (err) {
    console.error("Error deleting berita:", err);
    res.status(500).send({
      message: "Tidak dapat menghapus Berita dengan uuid=" + req.params.uuid,
    });
  }
};