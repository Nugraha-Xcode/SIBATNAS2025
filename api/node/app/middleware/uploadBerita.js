const multer = require("multer");

// Gunakan memory storage untuk menyimpan file di memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("File filter - mimetype:", file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

const uploadBerita = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = uploadBerita;