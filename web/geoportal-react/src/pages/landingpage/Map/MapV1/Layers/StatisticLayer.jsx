import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest } from 'ol/source';
import { Image as ImageLayer } from 'ol/layer';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style, Text} from 'ol/style';

const StatisticLayer = ({ zIndex = 0, visible}) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        const style = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.6)',
            }),
            stroke: new Stroke({
                color: '#319FD3',
                width: 1,
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: '#000',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3,
                }),
            }),
        });

        var getStyle = function (feature, resolution) {
            if (feature.get('join_tabel_minum_2019') <= 25) {
                return new Style({
                    fill: new Fill({
                        color: "#ffffff" // semi-transparent red
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    })
                });
            } else if (feature.get('join_tabel_minum_2019') > 25 && feature.get('join_tabel_minum_2019') <= 33) {
                return new Style({
                    fill: new Fill({
                        color: "#ffbfbf" // semi-transparent red
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    })
                });
            } else if (feature.get('join_tabel_minum_2019') > 33 && feature.get('join_tabel_minum_2019') <= 42) {
                return new Style({
                    fill: new Fill({
                        color: "#ff8080" // semi-transparent red
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    })
                });
            } else if (feature.get('join_tabel_minum_2019') > 42 && feature.get('join_tabel_minum_2019') <= 51) {
                return new Style({
                    fill: new Fill({
                        color: "#ff4040" // semi-transparent red
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    })
                });
            }

            // else if ...
            else {
                return new Style({
                    fill: new Fill({
                        color: "#ff0000" // semi-transparent yellow
                    }),
                    stroke: new Stroke({
                        color: '#000000',
                        width: 1,
                    })
                });
            }
        };

        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                url: './provinsi_statistik.geojson',
                format: new GeoJSON(),
            }),
            style: function (feature, resolution) {
                return getStyle(feature, resolution);
            },
        });

        vectorLayer.set('id', 'statistik_layer')


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
            if (l.get("id") === 'statistik_layer') {
                //console.log(i)
                idx = i;
            }

        })
       layers[idx].setVisible(visible);
        //layers[1].setSource(getBasemap());
    }, [visible]);

    return null;
};
export default StatisticLayer;