import XYZ from "ol/source/XYZ";

function topo() {
    return new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attributions: 'Tiles World Topo © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        crossOrigin: "Anonymous"
    })
}

export default topo;