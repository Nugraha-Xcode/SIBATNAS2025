import XYZ from "ol/source/XYZ";

function rbi() {
    return new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attributions: 'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
        crossOrigin: "Anonymous"
    })
}

export default rbi;