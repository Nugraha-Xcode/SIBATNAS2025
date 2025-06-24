const shapefile = require("shapefile");
const pgp = require("pg-promise")();
const path = require("path");
const AdmZip = require("adm-zip");
const fs = require("fs");
const { unpublishLayer } = require("./postgis_to_geoserver");
const crypto = require("crypto");

// Connect to your PostGIS database
const db = pgp({
  host: "db-spasial",
  port: 5432,
  database: "sibatnas_geodb",
  user: "postgres",
  password: process.env.DB_SPASIAL_CONNECTION_PASSWORD,
});

function extractShapefile(zipPath, extractTo) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractTo, true);
  console.log(`Extracted ${zipPath} to ${extractTo}`);
}

// Fungsi untuk cleanup direktori temp yang tertinggal (jalankan periodic)
async function cleanupOldTempDirectories() {
  try {
    const baseDir = __dirname;
    const files = fs.readdirSync(baseDir);
    const tempDirs = files.filter(file => file.startsWith('temp_'));
    
    for (const tempDir of tempDirs) {
      const fullPath = path.join(baseDir, tempDir);
      try {
        const stat = fs.statSync(fullPath);
        const now = Date.now();
        const ageInMinutes = (now - stat.mtime.getTime()) / (1000 * 60);
        
        // Hapus direktori temp yang lebih dari 30 menit
        if (ageInMinutes > 30) {
          console.log(`Menghapus direktori temp lama: ${tempDir} (umur: ${Math.round(ageInMinutes)} menit)`);
          await cleanupDirectory(fullPath);
        }
      } catch (error) {
        console.warn(`Error saat cek direktori temp ${tempDir}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error dalam cleanup direktori temp lama:', error.message);
  }
}

// Jalankan cleanup otomatis setiap 15 menit
setInterval(cleanupOldTempDirectories, 15 * 60 * 1000);

// Fungsi helper untuk membuat direktori temp yang unik dan aman untuk multiple user
function createUniqueExtractDir() {
  const randomString = crypto.randomBytes(16).toString('hex'); // Lebih panjang untuk keamanan
  const timestamp = Date.now();
  const processId = process.pid; // Tambahkan process ID
  return path.join(__dirname, `temp_${processId}_${timestamp}_${randomString}`);
}

// Fungsi helper untuk cleanup dengan retry - aman untuk multiple user
async function cleanupDirectory(dirPath, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (fs.existsSync(dirPath)) {
        // Cek dulu apakah direktori masih berisi file yang sedang digunakan
        const files = fs.readdirSync(dirPath);
        
        // Hapus file satu per satu untuk menghindari lock
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          try {
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
              fs.unlinkSync(filePath);
            }
          } catch (fileError) {
            console.warn(`Gagal hapus file ${filePath}:`, fileError.message);
          }
        }
        
        // Kemudian hapus direktori
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Cleanup berhasil: ${dirPath}`);
      }
      return;
    } catch (error) {
      console.warn(`Cleanup attempt ${i + 1} gagal untuk ${dirPath}:`, error.message);
      if (i < maxRetries - 1) {
        // Tunggu dengan backoff exponential untuk menghindari race condition
        const delay = Math.min(1000, 100 * Math.pow(2, i));
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error(`Gagal cleanup direktori setelah ${maxRetries} percobaan: ${dirPath}`);
}

async function checkTableExists(fileName) {
  try {
    // Validate that the file name does not already exist as a table
    const result = await db.oneOrNone(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      ) AS table_exists
    `, [fileName]);

    // If table exists, throw an error
    if (result.table_exists) {
      throw new Error(`A table with name "${fileName}" already exists. Please rename your shapefile.`);
    }

    return false;
  } catch (error) {
    console.error("Error checking file/table existence:", error);
    throw error;
  }
}

async function validateShapefileZip(zipPath) {
  let extractDir = null;
  try {
    // Buat direktori temp yang unik untuk setiap proses
    extractDir = createUniqueExtractDir();
    
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }

    // Extract ZIP file
    extractShapefile(zipPath, extractDir);

    // Get all files in the extracted directory
    const files = fs.readdirSync(extractDir);

    // Check if .shp file exists
    const shpFiles = files.filter(file => file.endsWith(".shp"));
    if (shpFiles.length === 0) {
      throw new Error("No .shp file found in the ZIP.");
    }

    // Check if there's only one .shp file
    if (shpFiles.length > 1) {
      throw new Error("Multiple .shp files found. Only one shapefile is allowed.");
    }

    // Check for required companion files
    const shpFileName = shpFiles[0];
    const baseFileName = path.basename(shpFileName, ".shp");
    const requiredExtensions = [".dbf", ".shx"];
    
    const missingFiles = requiredExtensions.filter(ext => 
      !files.includes(baseFileName + ext)
    );

    if (missingFiles.length > 0) {
      throw new Error(`Missing companion files: ${missingFiles.join(", ")}`);
    }

    return baseFileName;
  } catch (error) {
    console.error("Shapefile validation error:", error);
    throw error;
  } finally {
    // Pastikan cleanup dilakukan dalam finally block
    if (extractDir) {
      await cleanupDirectory(extractDir);
    }
  }
}

async function importShapefileToPostGIS(zipPath) {
  let source = null;
  let newSource = null;
  let extractDir = null;
  
  try {
    // Buat direktori temp yang unik
    extractDir = createUniqueExtractDir();
    
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
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
    console.log("tableNameshp_to_postg", tableName);
    console.log("shapefileName", shapefileName);

    // Check if table already exists
    await checkTableExists(shapefileName);

    // Open shapefile to read schema
    source = await shapefile.open(shpPath);
    
    // Read the first record to determine the column structure
    const firstRecord = await source.read();
    if (firstRecord.done) {
      throw new Error("Shapefile is empty.");
    }
    
    // Get the property names and map to SQL column types
    const properties = firstRecord.value.properties;
    const propertyNames = Object.keys(properties);
    const columnDefinitions = [];
    
    // Map JavaScript types to PostgreSQL types
    for (const key of propertyNames) {
      const value = properties[key];
      let sqlType;
      
      // Convert JavaScript types to PostgreSQL types
      if (typeof value === 'number') {
        sqlType = Number.isInteger(value) ? 'INTEGER' : 'NUMERIC';
      } else if (typeof value === 'boolean') {
        sqlType = 'BOOLEAN';
      } else if (value instanceof Date) {
        sqlType = 'TIMESTAMP';
      } else {
        // Default to TEXT for strings and other values
        sqlType = 'TEXT';
      }
      
      // Escape the column name to prevent SQL injection
      const sqlColumnName = pgp.as.name(key);
      columnDefinitions.push(`${sqlColumnName} ${sqlType}`);
    }
    
    // Create the table with the determined column structure
    await db.none(`
      CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columnDefinitions.join(',\n        ')},
        geom GEOMETRY(Geometry, 4326)
      );
    `);
    
    console.log(`Created table "${shapefileName}" with columns: ${propertyNames.join(', ')}`);
    
    // Reset the source to read from the beginning
    // Note: Instead of closing and reopening, we'll use a different approach
    // to avoid potential issues with source.close()
    
    // Insert the first record we already read
    await insertRecord(tableName, propertyNames, firstRecord.value);
    let count = 1;
    
    // Continue reading and inserting the rest of the records
    let record;
    while ((record = await source.read()) && !record.done) {
      await insertRecord(tableName, propertyNames, record.value);
      count++;
      
      if (count % 100 === 0) {
        console.log(`Imported ${count} records...`);
      }
    }
    
    console.log(`Successfully imported ${count} records into "${shapefileName}"`);
    
    // Create spatial index for better query performance
    await db.none(`
      CREATE INDEX idx_${shapefileName}_geom ON ${tableName} USING GIST (geom);
    `);
    
    console.log(`Created spatial index on "${shapefileName}"`);
    
    return shapefileName;
  } catch (error) {
    console.error("Error importing Shapefile:", error);
    throw error;
  } finally {
    // Pastikan cleanup dilakukan dalam finally block
    try {
      if (source) {
        // Some shapefile libraries may not have a close method or it might work differently
        // Let's handle this gracefully
        if (typeof source.close === 'function') {
          await source.close().catch(e => console.warn("Warning closing source:", e));
        }
      }
      if (newSource && newSource !== source && typeof newSource.close === 'function') {
        await newSource.close().catch(e => console.warn("Warning closing newSource:", e));
      }
    } catch (closeError) {
      console.warn("Warning during resource cleanup:", closeError);
    }
    
    // Cleanup direktori temp
    if (extractDir) {
      await cleanupDirectory(extractDir);
    }
  }
}

// Helper function to insert a record
async function insertRecord(tableName, propertyNames, value) {
  // Prepare column names and values for SQL
  const columns = propertyNames.map(name => pgp.as.name(name));
  const values = propertyNames.map(name => value.properties[name]);
  
  // Add the geometry column
  columns.push('geom');
  
  // Handle geometry correctly - ensure it's valid for PostGIS
  let geometryValue = null;
  if (value.geometry) {
    // Use ST_GeomFromGeoJSON for the geometry
    geometryValue = pgp.as.format('ST_GeomFromGeoJSON($1::json)', [JSON.stringify(value.geometry)]);
  }
  
  // Build dynamic INSERT query
  const columnList = columns.join(', ');
  const paramList = propertyNames.map((_, i) => `$${i + 1}`).join(', ');
  
  // Create full SQL query with explicit parameter for geometry
  const sql = `
    INSERT INTO ${tableName} (${columnList})
    VALUES (${paramList}, ${geometryValue || 'NULL'})
  `;
  
  // Execute the insert
  await db.none(sql, values);
}

async function getTableName(zipPath) {
  let extractDir = null;
  try {
    // Buat direktori temp yang unik
    extractDir = createUniqueExtractDir();
    
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
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
    
    return tableName;
  } catch (error) {
    console.error("Error getting table name:", error);
    throw error;
  } finally {
    // Pastikan cleanup dilakukan dalam finally block
    if (extractDir) {
      await cleanupDirectory(extractDir);
    }
  }
}

async function deletePostGISTable(tableName) {
  try {
    console.log("tableName", tableName);
    const cleanTableName = tableName.replace(/^"(.*)"$/, "$1");
    console.log("cleanTableName", cleanTableName);

    // Step 1: Unpublish layer & feature type from GeoServer
    await unpublishLayer(cleanTableName); // Panggil unpublish dari module GeoServer

    // Sanitize table name to prevent SQL injection
    const sanitizedTableName = pgp.as.name(cleanTableName);

    // Hapus dari database
    await db.none(`DROP TABLE IF EXISTS ${sanitizedTableName}`);
    
    console.log(`Table "${cleanTableName}" deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Error deleting table "${cleanTableName}":`, error);
    throw error;
  }
}

module.exports = {
  importShapefileToPostGIS,
  getTableName,
  checkTableExists,
  deletePostGISTable,
  validateShapefileZip,
};