// sld_to_geoserver.js
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const geoserverUrl = `${process.env.GEOSERVER_HOST}:${process.env.GEOSERVER_PORT}/geoserver/rest/`;
const workspace = process.env.GEOSERVER_WORKSPACE;
const auth = {
  username: process.env.GEOSERVER_USER,
  password: process.env.GEOSERVER_PASS,
};

async function processSLDInZip(shapefileZipPath, tableName) {
  try {
    console.log(`Checking for SLD files in zip: ${shapefileZipPath} for layer: ${tableName}`);

    if (!fs.existsSync(shapefileZipPath)) {
      console.log(`Shapefile zip not found at path: ${shapefileZipPath}`);
      return false;
    }

    // Read the zip file
    const zip = new AdmZip(shapefileZipPath);
    const zipEntries = zip.getEntries();
    
    // Filter for .sld files
    const sldEntries = zipEntries.filter(entry => 
      entry.entryName.toLowerCase().endsWith('.sld') && !entry.isDirectory
    );
    
    if (sldEntries.length === 0) {
      console.log('No SLD files found in the zip archive');
      return false;
    }

    // Clean the table name by removing any quotes
    const cleanTableName = tableName.replace(/['"]/g, '');
    let success = false;
    
    // Process the first SLD file found (or you could prioritize one with the same name as the layer)
    // Prioritize SLD with same name as table/layer if it exists
    let targetSldEntry = sldEntries.find(entry => 
      path.basename(entry.entryName, '.sld').toLowerCase() === cleanTableName.toLowerCase()
    ) || sldEntries[0];
    
    // Extract style name from the SLD file name (without extension)
    const styleName = path.basename(targetSldEntry.entryName, '.sld');
    console.log(`Found SLD file: ${targetSldEntry.entryName}, using as style: ${styleName}`);
    
    // Extract SLD content
    const sldContent = targetSldEntry.getData().toString('utf-8');
    
    // Check SLD version and determine content type
    const contentType = checkSLDVersionAndGetContentType(sldContent);
    console.log(`Detected SLD version with content type: ${contentType}`);
    
    try {
      // Step 1: Create the style (or check if it exists)
      console.log(`Creating/checking style "${styleName}" in workspace "${workspace}"...`);
      
      let styleExists = false;
      try {
        // Check if style already exists
        const checkResponse = await axios.get(
          `${geoserverUrl}workspaces/${workspace}/styles/${styleName}`,
          { auth, headers: { Accept: 'application/json' } }
        );
        styleExists = true;
        console.log(`Style "${styleName}" already exists in GeoServer`);
      } catch (checkError) {
        if (checkError.response?.status === 404) {
          console.log(`Style "${styleName}" doesn't exist yet, will create it`);
        } else {
          console.error(`Error checking if style exists: ${checkError.message}`);
          throw checkError;
        }
      }
      
      // If style doesn't exist, create it
      if (!styleExists) {
        await axios.post(
          `${geoserverUrl}workspaces/${workspace}/styles`,
          {
            style: {
              name: styleName,
              filename: `${styleName}.sld`,
              workspace: workspace
            }
          },
          {
            auth,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        console.log(`Style "${styleName}" created successfully`);
      }
      
      // Step 2: Upload the SLD content (regardless if style existed or not)
      await axios.put(
        `${geoserverUrl}workspaces/${workspace}/styles/${styleName}`,
        sldContent,
        {
          auth,
          headers: {
            'Content-Type': contentType, // Use the detected content type
          }
        }
      );
      console.log(`SLD content for "${styleName}" uploaded successfully`);
      
      // Step 3: Assign the style to the layer
      await axios.put(
        `${geoserverUrl}layers/${workspace}:${cleanTableName}`,
        {
          layer: {
            defaultStyle: {
              name: styleName,
              workspace: workspace
            }
          }
        },
        {
          auth,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log(`Style "${styleName}" successfully assigned to layer "${cleanTableName}"`);
      
      success = true;
      
    } catch (err) {
      console.error(`❌ Error processing SLD file: ${err.message}`);
      if (err.response) {
        console.error(`Response status: ${err.response.status}`);
        console.error(`Response data:`, err.response.data);
      }
    }
    
    return success;
    
  } catch (error) {
    console.error("❌ Error in processSLDInZip:", error.message);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    return false;
  }
}


function checkSLDVersionAndGetContentType(sldContent) {
  // Default content type (used if version detection fails)
  let contentType = 'application/vnd.ogc.se+xml';
  
  try {
    // Look for the version attribute in the SLD
    const versionMatch = sldContent.match(/StyledLayerDescriptor[^>]*version=["']([^"']+)["']/);
    
    if (versionMatch && versionMatch[1]) {
      const version = versionMatch[1];
      console.log(`Detected SLD version: ${version}`);
      
      if (version === '1.0.0') {
        contentType = 'application/vnd.ogc.sld+xml';
      } else if (version === '1.1.0') {
        contentType = 'application/vnd.ogc.se+xml';
      } else {
        console.log(`Unknown SLD version: ${version}, using default content type`);
      }
    } else {
      console.log('Could not detect SLD version, using default content type');
    }
  } catch (error) {
    console.error(`Error detecting SLD version: ${error.message}`);
    console.log('Using default content type');
  }
  
  return contentType;
}

// Function to check if an SLD with the same name exists in GeoServer
async function checkSLDExistsInGeoserver(zipFilePath, tableName) {
  try {
    console.log(`Checking if SLD in zip already exists in GeoServer: ${zipFilePath} for table: ${tableName}`);

    if (!fs.existsSync(zipFilePath)) {
      console.log(`Zip file not found at path: ${zipFilePath}`);
      return false;
    }

    // Read the zip file
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    
    // Filter for .sld files
    const sldEntries = zipEntries.filter(entry => 
      entry.entryName.toLowerCase().endsWith('.sld') && !entry.isDirectory
    );
    
    if (sldEntries.length === 0) {
      console.log('ℹNo SLD files found in the zip archive');
      return false;
    }
    
    // Clean the table name
    const cleanTableName = tableName.replace(/['"]/g, '');
    
    // Prioritize SLD with same name as table/layer if it exists
    let targetSldEntry = sldEntries.find(entry => 
      path.basename(entry.entryName, '.sld').toLowerCase() === cleanTableName.toLowerCase()
    ) || sldEntries[0];
    
    // Extract style name from the SLD file name (without extension)
    const styleName = path.basename(targetSldEntry.entryName, '.sld');
    console.log(`Found SLD file: ${targetSldEntry.entryName}, checking if style exists: ${styleName}`);
    
    try {
      // Check if style already exists
      const checkResponse = await axios.get(
        `${geoserverUrl}workspaces/${workspace}/styles/${styleName}`,
        { auth, headers: { Accept: 'application/json' } }
      );
      console.log(`Style "${styleName}" already exists in GeoServer`);
      return true; // Style exists
    } catch (checkError) {
      if (checkError.response?.status === 404) {
        console.log(`Style "${styleName}" doesn't exist in GeoServer`);
        return false; // Style doesn't exist
      } else {
        console.error(`Error checking if style exists: ${checkError.message}`);
        throw checkError;
      }
    }
  } catch (error) {
    console.error("Error in checkSLDExistsInGeoserver:", error.message);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    return false; // Return false on error to avoid blocking the upload process
  }
}

module.exports = {
  processSLDInZip,
  checkSLDExistsInGeoserver,
};