import { useContext, useEffect } from "react";
import MapContext from "../MapContext";

import OLVectorLayer from "ol/layer/Vector";
import { Vector as VectorSource } from 'ol/source';

import {
    Style,
    Fill as FillStyle,
    Stroke as StrokeStyle,
    Circle as CircleStyle
} from 'ol/style';

const IdentifyLayer = ({ zIndex = 0 }) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        var sourceIdentify = new VectorSource();
        

        var image = new CircleStyle({
            radius: 5,
            fill: null,
            stroke: new StrokeStyle({ color: 'red', width: 1 }),
        });


        var styles = {
            'Point': new Style({
                image: image,
            }),
            'LineString': new Style({
                stroke: new StrokeStyle({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiLineString': new Style({
                stroke: new StrokeStyle({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiPoint': new Style({
                image: image,
            }),
            'MultiPolygon': new Style({
                stroke: new StrokeStyle({
                    color: 'magenta',
                    width: 1,
                }),
                fill: new FillStyle({
                    color: 'rgba(255, 255, 0, 0.1)',
                }),
            }),
            'Polygon': new Style({
                stroke: new StrokeStyle({
                    color: 'blue',
                    lineDash: [4],
                    width: 3,
                }),
                fill: new FillStyle({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            }),
            'GeometryCollection': new Style({
                stroke: new StrokeStyle({
                    color: 'magenta',
                    width: 2,
                }),
                fill: new FillStyle({
                    color: 'magenta',
                }),
                image: new CircleStyle({
                    radius: 10,
                    fill: null,
                    stroke: new StrokeStyle({
                        color: 'magenta',
                    }),
                }),
            }),
            'Circle': new Style({
                stroke: new StrokeStyle({
                    color: 'red',
                    width: 2,
                }),
                fill: new FillStyle({
                    color: 'rgba(255,0,0,0.2)',
                }),
            }),
        };

        var styleFunction = function (feature) {
            //console.log(feature)
            return styles[feature.getGeometry().getType()];
        };

        var identifyLayer = new OLVectorLayer({
            source: sourceIdentify,
            zIndex: zIndex,
            style: styleFunction
        });
        identifyLayer.set('id', 'identify_layer');
        map.addLayer(identifyLayer);
        return () => {
            if (map) {
                map.removeLayer(identifyLayer);
            }
        };

    }, [map]);

    return  null;
    /*
     <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content" ></div>
      </div>
    */
};
export default IdentifyLayer;