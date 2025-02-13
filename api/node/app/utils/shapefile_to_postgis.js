const shapefile = require("shapefile");
const pgp = require("pg-promise")();
const path = require("path");
const AdmZip = require("adm-zip");
const fs = require("fs");

// Connect to your PostGIS database
const db = pgp({
  host: "db-spasial", //"db-spasial",
  port: 5432, //5432,
  database: "palapa_geodb",
  user: "postgres",
  password: "postgr35",
});

function extractShapefile(zipPath, extractTo) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, true);
  console.log(`Extracted ${zipPath} to ${extractTo}`);
}

async function importShapefileToPostGIS(zipPath) {
  try {
    const extractDir = path.join(__dirname, "temp");
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    // Extract ZIP file
    extractShapefile(zipPath, extractDir);

    // Find the main .shp file in the extracted directory
    const shpFile = fs
      .readdirSync(extractDir)
      .find((file) => file.endsWith(".shp"));
    if (!shpFile) {
      throw new Error("No .shp file found in the extracted ZIP.");
    }

    const shpPath = path.join(extractDir, shpFile);
    const shapefileName = path.basename(shpPath, ".shp");
    const tableName = pgp.as.name(shapefileName); // Sanitize table name

    // Create the table if it doesn't exist
    await db.none(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
          id SERIAL PRIMARY KEY,
          geom GEOMETRY(Geometry, 4326),
          properties JSONB
      );
    `);

    console.log(`Table "${shapefileName}" is ready.`);

    // Read Shapefile
    const source = await shapefile.open(shpPath);

    let record;
    while ((record = await source.read()) && !record.done) {
      const { geometry, properties } = record.value;

      // Insert into PostGIS
      await db.none(
        `
        INSERT INTO ${tableName} (geom, properties)
        VALUES (ST_GeomFromGeoJSON($1), $2)
      `,
        [JSON.stringify(geometry), properties]
      );
    }

    console.log(`Shapefile "${shapefileName}" imported successfully!`);

    // Clean up extracted files
    fs.rmSync(extractDir, { recursive: true, force: true });
    console.log("Temporary files cleaned up.");
  } catch (error) {
    console.error("Error importing Shapefile:", error);
  }
}

async function getTableName(zipPath) {
  try {
    const extractDir = path.join(__dirname, "temp");
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    // Extract ZIP file
    extractShapefile(zipPath, extractDir);

    // Find the main .shp file in the extracted directory
    const shpFile = fs
      .readdirSync(extractDir)
      .find((file) => file.endsWith(".shp"));
    if (!shpFile) {
      throw new Error("No .shp file found in the extracted ZIP.");
    }

    const shpPath = path.join(extractDir, shpFile);
    const shapefileName = path.basename(shpPath, ".shp");
    console.log(shapefileName);
    const tableName = pgp.as.name(shapefileName); // Sanitize table name
    console.log(tableName);
    fs.rmSync(extractDir, { recursive: true, force: true });
    console.log("Temporary files cleaned up.");
    return tableName;
  } catch (error) {
    console.error("Error importing Shapefile:", error);
  }
}
module.exports = {
  importShapefileToPostGIS,
  getTableName,
};
