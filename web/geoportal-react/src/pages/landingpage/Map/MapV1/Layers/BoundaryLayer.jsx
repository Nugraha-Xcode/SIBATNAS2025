import { useContext, useEffect } from "react";
import MapContext from "../MapContext";

import OLVectorLayer from "ol/layer/Vector";
import {Vector as VectorSource} from 'ol/source/';
import { GeoJSON } from 'ol/format';
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle,
    Circle as CircleStyle
} from 'ol/style';

import Feature from 'ol/Feature';
import {MultiPolygon } from 'ol/geom';

const BoundaryLayer = ({ zIndex = 0, visible, boundary }) => {
    const { map } = useContext(MapContext);

    


    useEffect(() => {
        if (!map) return;

      
        var sourceBoundary = new VectorSource({
            format: new GeoJSON(),
            //features: new GeoJSON().readFeatures(bboxFirst),
            wrapX: false
        });

        //console.log(sourceBbox);
        let boundaryLayer = new OLVectorLayer({
            source: sourceBoundary,
            zIndex: zIndex,
            visible: visible,
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new StrokeStyle({
                    color: '#0000ff',
                    width: 1
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new FillStyle({
                        color: '#ffcc33'
                    })
                })
            })
        });
    
        map.addLayer(boundaryLayer);
        boundaryLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(boundaryLayer);
            }
        };
        
    }, [map]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        layers[2].setVisible(visible);
        //console.log(visible)
    }, [visible]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray()
        //console.log(layers);
     
        var _sourceCountry = layers[2].getSource()

        _sourceCountry.clear();

        //layers[1].setSource(getBasemap());
        var feature = new Feature({
            geometry: new MultiPolygon(boundary.coordinates),
            name: 'boundary'
        })
        //console.log(feature)
        _sourceCountry.addFeature(feature)

    }, [boundary]);

    return null;
};
export default BoundaryLayer;