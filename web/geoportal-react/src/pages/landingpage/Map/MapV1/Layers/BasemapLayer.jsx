import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import OLTileLayer from "ol/layer/Tile";
import { rbi, osm, topo, gray, imagery, stamen } from "./Basemap";

const BasemapLayer = ({ basemap, zIndex = 0 }) => {
    const { map } = useContext(MapContext);

    function getBasemap() {
        //console.log(basemap);
        switch (basemap) {
            case 'rbi':
                return rbi();
            case 'osm':
                return osm();
            case 'topo':
                return topo();
            case 'gray':
                return gray();
            case 'imagery':
                return imagery();
            case 'stamen':
                return stamen();
            default:
                return rbi();
        }
    }

    useEffect(() => {
        if (!map) return;
        let source = getBasemap()

        let tileLayer = new OLTileLayer({
            source,
            zIndex,
        });

        map.addLayer(tileLayer);
        
        return () => {
            if (map) {
                map.removeLayer(tileLayer);
            }
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray()
        layers[0].setSource(getBasemap());
    }, [basemap]);

    return null;
};
export default BasemapLayer;