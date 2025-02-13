import { useContext, useEffect } from "react";
import MapContext from "./MapContext";
//import Config from '../../config.json';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

import { Group as LayerGroup } from "ol/layer";

const ZoomToMap = ({ zoomToMap, setZoomToMap, setShow }) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;
    }, [map]);

    useEffect(() => {
        if (zoomToMap) {
            setShow(false)
            let layers = map.getLayers().getArray();
            var idx = 0;
            layers.forEach(function (l, i) {
                if (l.get("id") === 'indikator_layer') {
                    idx = i;
                }
            })
            
            var sourceSelected = layers[idx].getSource();
            //console.log(sourceSelected)
            
            var extent = sourceSelected.getExtent();

            console.log(extent[0])
            console.log(isFinite(extent[0]))
            //if (extent[0] !== 'Infinity')
            if(isFinite(extent[0])){
               map.getView().fit(sourceSelected.getExtent())
               map.updateSize()
            }
            
           setZoomToMap()
        }
    }, [zoomToMap]);

    return null;
};



export default ZoomToMap;