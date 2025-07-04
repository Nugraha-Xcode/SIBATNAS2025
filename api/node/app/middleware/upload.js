const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
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

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}-palapa-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter }).single(
  "file"
);
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
