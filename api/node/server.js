/*
const { publishMetadata } = require("./app/utils/xml_to_csw");
global.__basedir = __dirname;
(async () => {
  try {
    const directoryPath = __basedir + "/app/resources/static/assets/publikasi/";
    const metadataPath = directoryPath + "sample.xml"; // Example file path
    const result = await publishMetadata(metadataPath);
  } catch (error) {
    console.error("Error in processing:", error);
  }
})();
return;

const {
  publishTableAsLayer,
  getUrlGeoserver,
} = require("./app/utils/postgis_to_geoserver");

(async () => {
  try {
    let urlGeoserver = await getUrlGeoserver(
      "RBI25K_TITIKKONTROLGEODESI_PT_25K"
    );
    // /reflect?layers=
    console.log(urlGeoserver);

    console.log("Get URL Geoserver processing completed.");
  } catch (error) {
    console.error("Error in URL Geoserver processing:", error);
  }
})();
return;
*/
/*const { importShapefileToPostGIS } = require("./shapefile_to_postgis");

const shapefileZipPath =
  "./app/resources/static/assets/produsen/ADMINISTRASI_AR_KECAMATAN.zip";

(async () => {
  try {
    await importShapefileToPostGIS(shapefileZipPath);
    console.log("Shapefile processing completed.");
  } catch (error) {
    console.error("Error in shapefile processing:", error);
  }
})();


const {
  activateLayer,
  listFeatureTypes,
  //publishTableAsLayer,
  publishFeatureStore,
} = require("./postgis_to_geoserver"); // Import the function
//const layerName = "ADMNISTRASI_AR_KECAMATAN";
const storeName = "palapa_spasial";
const tableName = "ADMNISTRASI_AR_KECAMATAN";

(async () => {
  try {
    //await activateLayer(layerName);
    await listFeatureTypes(storeName);
    //await publishTableAsLayer(tableName);
    //await publishFeatureStore(tableName);

    console.log("Layer publishing completed.");
  } catch (error) {
    console.error("Error in layer publishing:", error);
  }
})();

return;
*/
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
var bcrypt = require("bcryptjs");
const db = require("./app/models");
const Op = db.Sequelize.Op;

global.__basedir = __dirname;

const app = express();

var corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:3008"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
/*
//production
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
    //initial();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
*/
//development
/*
db.sequelize
  .sync({
    //force: true,
    alter: true,
  })
  .then(() => {
    console.log("Drop and Resync Db");
    //initial();
  });
*/
const Role = db.role;
const User = db.user;
function initial() {
  Role.create({
    id: 1,
    name: "admin",
  }).then((role) => {
    console.log(role);
    User.create({
      uuid: uuidv4(),
      username: "admin",
      email: "emhayusa@gmail.com",
      password: bcrypt.hashSync("12345678", 8),
    })
      .then((user) => {
        Role.findAll({
          where: {
            name: {
              [Op.or]: ["admin"],
            },
          },
        }).then((roles) => {
          console.log(roles);
          user.setRoles(roles).then(() => {
            console.log("Admin was registered successfully!");
          });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
  Role.create({
    id: 2,
    name: "walidata",
  });
  Role.create({
    id: 3,
    name: "walidata_pendukung",
  });
  Role.create({
    id: 4,
    name: "produsen",
  });
  Role.create({
    id: 5,
    name: "eksternal",
  });
}

// simple route
app.get("/api/", (req, res) => {
  //run();
  res.json({ message: "Welcome to SIKAMBING API." });
});

//routes
require("./app/routes/aktifitasUnduh.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/data-produsen.routes")(app);
require("./app/routes/data-perbaikan-produsen.routes")(app);
require("./app/routes/data-pemeriksaan.routes")(app);
require("./app/routes/data-publikasi.routes")(app);
require("./app/routes/eksternal.routes")(app);
require("./app/routes/eksternal-user.routes")(app);
require("./app/routes/kategoriTematik.routes")(app);
require("./app/routes/mekanismeEksternal.routes")(app);
require("./app/routes/notifikasi.routes")(app);
require("./app/routes/provinsi.routes")(app);
require("./app/routes/produsen.routes")(app);
require("./app/routes/produsen-user.routes")(app);
require("./app/routes/region.routes")(app);
require("./app/routes/statusPemeriksaan.routes")(app);
require("./app/routes/tematik.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/geoserver.routes")(app);
require("./app/routes/verify.routes")(app);
require("./app/routes/setting.routes")(app);
require("./app/routes/keywords.routes")(app);
require("./app/routes/publikasi_csw.routes")(app);
require("./app/routes/statistik.routes")(app);
require("./app/routes/record.routes")(app);

//run();
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
