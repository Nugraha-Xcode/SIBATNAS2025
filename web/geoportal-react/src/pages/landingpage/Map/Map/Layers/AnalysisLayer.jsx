import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest } from 'ol/source';
import { Image as ImageLayer } from 'ol/layer';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle,
    Circle as CircleStyle
} from 'ol/style';

const AnalysisLayer = ({ zIndex = 0, visible, buffered}) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                format: new GeoJSON(),
                //features: new GeoJSON().readFeatures(features),
            }),
            style: new Style({
                fill: new FillStyle({
                    color: 'rgba(255, 255, 0, 0.3)'
                }),
                stroke: new StrokeStyle({
                    color: '#ff0000',
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
       
        vectorLayer.set('id', 'analysis_layer')


        map.addLayer(vectorLayer);



        //ImageArcGISRest

        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        //console.log(layers);
        //console.log(layers[5])
        var idx = 0;
        layers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === 'analysis_layer') {
                //console.log(i)
                idx = i;
            }

        })
       layers[idx].setVisible(visible);
        //layers[1].setSource(getBasemap());
    }, [visible]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        //console.log(layers);
        //console.log(layers[5])
        var idx = 0;
        layers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === 'analysis_layer') {
                //console.log(i)
                idx = i;
            }

        })
       var source = layers[idx].getSource();
       //source.addFeatures()
       //console.log(source)
       //console.log(new GeoJSON().readFeatures(buffered))
       //console.log(buffered)
        //layers[1].setSource(getBasemap());
        //console.log(new GeoJSON().readFeatures(buffered,{
        //    featureProjection: 'EPSG:3857'
        //}))
        source.clear();
        source.addFeatures(new GeoJSON().readFeatures(buffered,{
            featureProjection: 'EPSG:3857'
        }))
        //console.log(source)
    }, [buffered]);

    return null;
};
export default AnalysisLayer;