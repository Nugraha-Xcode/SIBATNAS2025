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

const BBoxLayer = ({ zIndex = 0, visible, bbox, zoomBbox, setZoomBbox }) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        //console.log(bbox);
        var bboxFirst = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    bbox[0].toFixed(2),
                                    bbox[1].toFixed(2)
                                ],
                                [
                                    bbox[2].toFixed(2),
                                    bbox[1].toFixed(2)
                                ],
                                [
                                    bbox[2].toFixed(2),
                                    bbox[3].toFixed(2)
                                ],
                                [
                                    bbox[0].toFixed(2),
                                    bbox[3].toFixed(2)
                                ],
                                [
                                    bbox[0].toFixed(2),
                                    bbox[1].toFixed(2)
                                ]
                            ]
                        ]
                    }
                }
            ]
        }
        var sourceBbox = new VectorSource({
            format: new GeoJSON(),
            features: new GeoJSON().readFeatures(bboxFirst),
            wrapX: false
        });

        //console.log(sourceBbox);
        let bboxLayer = new OLVectorLayer({
            source: sourceBbox,
            zIndex: zIndex,
            visible: visible,
            style: new Style({
                /*
                fill: new FillStyle({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                */
                stroke: new StrokeStyle({
                    color: '#ff00ee',
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


        map.addLayer(bboxLayer);
        bboxLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(bboxLayer);
            }
        };

    }, [map]);

    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray()
        layers[3].setVisible(visible);
        //layers[1].setSource(getBasemap());
    }, [visible]);

    useEffect(() => {
        if (!map) return;
        if (zoomBbox) {
            let layers = map.getLayers().getArray()
            //layers[3].setVisible(visible);
            map.getView().fit(layers[3].getSource().getFeatures()[0].getGeometry())
            setZoomBbox(false)
        }
        //props.setPerformZoom(false)
    }, [zoomBbox]);

    useEffect(() => {
        if (!map) return;

        if (bbox) {
            let layers = map.getLayers().getArray()
            //layers[3].setVisible(visible);

            var _sourceBbox = layers[3].getSource()

            _sourceBbox.clear();
            
            var feature = new Feature({
                geometry: new Polygon([
                    [
                        [
                            bbox[0].toFixed(2),
                            bbox[1].toFixed(2)
                        ],
                        [
                            bbox[2].toFixed(2),
                            bbox[1].toFixed(2)
                        ],
                        [
                            bbox[2].toFixed(2),
                            bbox[3].toFixed(2)
                        ],
                        [
                            bbox[0].toFixed(2),
                            bbox[3].toFixed(2)
                        ],
                        [
                            bbox[0].toFixed(2),
                            bbox[1].toFixed(2)
                        ]
                    ]
                ]),
                name: 'Bbox'
            });
            //vectorSource.addFeature();
            _sourceBbox.addFeature(feature)
           // map.getView().fit(feature.getGeometry())
            
        }

    }, [bbox]);

    return null;
};
export default BBoxLayer;