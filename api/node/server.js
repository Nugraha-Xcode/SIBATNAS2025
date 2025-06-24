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
const storeName = "sibatnas_spasial";
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
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
var bcrypt = require("bcryptjs");
const db = require("./app/models");
const Op = db.Sequelize.Op;
const axios = require("axios");

global.__basedir = __dirname;

const app = express();

var corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:3008", "http://localhost", "http://10.10.171.9/8081", "http://10.10.171.9", "http://10.10.171.9/main", "https://stage-sibatnas.big.go.id", "https://tanahair.indonesia.go.id"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Geoserver configuration from environment variables
const geoserverConfig = {
  host: process.env.GEOSERVER_HOST || 'http://geoserver',
  port: process.env.GEOSERVER_PORT || '81',
  workspace: process.env.GEOSERVER_WORKSPACE || 'sibatnas',
  store: process.env.GEOSERVER_STORE || 'sibatnas_geodb',
  user: process.env.GEOSERVER_USER || 'admin',
  pass: process.env.GEOSERVER_PASS || 'P@5W0rdGeO0'
};

async function waitForPostgresReady(maxAttempts = 10, delayMs = 3000) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await db.sequelize.authenticate();
      console.log("Database connection is ready.");
      return true;
    } catch (error) {
      console.log(`Database not ready (attempt ${attempts + 1}/${maxAttempts})...`);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    attempts++;
  }
  console.error("PostgreSQL not ready after maximum attempts.");
  return false;
}

async function waitForGeoServerReady(maxAttempts = 10, delayMs = 5000) {
  const url = `${geoserverConfig.host}:${geoserverConfig.port}/geoserver/rest/workspaces`;
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(url, {
        auth: {
          username: geoserverConfig.user,
          password: geoserverConfig.pass
        }
      });
      if (response.status === 200) {
        console.log("GeoServer is ready.");
        return true;
      }
    } catch (err) {
      console.log(`GeoServer not ready (attempt ${attempts + 1}/${maxAttempts}), retrying...`);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    attempts++;
  }
  console.error("GeoServer not ready after maximum attempts.");
  return false;
}


// Function to check if admin role exists
async function checkAdminRoleExists() {
  try {
    const adminRole = await db.role.findOne({ where: { name: "admin" } });
    return !!adminRole;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

// Function to check if admin user exists
async function checkAdminUserExists() {
  try {
    const adminUser = await db.user.findOne({ where: { username: "admin" } });
    return !!adminUser;
  } catch (error) {
    console.error("Error checking admin user:", error);
    return false;
  }
}

// Function to check if status pemeriksaan entries exist
async function checkStatusPemeriksaanExists() {
  try {
    const count = await db.statusPemeriksaan.count();
    return count > 0;
  } catch (error) {
    console.error("Error checking status pemeriksaan:", error);
    return false;
  }
}

// Function to check if GeoServer workspace exists
async function checkGeoServerWorkspaceExists() {
  try {
    const url = `${geoserverConfig.host}:${geoserverConfig.port}/geoserver/rest/workspaces/${geoserverConfig.workspace}`;
    const response = await axios.get(url, {
      auth: {
        username: geoserverConfig.user,
        password: geoserverConfig.pass
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error checking GeoServer workspace:", error);
    return false;
  }
}

// Function to check if GeoServer store exists
async function checkGeoServerStoreExists() {
  try {
    const url = `${geoserverConfig.host}:${geoserverConfig.port}/geoserver/rest/workspaces/${geoserverConfig.workspace}/datastores/${geoserverConfig.store}`;
    const response = await axios.get(url, {
      auth: {
        username: geoserverConfig.user,
        password: geoserverConfig.pass
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error checking GeoServer store:", error);
    return false;
  }
}

// Function to create GeoServer workspace if it doesn't exist
async function createGeoServerWorkspace() {
  try {
    const url = `${geoserverConfig.host}:${geoserverConfig.port}/geoserver/rest/workspaces`;
    await axios.post(url, 
      { workspace: { name: geoserverConfig.workspace } },
      {
        auth: {
          username: geoserverConfig.user,
          password: geoserverConfig.pass
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`GeoServer workspace '${geoserverConfig.workspace}' created successfully.`);
    return true;
  } catch (error) {
    console.error("Error creating GeoServer workspace:", error);
    return false;
  }
}

// Function to create GeoServer store if it doesn't exist
async function createGeoServerStore() {
  try {
    const url = `${geoserverConfig.host}:${geoserverConfig.port}/geoserver/rest/workspaces/${geoserverConfig.workspace}/datastores`;
    
    // Configuration for PostGIS datastore
    const datastoreConfig = {
      dataStore: {
        name: geoserverConfig.store,
        connectionParameters: {
          entry: [
            { '@key': 'host', $: 'db-spasial' },
            { '@key': 'port', $: '5432' },
            { '@key': 'database', $: process.env.GEOSERVER_STORE || 'sibatnas_geodb' },
            { '@key': 'user', $: 'postgres' },
            { '@key': 'passwd', $: process.env.DB_SPASIAL_CONNECTION_PASSWORD || 'postgr35' },
            { '@key': 'dbtype', $: 'postgis' },
            { '@key': 'schema', $: 'public' }
          ]
        }
      }
    };
    
    await axios.post(url, datastoreConfig, {
      auth: {
        username: geoserverConfig.user,
        password: geoserverConfig.pass
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`GeoServer store '${geoserverConfig.store}' created successfully.`);
    return true;
  } catch (error) {
    console.error("Error creating GeoServer store:", error);
    return false;
  }
}

// Modified seedAdminUser function to check if roles and user exist first
async function seedAdminUser() {
  const adminRoleExists = await checkAdminRoleExists();
  const adminUserExists = await checkAdminUserExists();
  
  if (adminRoleExists) {
    console.log("Admin role already exists, skipping creation.");
  } else {
    await db.role.create({
      id: 1,
      name: "admin",
    });
    console.log("Admin role created successfully.");
  }
  
  if (adminUserExists) {
    console.log("Admin user already exists, skipping creation.");
  } else {
    if (!adminRoleExists) {
      // If we just created the admin role, we need to get it
      const adminRole = await db.role.findOne({ where: { name: "admin" } });
      
      const user = await db.user.create({
        uuid: uuidv4(),
        username: "admin",
        email: "emhayusa@gmail.com",
        password: bcrypt.hashSync("12345678", 8),
      });
      
      await user.setRoles([adminRole]);
      console.log("Admin user was registered successfully!");
    }
  }
  
  // Create other roles if they don't exist
  const roles = [
    { id: 2, name: "walidata" },
    { id: 3, name: "walidata_pendukung" },
    { id: 4, name: "produsen" },
    { id: 5, name: "eksternal" }
  ];
  
  for (const role of roles) {
    const exists = await db.role.findOne({ where: { name: role.name } });
    if (!exists) {
      await db.role.create(role);
      console.log(`Role ${role.name} created successfully.`);
    } else {
      console.log(`Role ${role.name} already exists, skipping creation.`);
    }
  }
}

// Modified seedStatusPemeriksaan function to check if entries exist first
async function seedStatusPemeriksaan() {
  const statusExists = await checkStatusPemeriksaanExists();
  
  if (statusExists) {
    console.log("Status pemeriksaan entries already exist, skipping creation.");
    return;
  }
  
  const statuses = [
    { id: 1, uuid: uuidv4(), name: "Belum Diperiksa" },
    { id: 2, uuid: uuidv4(), name: "Sudah Diperiksa - Perlu Perbaikan" },
    { id: 3, uuid: uuidv4(), name: "Sudah Diperiksa - Siap Publikasi" }
  ];
  
  for (const status of statuses) {
    await db.statusPemeriksaan.create(status);
  }
  
  console.log("Status pemeriksaan entries created successfully.");
}

// Function to setup GeoServer
async function setupGeoServer() {
  const workspaceExists = await checkGeoServerWorkspaceExists();
  
  if (!workspaceExists) {
    console.log(`GeoServer workspace '${geoserverConfig.workspace}' does not exist, creating...`);
    await createGeoServerWorkspace();
  } else {
    console.log(`GeoServer workspace '${geoserverConfig.workspace}' already exists, skipping creation.`);
  }
  
  const storeExists = await checkGeoServerStoreExists();
  
  if (!storeExists) {
    console.log(`GeoServer store '${geoserverConfig.store}' does not exist, creating...`);
    await createGeoServerStore();
  } else {
    console.log(`GeoServer store '${geoserverConfig.store}' already exists, skipping creation.`);
  }
}

// Initialize the application
async function initializeApp() {
  try {
    const dbReady = await waitForPostgresReady();
    if (!dbReady) {
      console.error("Inisialisasi dibatalkan karena database tidak siap.");
      return;
    }

    await db.sequelize.sync();
    console.log("Database tersinkronisasi.");

    await seedAdminUser();
    await seedStatusPemeriksaan();

    const geoReady = await waitForGeoServerReady();
    if (geoReady) {
      await setupGeoServer();
    } else {
      console.warn("GeoServer tidak siap, konfigurasi dilewati.");
    }

    console.log("Inisialisasi aplikasi selesai.");
  } catch (err) {
    console.error("Gagal inisialisasi aplikasi:", err.message);
  }
}

// Call the initialization function
//initializeApp();

// simple route
app.get("/api/", (req, res) => {
  res.json({ message: "Welcome to SIBATNAS API." });
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
require("./app/routes/siteSetting.routes")(app);
require("./app/routes/setting.routes")(app);
require("./app/routes/keywords.routes")(app);
require("./app/routes/publikasi_csw.routes")(app);
require("./app/routes/statistik.routes")(app);
require("./app/routes/record.routes")(app);
require("./app/routes/panduan.routes")(app);
require("./app/routes/berita.routes")(app);
require("./app/routes/visitor.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
