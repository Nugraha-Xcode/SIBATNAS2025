import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import OLGraticuleLayer from "ol/layer/Graticule";
import Stroke from "ol/style/Stroke";

const GraticuleLayer = ({ zIndex = 0 }) => {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;

        let graticuleLayer = new OLGraticuleLayer({
            // the style to use for the lines, optional.
            strokeStyle: new Stroke({
                color: 'rgba(255,120,0,0.9)',
                width: 1,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
        })
        graticuleLayer.set('id', 'graticule_layer')
        map.addLayer(graticuleLayer);
        return () => {
            if (map) {
                map.removeLayer(graticuleLayer);
            }
        };
    }, [map]);
    return null;
};
export default GraticuleLayer;