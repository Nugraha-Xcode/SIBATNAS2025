const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;
/*
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
*/
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
/*
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "/path/to/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});
*/
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/resources/static/assets/provinsi/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-provinsi-${file.originalname}`);
  },
});

var uploadBukuTamu = multer({
  storage: storage,
  //fileFilter: imageFilter,
}).array("files");

//.single("documentFile");
let uploadFileMiddleware = util.promisify(uploadBukuTamu);
module.exports = uploadFileMiddleware;
