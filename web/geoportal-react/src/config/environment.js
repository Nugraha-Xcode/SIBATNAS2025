const environment = {
  baseUrl: "http://localhost:3008/main/", //"http://localhost:3000",
  api: "http://localhost:8080/api/", //"http://localhost:8080/api",
  csw: "http://localhost:8163/csw/",
  geoserver: "http://localhost:8181/geoserver/", //"http://172.16.3.163:8081/",
  ALLOWED_DOCUMENT_TYPES: process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES,
  ALLOWED_METADATA_TYPES: process.env.REACT_APP_ALLOWED_METADATA_TYPES,
  ALLOWED_SPASIAL_TYPES: process.env.REACT_APP_ALLOWED_SPASIAL_TYPES,
  MAX_DOCUMENT_SIZE: parseInt(
    process.env.REACT_APP_MAX_DOCUMENT_SIZE || "2",
    10
  ),
  MAX_METADATA_SIZE: parseInt(
    process.env.REACT_APP_MAX_METADATA_SIZE || "2",
    10
  ),
  MAX_SPASIAL_SIZE: parseInt(
    process.env.REACT_APP_MAX_SPASIAL_SIZE || "10",
    10
  ),
};

if (process.env.REACT_APP_ENV === "development") {
  environment.baseUrl = "http://localhost/main/"; // Sesuai dengan WEBSERVER_CONNECTION_PORT=80
  environment.api = "http://localhost:8080/api/"; // Sesuai dengan API_NODE_CONNECTION_PORT=8162
  environment.csw = "http://localhost:8163/csw/"; // Sesuai dengan PYCSW_CONNECTION_PORT=8163
  environment.geoserver = "http://localhost:81/geoserver/"; // Sesuai dengan GEOSERVER_CONNECTION_PORT=81
}

if (process.env.REACT_APP_ENV === "staging") {
  environment.baseUrl = "http://10.88.3.139/main/";
  environment.api = "http://10.88.3.139/api/";
  environment.csw = "http://10.88.3.139/csw/";
  environment.geoserver = "http://10.88.3.139/geoserver/";
}

if (process.env.REACT_APP_ENV === "production") {
  environment.baseUrl = "https://palapa.kukarkab.go.id/main/";
  environment.api = "https://palapa.kukarkab.go.id/api/";
  environment.csw = "https://palapa.kukarkab.go.id/csw/";
  environment.geoserver = "https://palapa.kukarkab.go.id/geoserver/";
}

export default environment;
