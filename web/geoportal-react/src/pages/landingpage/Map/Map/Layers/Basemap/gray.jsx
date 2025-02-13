import XYZ from "ol/source/XYZ";

function gray() {
    return new XYZ({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attributions: 'Tiles World Light Gray © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer">ArcGIS</a>',
        crossOrigin: "Anonymous"
    })
}

export default gray;