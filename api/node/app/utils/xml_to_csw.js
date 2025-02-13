const axios = require("axios");
const fs = require("fs");

const CSW_URL = "http://localhost/csw/"; //http://pycsw_docker:8000/csw/"; // Change to your pycsw URL
//http://localhost/csw/
async function publishMetadata(filePath = "metadata.xml") {
  try {
    // Read the XML file
    const xmlData = fs.readFileSync(filePath, "utf-8");

    const xmlPayload = ` 
<csw:Transaction xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"
                 xmlns:gmd="http://www.isotc211.org/2005/gmd"
                 xmlns:gco="http://www.isotc211.org/2005/gco"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-publication.xsd"
                 service="CSW"
                 version="2.0.2">
    <csw:Insert>
          ${xmlData} 
    </csw:Insert>
</csw:Transaction>`;

    const response = await axios.post(CSW_URL, xmlPayload, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

    console.log("Metadata published successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Error publishing metadata:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Export the function for reuse
module.exports = { publishMetadata };
