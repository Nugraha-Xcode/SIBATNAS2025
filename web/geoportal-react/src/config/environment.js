const environment = {
  baseUrl: "http://10.10.171.9:80/main/",
  api: "http://10.10.171.9:80/api/", 
  csw: "http://10.10.171.9:80/csw/",
  geoserver: "http://10.10.171.9:80/geoserver/",
};

if (process.env.REACT_APP_ENV === "development") {
  environment.baseUrl = "http://localhost:3008/main/";  // Sesuai dengan WEBSERVER_CONNECTION_PORT=80
  environment.api = "http://localhost:8080/api/";  // Sesuai dengan API_NODE_CONNECTION_PORT=8162
  environment.csw = "http://localhost:8163/csw/";  // Sesuai dengan PYCSW_CONNECTION_PORT=8163
  environment.geoserver = "http://localhost:81/geoserver/";  // Sesuai dengan GEOSERVER_CONNECTION_PORT=81
}

if (process.env.REACT_APP_ENV === "staging") {
  environment.baseUrl = "http://10.10.171.9/main/";
  environment.api = "http://10.10.171.9/api/";
  environment.csw = "http://10.10.171.9/csw/";
  environment.geoserver = "http://10.10.171.9/geoserver/";
}

if (process.env.REACT_APP_ENV === "production") {
  environment.baseUrl = "https://stage-sibatnas.big.go.id/main/";
  environment.api = "https://stage-sibatnas.big.go.id/api/";
  environment.csw = "https://stage-sibatnas.big.go.id/csw/";
  environment.geoserver = "https://stage-sibatnas.big.go.id/geoserver/";
}

export default environment;
