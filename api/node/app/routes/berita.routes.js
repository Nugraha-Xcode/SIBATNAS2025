const { authJwt } = require("../middleware");
const controller = require("../controllers/berita.controller");
const upload = require("../middleware/uploadBerita");
const path = require('path');
const fs = require('fs');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/berita/public", controller.findAllPublic);

  app.get("/api/berita/public/:uuid", controller.findOnePublic);

  app.get('/api/berita/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__basedir, '/app/resources/static/assets/berita/', filename);

    console.log(`Requested image: ${filename}`);
    console.log(`Image path: ${imagePath}`);

    if (fs.existsSync(imagePath)) {
      console.log('Image found, serving file');
      res.sendFile(imagePath);
    } else {
      console.log('Image not found');
      res.status(404).send('Image not found');
    }
  });

  app.post(
    "/api/berita",
    [authJwt.verifyToken, authJwt.isAdmin],
    upload.single("gambar"),
    controller.create
  );

  app.get(
    "/api/berita",
    [authJwt.verifyToken],
    controller.findAll
  );

  app.get(
    "/api/berita/:uuid",
    [authJwt.verifyToken],
    controller.findOne
  );

  app.put(
    "/api/berita/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    upload.single("gambar"),
    controller.update
  );

  app.delete(
    "/api/berita/:uuid",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};