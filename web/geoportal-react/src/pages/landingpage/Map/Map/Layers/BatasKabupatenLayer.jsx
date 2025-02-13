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

const BatasProvinsiLayer = ({ zIndex = 0, visible = true }) => {
    const { map } = useContext(MapContext);
    
    useEffect(() => {
        if (!map) return;

        var wmsSource = new ImageWMSSource({
            url: 'https://tanahair.indonesia.go.id/geoserver/dashboard/wms',
            params: { 'LAYERS': 'kabupaten' },
            ratio: 1,
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });
        var wmsLayer = new ImageLayer({
            source: wmsSource,
            zIndex: zIndex
        })
        wmsLayer.set('id', 'batas_kabupaten_layer');
        wmsLayer.setVisible(visible);
        map.addLayer(wmsLayer);
        return () => {
            if (map) {
                map.removeLayer(wmsLayer);
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
            if (l.get("id") === 'batas_kabupaten_layer') {
                //console.log(i)
                idx = i;
            }

        })
        layers[idx].setVisible(visible);
        //layers[1].setSource(getBasemap());
    }, [visible]);

    return null;
};
export default BatasProvinsiLayer;