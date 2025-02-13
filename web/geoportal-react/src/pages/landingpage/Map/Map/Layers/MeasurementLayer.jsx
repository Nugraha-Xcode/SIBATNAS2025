import { useContext, useEffect } from "react";
import MapContext from "../MapContext";

import OLVectorLayer from "ol/layer/Vector";
import { Vector as VectorSource } from 'ol/source/';
import { GeoJSON } from 'ol/format';
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle,
    Circle as CircleStyle
} from 'ol/style';

import Feature from 'ol/Feature';
import { Polygon } from 'ol/geom';

const MeasurementLayer = ({ zIndex = 0 }) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        var sourceMeasurement = new VectorSource();

        var measurementLayer = new OLVectorLayer({
            source: sourceMeasurement,
            zIndex: zIndex,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new StrokeStyle({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new FillStyle({
                        color: '#ffcc33',
                    }),
                }),
            }),
        });
        measurementLayer.set('id', 'measurement_layer');
        map.addLayer(measurementLayer);
        return () => {
            if (map) {
                map.removeLayer(measurementLayer);
            }
        };

    }, [map]);

    return null;
};
export default MeasurementLayer;