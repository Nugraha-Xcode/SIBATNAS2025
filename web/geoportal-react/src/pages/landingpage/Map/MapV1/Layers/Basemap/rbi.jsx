import XYZ from "ol/source/XYZ";

function rbi() {
    return new XYZ({
        url: "https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer/tile/{z}/{y}/{x}",
        attributions: 'RBI © <a target="_blank" href="https://geoservices.big.go.id/rbi/rest/services/BASEMAP/Rupabumi_Indonesia/MapServer">Badan Informasi Geospasial</a>',
        crossOrigin: "Anonymous"
    })
}

export default rbi;