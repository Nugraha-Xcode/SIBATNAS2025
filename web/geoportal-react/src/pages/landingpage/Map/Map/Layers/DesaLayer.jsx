import { useContext, useState, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest } from 'ol/source';
import { Image as ImageLayer } from 'ol/layer';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
import { Fill, Stroke, Style, Text } from 'ol/style';

const DesaLayer = ({ zIndex = 0, visible = true, kode }) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;

        const selectedStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 0, 255, 0.7)',
                width: 2,
            }),
        });

        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                format: new GeoJSON(),
            }),
            style: selectedStyle
        });

        vectorLayer.set('id', 'desa_layer')
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
            if (l.get("id") === 'desa_layer') {
                //console.log(i)
                idx = i;
            }

        })
        layers[idx].setVisible(visible);
    }, [visible]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'desa_layer') {
                idx = i;
            }
        })
        var sourceIndikator = layers[idx].getSource();
        if (kode) {
            //console.log(url)
            sourceIndikator.setUrl('./data/batas/'+kode+'.geojson');
            sourceIndikator.refresh();
        }
    }, [kode]);


    return null;
};
export default DesaLayer;