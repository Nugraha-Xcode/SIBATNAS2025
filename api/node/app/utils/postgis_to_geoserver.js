// postgis_to_geoserver.js
require("dotenv").config();
const axios = require("axios");

const apiUrl = `http://${process.env.HOST}/api/geoserver/wms/reflect?layers=`;
const geoserverUrl = `http://${process.env.GEOSERVER_HOST}:${process.env.GEOSERVER_PORT}/geoserver/rest/`;
const workspace = process.env.GEOSERVER_WORKSPACE;
const storeName = process.env.GEOSERVER_STORE;
const auth = {
  username: process.env.GEOSERVER_USER,
  password: process.env.GEOSERVER_PASS,
};

// Function to list all layers in a workspace
async function listLayers() {
  try {
    const response = await axios.get(
      `${geoserverUrl}workspaces/${workspace}/layers`,
      { auth }
    );
    const layers = response.data.layers.layer;
    console.log("Layers in workspace:", layers);
    return layers;
  } catch (error) {
    console.error("Error listing layers:", error);
  }
}

// Function to check if a layer exists in the workspace
async function layerExists(layerName) {
  const layers = await listLayers();
  if (layers) {
    const layerNames = layers.map((layer) => layer.name);
    return layerNames.includes(layerName);
  }
  return false;
}

// Function to list feature types in a specific store
async function listFeatureTypes(storeName) {
  try {
    const response = await axios.get(
      `${geoserverUrl}workspaces/${workspace}/stores/${storeName}/featuretypes`,
      { auth }
    );
    const featureTypes = response.data.featureTypes.featureType;
    console.log("Feature types in store:", featureTypes);
    return featureTypes;
  } catch (error) {
    console.error(
      `Error listing feature types for store '${storeName}':`,
      error
    );
  }
}

// Function to check if a specific feature type exists in the store
async function featureTypeExists(storeName, featureTypeName) {
  const featureTypes = await listFeatureTypes(storeName);
  if (featureTypes) {
    const featureTypeNames = featureTypes.map((ft) => ft.name);
    return featureTypeNames.includes(featureTypeName);
  }
  return false;
}

// Function to activate the layer
async function activateLayer(layerName) {
  const exists = await layerExists(layerName);
  if (!exists) {
    console.error(`Layer '${layerName}' does not exist in the workspace.`);
    return;
  }

  try {
    // Fetch the current layer configuration to ensure it's in the correct state
    const response = await axios.get(
      `${geoserverUrl}workspaces/${workspace}/layers/${layerName}`,
      { auth }
    );
    const layerData = response.data;
    console.log("Layer details:", layerData);

    // Update the layer to enable it for WMS or other services if needed
    const updatedLayerConfig = {
      layer: {
        enabled: true, // Enable the layer
        wms: { enabled: true }, // Enable WMS service for the layer
        wfs: { enabled: true }, // Enable WFS service for the layer
      },
    };

    const updateResponse = await axios.put(
      `${geoserverUrl}workspaces/${workspace}/layers/${layerName}`,
      updatedLayerConfig,
      { auth }
    );

    console.log("Layer activated and published:", updateResponse.data);
  } catch (error) {
    console.error("Error activating layer:", error);
  }
}

async function publishTableAsLayer(tableName, title, abstract) {
  try {
    const cleanResult = tableName.replace(/^"(.*)"$/, "$1");
    console.log("clean");
    console.log(cleanResult);
    //return;
    //http://localhost:81/geoserver/my_workspace/wms?service=WMS&version=1.1.0&request=GetMap&layers=my_workspace%3ARBI25K_TITIKKONTROLGEODESI_PT_25K
    const featureTypeConfig = {
      featureType: {
        name: cleanResult,
        nativeName: cleanResult,
        title: cleanResult,
        title: title,
        abstract: abstract,
        srs: "EPSG:4326", // Adjust the SRS if necessary
        //nativeCRS: "EPSG:4326",
      },
    };
    //console.log(featureTypeConfig);
    //return;
    /*
    {
  "featureType": {
    "name": "ADMNISTRASI_AR_KECAMATAN",
    "nativeName": "ADMNISTRASI_AR_KECAMATAN",
    "title": "Administrasi AR Kecamatan",
    "abstract": "A description of the layer",
    "srs": "EPSG:4326"
  }
}
    */
    /*
    {
      "featureType": {
        "name": "ADMINISTRASI_AR_KABKOTA",
        "nativeName": "ADMINISTRASI_AR_KABKOTA",
        "title": "ADMINISTRASI_AR_KABKOTA",
        "enabled": true,
        "srs": "EPSG:4326",
        "projectionPolicy": "FORCE_DECLARED",
        "store": {
          "@class": "dataStore",
          "name": "palapa_geodb",
          "href": "https://palapa.kukarkab.go.id/geoserver/rest/workspaces/palapa/datastores/palapa_geodb.json"
        }
      }
    }
    */
    // Publish the table as a feature type in GeoServer
    const response = await axios.post(
      `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}/featuretypes`,
      featureTypeConfig,
      { auth }
    );

    console.log(`Layer for table '${cleanResult}' published successfully!`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing table '${tableName}' as a layer:`, error);
  }
}

async function getUrlGeoserver(tableName) {
  try {
    const cleanResult = tableName.replace(/^"(.*)"$/, "$1");
    //const response = await axios.get(
    //  `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}/featuretypes/${cleanResult}.json`,
    //  { auth }
    //);
    //latLonBoundingBox
    //console.log(`Layer for table '${cleanResult}' published successfully!`);
    let response = `${apiUrl}${workspace}:${cleanResult}`;
    return response;

    //https://sigap.menlhk.go.id/tatakelola/api-new/api/geoserver/wms/reflect?layers=KLHK%3ABLOK_KK_AR_50K
  } catch (error) {
    console.error(`Error publishing table '${tableName}' as a layer:`, error);
  }
}

async function publishFeatureStore(pgTable) {
  try {
    const url = `${geoserverUrl}rest/workspaces/${workspace}/datastores`;

    const data = `
        <coverageStore>
          <name>${storeName}</name>
          <connectionParameters>
            <entry key="database">${pgTable}</entry>
          </connectionParameters>
        </coverageStore>
      `;

    const config = {
      headers: {
        "Content-Type": "application/xml",
      },
    };

    // Make the POST request to publish the feature store
    const response = await axios.post(url, data, { auth, ...config });

    console.log("Feature store published:", response.data);
  } catch (error) {
    console.error("Error publishing feature store:", error);
  }
}

// Export the functions
module.exports = {
  listLayers,
  layerExists,
  activateLayer,
  listFeatureTypes,
  featureTypeExists,
  publishTableAsLayer,
  publishFeatureStore,
  getUrlGeoserver,
};
