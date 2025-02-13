import { useContext, useEffect } from "react";
import MapContext from "./MapContext";
import Config from '../../config.json';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

import { Group as LayerGroup } from "ol/layer";

const ZoomToMap = ({ zoomToMap, setZoomToMap }) => {
    const { map } = useContext(MapContext);
    const url_list_harvesting_bbox = Config.api_domain + "/harvestings/bbox_identifier/";


    useEffect(() => {
        if (!map) return;
    }, [map]);

    useEffect(() => {
        if (zoomToMap) {

            if (zoomToMap.includes("uploader")) {


                var candidate;
                var layers = map.getLayers().getArray();
                //console.log(layers);
                //console.log(layers[5])
                var idx = 0;
                layers.forEach(function (l, i) {
                    //console.log(l)
                    if (l instanceof LayerGroup) {
                        //console.log(i)
                        idx = i;
                    }
    
                })
                var group = layers[idx]

                group.getLayers().forEach(function (layer, i) {
                    //alert('ya')
                    //console.log(layer.getKeys())
                    if (layer.getKeys().includes("id")) {
                        //console.log(layer);
                        //alert('wow')
                        if (layer.get("id") === zoomToMap) {
                            //alert('oi')
                            candidate = layer;
                        }
                    }
                    /*
                    if (layer.get("id") !== undefined && layer.get("id") === props.identifierDelete) {
                     
                    }
                    */
                });
                //console.log(candidate.getSource().getExtent())
                //console.log(candidate.getExtent())
                map.getView().fit(candidate.getSource().getExtent())
                setZoomToMap()
            } else { //


                //console.log(zoomToMap)
                const requestOptions = {
                    method: 'GET'
                };

                fetch(url_list_harvesting_bbox + zoomToMap, requestOptions).then(res => res.json()).then(data => {
                    //setRow(data.data)
                    //console.log(data);
                    var bbox = JSON.parse(data.message.bbox);
                    //console.log(bbox)
                    //setZoomTo(bbox)
                    var feature = new Feature({
                        geometry: new Polygon(bbox.coordinates),
                        name: 'zoomToMap'
                    })
                    //console.log(feature)
                    map.getView().fit(feature.getGeometry())

                    setZoomToMap()
                })

            }
        }
    }, [zoomToMap]);

    return null;
};



export default ZoomToMap;