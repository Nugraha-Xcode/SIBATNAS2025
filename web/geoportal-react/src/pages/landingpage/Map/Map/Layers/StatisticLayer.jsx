import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest } from 'ol/source';
import { Image as ImageLayer } from 'ol/layer';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { Fill, Stroke, Style, Text } from 'ol/style';

const StatisticLayer = ({ zIndex = 0, visible }) => {
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
            maxZoom: 9,
            source: new VectorSource({
                url: './data/provinsi/provinsi_statistik.geojson',
                format: new GeoJSON(),
            }),
            style: function (feature, resolution) {
                return getStyle(feature, resolution);
            },
        });

        vectorLayer.set('id', 'statistik_layer')


        map.addLayer(vectorLayer);

        //map.on('click', function (evt) {
        //displayFeatureInfo(evt.pixel);
        //    alert(evt.pixel)
        //});


        const highlightStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 255, 255, 0.7)',
                width: 2,
            }),
        });

        const selectedStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 0, 255, 0.7)',
                width: 2,
            }),
        });

        const featureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: highlightStyle,
        });
        const featureSelected = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: selectedStyle,
        });


        let highlight;
        let selected;
        var overlay;

        const displayFeatureInfo = function (evt) {
            vectorLayer.getFeatures(evt.pixel).then(function (features) {
                if (overlay)
                    map.removeOverlay(overlay)
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    console.log(feature);
                    //info.innerHTML = feature.get('ECO_NAME') + ': ' + feature.get('NNH_NAME');
                    var container = document.createElement('div');
                    container.className = 'ol-popup';
                    //container.innerHTML="Halo"
                    var closer = document.createElement('span');
                    //closer.setAttribute("href", "");
                    closer.className = 'ol-popup-closer';
                    //<a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    //<div id="popup-content" ></div>
                    container.append(closer)
                    var content = document.createElement('div');
                    content.innerHTML = "tabel";
                    container.append(content)
                    overlay = new Overlay({
                        element: container,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250,
                        },
                    });

                    closer.addEventListener('click', function () {
                        //sourceHighlight.clear();
                        overlay.setPosition(undefined);
                        closer.blur();
            
                        return false;
                    });
                    

                    
                
                    map.addOverlay(overlay);
                    overlay.setPosition(evt.coordinate);
                } else {
                    //info.innerHTML = '&nbsp;';
                    //console.log("not found")
                }

                if (feature !== selected) {
                    if (selected) {
                        featureSelected.getSource().removeFeature(selected);
                    }
                    if (feature) {
                        featureSelected.getSource().addFeature(feature);
                    }
                    selected = feature;
                }

                /*

                if (feature.hasOwnProperty("properties")) {

                    console.log(features[0].properties)
                    var tabel = '<p>Layer: ' + vectorLayer.get('title') + '</p>';
                    tabel = tabel + '<div style="max-height:250px;overflow:auto;"><table class="table table-strip font-11">';
                    //tabel += '<tr><td>ID</td><td style="max-width:200px;overflow-wrap: break-word;"> ' + data.features[0].id + '</td></tr>'
                    for (var prop in feature.properties) {
                        //console.log(prop)
                        //console.log(feature.properties[prop])
                        tabel += '<tr><td>' + prop + '</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                    }
                    //feature.properties.forEach(element => {
                    //    console.log(element);
                    // });
                    tabel += "</table></div>"
                    //content.innerHTML = tabel;
                    console.log(tabel);
                    var container = document.createElement('div');
                    container.className = 'ol-popup';
                    //container.innerHTML="Halo"
                    var closer = document.createElement('span');
                    //closer.setAttribute("href", "");
                    closer.className = 'ol-popup-closer';
                    //<a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    //<div id="popup-content" ></div>
                    container.append(closer)
                    var content = document.createElement('div');
                    content.innerHTML = tabel;
                    container.append(content)
                    overlay = new Overlay({
                        element: container,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250,
                        },
                    });

                    closer.addEventListener('click', function () {
                        //sourceHighlight.clear();
                        overlay.setPosition(undefined);
                        closer.blur();
            
                        return false;
                    });

                    
                
                    map.addOverlay(overlay);
                    overlay.setPosition(evt.coordinate);
                }
                */
            });
        };
        
        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            vectorLayer.getFeatures(pixel).then(function (features) {
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    document.body.style.cursor = 'pointer'
                }else{
                    document.body.style.cursor = 'default'
                }

                if (feature !== highlight) {
                    if (highlight) {
                        featureOverlay.getSource().removeFeature(highlight);
                    }
                    if (feature) {
                        featureOverlay.getSource().addFeature(feature);
                    }
                    highlight = feature;
                }

            })
            //displayFeatureInfo(pixel);
            //
        });
        
        map.on('click', function (evt) {
            displayFeatureInfo(evt);
        });



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