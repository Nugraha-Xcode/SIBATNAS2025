// postgis_to_geoserver.js
require('dotenv').config();
const axios = require("axios");

const apiUrl = `${process.env.HOST}/api/geoserver/wms/reflect?layers=`;
const geoserverUrl = `${process.env.GEOSERVER_HOST}:${process.env.GEOSERVER_PORT}/geoserver/rest/`;
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
  console.log("layerExists:", layers);
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
  try {
    const response = await axios.get(
      `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}/featuretypes/${featureTypeName}`,
      { auth }
    );
    return response.status === 200;
  } catch (error) {
    // If it's a 404, the feature type doesn't exist (which is not an error for our purpose)
    if (error.response && error.response.status === 404) {
      console.log(`Feature type '${featureTypeName}' does not exist in the store.`);
      return false;
    }
    // For store not found or other errors
    if (error.response && error.response.status === 404) {
      console.log(`Store '${storeName}' may not exist.`);
      return false;
    }
    
    console.error(`Error checking if feature type '${featureTypeName}' exists:`, error.message);
    return false;
  }
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

async function unpublishLayer(layerName) {
  try {
    // Check if layer exists
    const exists = await layerExists(layerName);
    console.log("LayerExist", exists);

    if (!exists) {
      console.log(`Layer '${layerName}' does not exist in the workspace.`);
      return false;
    }

    // Attempt to get the layer's default style before deletion
    let defaultStyleName = null;
    try {
      const layerResponse = await axios.get(
        `${geoserverUrl}workspaces/${workspace}/layers/${layerName}`,
        { auth }
      );
      
      // Extract the default style name if it exists
      if (layerResponse.data.layer.defaultStyle) {
        // Remove workspace prefix if present
        defaultStyleName = layerResponse.data.layer.defaultStyle.name.replace(`${workspace}:`, '');
      }
    } catch (styleError) {
      console.log(`Could not retrieve default style for layer '${layerName}':`, styleError.message);
    }

    // Delete the layer first
    try {
      await axios.delete(
        `${geoserverUrl}workspaces/${workspace}/layers/${layerName}`,
        { 
          auth,
          params: {
            recurse: true
          }
        }
      );
      console.log(`Layer '${layerName}' successfully unpublished.`);
    } catch (layerDeleteError) {
      console.error(`Error deleting layer '${layerName}':`, layerDeleteError.message);
    }

    // Try to delete the feature type if it exists
    try {
      // Check if store exists first to avoid unnecessary errors
      const storeExists = await axios.get(
        `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}`,
        { auth }
      ).then(() => true).catch(() => false);
      
      if (storeExists) {
        const ftExists = await featureTypeExists(storeName, layerName);
        if (ftExists) {
          await axios.delete(
            `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}/featuretypes/${layerName}`,
            { 
              auth,
              params: {
                recurse: true
              }
            }
          );
          console.log(`Feature type '${layerName}' successfully deleted from store '${storeName}'.`);
        }
      } else {
        console.log(`Store '${storeName}' does not exist, skipping feature type deletion.`);
      }
    } catch (featureTypeDeleteError) {
      console.error(`Error with feature type '${layerName}':`, featureTypeDeleteError.message);
    }

    // Delete the associated style if it exists
    if (defaultStyleName) {
      try {
        await axios.delete(
          `${geoserverUrl}workspaces/${workspace}/styles/${defaultStyleName}`,
          { 
            auth,
            params: {
              recurse: true
            }
          }
        );
        console.log(`Style '${defaultStyleName}' successfully deleted.`);
      } catch (styleDeleteError) {
        // Try without workspace prefix if first attempt fails
        try {
          await axios.delete(
            `${geoserverUrl}styles/${defaultStyleName}`,
            { 
              auth,
              params: {
                recurse: true
              }
            }
          );
          console.log(`Style '${defaultStyleName}' successfully deleted without workspace prefix.`);
        } catch (fallbackStyleDeleteError) {
          console.error(`Error deleting style '${defaultStyleName}':`, styleDeleteError.message);
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Error unpublishing layer '${layerName}':`, error.message);
    return false;
  }
}

// Function to delete a feature type from a specific store
// async function deleteFeatureType(storeName, featureTypeName) {
//   try {
//     const exists = await featureTypeExists(storeName, featureTypeName);
//     if (!exists) {
//       console.error(`Feature type '${featureTypeName}' does not exist in store '${storeName}'.`);
//       return false;
//     }

//     // Delete the feature type
//     const deleteFeatureTypeResponse = await axios.delete(
//       `${geoserverUrl}workspaces/${workspace}/stores/${storeName}/featuretypes/${featureTypeName}`,
//       { 
//         auth,
//         params: {
//           recurse: true // This will delete any associated resources
//         }
//       }
//     );

//     console.log(`Feature type '${featureTypeName}' successfully deleted from store '${storeName}'.`);
//     return true;
//   } catch (error) {
//     console.error(`Error deleting feature type '${featureTypeName}' from store '${storeName}':`, error);
//     return false;
//   }
// }

// // Function to completely remove a feature store
// async function deleteFeatureStore(storeName) {
//   try {
//     // Delete the feature store with all its contents
//     const deleteStoreResponse = await axios.delete(
//       `${geoserverUrl}workspaces/${workspace}/datastores/${storeName}`,
//       { 
//         auth,
//         params: {
//           recurse: true // This will delete all associated feature types and layers
//         }
//       }
//     );

//     console.log(`Feature store '${storeName}' successfully deleted.`);
//     return true;
//   } catch (error) {
//     console.error(`Error deleting feature store '${storeName}':`, error);
//     return false;
//   }
// }

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
  unpublishLayer,
  // deleteFeatureType,
  // deleteFeatureStore,
};
