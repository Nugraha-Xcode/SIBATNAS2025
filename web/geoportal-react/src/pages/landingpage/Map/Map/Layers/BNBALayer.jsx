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
import { Fill, Stroke, Style, Text, Circle } from 'ol/style';
import { color } from "highcharts";

const StatisticLayer = ({ zIndex = 0, visible = true, kode = 53, layer = "pus_hamil", loadKabupaten }) => {
    const { map } = useContext(MapContext);

    const [listen, setListen] = useState();

    function stunting(feature) {
        var field = "PREV_STUNT"
        if (feature.get(field) <= 20) {
            return new Style({
                fill: new Fill({
                    color: "#9bc31d" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 20.01 && feature.get(field) <= 29.90) {
            return new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 29.90 && feature.get(field) <= 39.80) {
            return new Style({
                fill: new Fill({
                    color: "#e68d0f" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 39.80) {
            return new Style({
                fill: new Fill({
                    color: "#cb151a" // semi-transparent red
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
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        }
    }

    function underweight(feature) {
        var field = "PREV_UDRWG"
        if (feature.get(field) <= 10) {
            return new Style({
                fill: new Fill({
                    color: "#9bc31d" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 10.01 && feature.get(field) <= 19.90) {
            return new Style({
                fill: new Fill({
                    color: "#f4d53c" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 19.90 && feature.get(field) <= 29.90) {
            return new Style({
                fill: new Fill({
                    color: "#e68d0f" // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) > 29.90) {
            return new Style({
                fill: new Fill({
                    color: "#cb151a" // semi-transparent red
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
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        }
    }
    /*
        var getStyle = function (layer, feature, resolution) {
            if (layer === "pus_hamil") {
                return pus_hamil(feature)
            } else if (layer === "pra_sejahtera") {
                return pra_sejahtera(feature)
            } else if (layer === "air_minum") {
                return air_minum(feature)
            } else if (layer === "rumah") {
                return rumah(feature)
            } else if (layer === "jamban") {
                return jamban(feature)
            } else if (layer === "stunting") {
                return stunting(feature)
            } else if (layer === "underweight") {
                return underweight(feature)
            }
        };
    */
    function resiko(feature) {
        //return createStyleIcon(feature, 'Klasifikasi', 'V', '#ff0000')
        return createStyleNew(feature, 'Klasifikasi');

    }
    function createStyleNew(feature, field) {
        //console.log(feature);
        //console.log(feature.get(field), field);
        if (feature.get(field) == "KRS miskin") {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#ec3c3f',
                    }),
                }),
            });
        }else if (feature.get(field) == "Miskin"){
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#e68c0e',
                    }),
                }),
            });
        }else if (feature.get(field) == "KRS"){
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#f5d641',
                    }),
                }),
            });
        }else if (feature.get(field) == "Tidak miskin"){
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#9bc31d',
                    }),
                }),
            });
        }
    }


    function createStyleIcon(feature, field, value, color) {
        //console.log(feature.get(field), value)
        if (feature.get(field) == value) {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#ff0000',
                    }),
                }),
            });
        }
        else {
            return new Style({
                image: new Circle({
                    radius: 4,
                    fill: new Fill({
                        color: '#00ff00',
                    }),
                }),
            });
        }
    }

    function anak_0_23(feature) {
        return createStyleEqual(feature, 'BLN_0_23NC', ["#e68d0f", "#9bc31d"], ["12%-56%", "6%-12%"])
    }
    function anak_24_59(feature) {
        return createStyleEqual(feature, 'BLN_24_60NC', ["#e68d0f", "#9bc31d"], ["25%-62.5%", "12.5%-25%"])
    }
    function balita(feature) {
        return createStyleEqual(feature, 'BALITANC', ["#e68d0f", "#9bc31d"], ["36%-68%", "18%-36%"])
    }
    function pra_sejahtera(feature) {
        return createStyleEqual(feature, 'PRASEJNNC', ["#e68d0f", "#9bc31d"], ["12%-56%", "6%-12%"])
    }

    function jamban(feature) {
        return createStyleThree(feature, 'JMBNLYKBNC', ["#e68d0f", "#9bc31d", "#70a82d"], ["15%-57.5%", "7.5%-15%", "<7.5%"])
    }

    function rumah(feature) {
        return createStyleThree(feature, 'RMHLYKBNC', ["#cb151a", "#e68d0f", "#9bc31d"], [">66%", "32%-66%", "16%-32%"])
    }
    function air_minum(feature) {
        return createStyleThree(feature, 'SMBAIRBNC', ['#e68d0f', '#9bc31d', '#70a82d'], ['10%-55%', '5%-10%', '<5%'])
    }
    function pus_hamil(feature) {
        return createStyleEqual(feature, 'PUSHMLNC', ["#e68d0f", "#9bc31d"], ["4%-52%", "2%-4%"])
    }

    function createStyleThree(feature, field, color, value) {
        if (feature.get(field) == value[0]) {
            return new Style({
                fill: new Fill({
                    color: color[0] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) == value[1]) {
            return new Style({
                fill: new Fill({
                    color: color[1] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) == value[2]) {
            return new Style({
                fill: new Fill({
                    color: color[2]// semi-transparent red
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
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        }
    }
    function createStyleEqual(feature, field, color, value) {
        if (feature.get(field) == value[0]) {
            return new Style({
                fill: new Fill({
                    color: color[0] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else if (feature.get(field) == value[1]) {
            return new Style({
                fill: new Fill({
                    color: color[1] // semi-transparent red
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        } else {
            return new Style({
                fill: new Fill({
                    color: "#ffffff" // semi-transparent yellow
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1,
                })
            });
        }
    }
    function create_content(feature, layer) {
        if (layer == 'pus_hamil')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'pra_sejahtera')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'air_minum')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'rumah')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'jamban')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'stunting')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'underweight')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'resiko')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('Nama_Kepala_Keluarga') + "</span><br />RT: <b>" + feature.get('Nama_RT') + "</b><br />RW: <b>" + feature.get('Nama_RW') 
            + "</b><br />Status Keluarga Verval: <b>" + (feature.get('Status_Keluarga_Verval') ==1? "V" : "X") 
            + "</b><br />Baduta: <b>" + (feature.get('Baduta_Final') ==1? "V" : "X")
            + "</b><br />Balita: <b>" + (feature.get('Balita_Final') ==1? "V" : "X") 
            + "</b><br />PUS: <b>" + (feature.get('PUS_Final') ==1? "V" : "X") 
            + "</b><br />PUS Hamil: <b>" + (feature.get('PUS_HamiL_Final') ==1? "V" : "X") 
            + "</b><br />Air Mimum Layak: <b>" + (feature.get('Air_Final') ==1? "V" : "X") 
            + "</b><br />Jamban Layak: <b>" + (feature.get('Jamban_Final') ==1? "V" : "X") 
            + "</b><br />PUS Muda: <b>" + (feature.get('Muda_Final') ==1? "V" : "X") 
            + "</b><br />PUS Tua: <b>" + (feature.get('Tua_Final') ==1? "V" : "X") 
            + "</b><br />PUS Dekat: <b>" + (feature.get('Dekat_Final') ==1? "V" : "X") 
            + "</b><br />PUS Banyak: <b>" + (feature.get('Banyak_Final') ==1? "V" : "X") 
            + "</b><br />Risiko: <b>" + (feature.get('Risiko_Final') ==1? "V" : "X") 
            + "</b><br />Prioritas: <b>" + (feature.get('Prioritas')) 
            + "</b><br />Klasifikasi: <b>" + feature.get('Klasifikasi') + "</b>";
        else if (layer == 'anak_0_23')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'anak_24_59')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
        else if (layer == 'balita')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('KEP_KLRGA') + "</span><br />RT: <b>" + feature.get('NAMA_RT') + "</b><br />RW: <b>" + feature.get('NAMA_RW') + "</b><br />Resiko Stunting: <b>" + feature.get('RISKSTUNT') + "</b>";
    }


    useEffect(() => {
        if (!map) return;
        /*
        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                //url: './data/bnba/' + kode + '.geojson',
                url: './2023/desa_fixed.geojson',
                format: new GeoJSON(),
            }),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.7)',
                    width: 2,
                }),
            }),
        });

        vectorLayer.set('id', 'bnba_layer')

        vectorLayer.setStyle(resiko);
        map.addLayer(vectorLayer);
        */
        const vectorLayer2 = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                url: './2023/desa_fixed.geojson',
                format: new GeoJSON(),
            }),
            style: new Style({
                image: new Circle({
                    radius: 3,
                    fill: new Fill({
                        color: '#ff0000',
                    }),
                }),
            })
        });

        vectorLayer2.set('id', 'bnba_layer_pt')
        vectorLayer2.setStyle(resiko);
        console.log('bnba_layer');
        map.addLayer(vectorLayer2);

        //map.on('click', function (evt) {
        //displayFeatureInfo(evt.pixel);
        //    alert(evt.pixel)
        //});
        
        const selectedStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(0, 0, 255, 0.7)',
                width: 2,
            }),
        });

        const featureSelected = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: selectedStyle,
        });


        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            vectorLayer2.getFeatures(pixel).then(function (features) {
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    document.body.style.cursor = 'pointer'
                } else {
                    document.body.style.cursor = 'default'
                }
                /*
                if (feature !== highlight) {
                    if (highlight) {
                        featureOverlay.getSource().removeFeature(highlight);
                    }
                    if (feature) {
                        featureOverlay.getSource().addFeature(feature);
                    }
                    highlight = feature;
                }
                */
            })
            //displayFeatureInfo(pixel);
            //
        });

        let highlight;
        let selected;
        var overlay;
        const displayFeatureInfo = function (evt) {
            vectorLayer2.getFeatures(evt.pixel).then(function (features) {
                //console.log(features);
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
                    //var info = document.getElementById('info').innerHTML;
                    var k = create_content(feature, "resiko");
                    content.innerHTML = k;
                    container.append(content)
                    overlay = new Overlay({
                        element: container,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250,
                        },
                    });

                    closer.addEventListener('click', function () {
                        featureSelected.getSource().clear();
                        overlay.setPosition(undefined);
                        closer.blur();
                        selected = null;
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
            });
        };
        map.on('singleclick', function (evt) {
            displayFeatureInfo(evt);
            //document.getElementById('info').innerHTML = '';
            /*
             if (overlay)
                 map.removeOverlay(overlay)
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
             //var k = create_content(feature, layer);
             const info = document.getElementById('info');
             var k = info.innerHTML + "<br /> <button>zoom to</button>";
             content.innerHTML = k;
             container.append(content)
             overlay = new Overlay({
                 element: container,
                 autoPan: true,
                 autoPanAnimation: {
                     duration: 250,
                 },
             });
    
             closer.addEventListener('click', function () {
                 featureSelected.getSource().clear();
                 overlay.setPosition(undefined);
                 closer.blur();
                 return false;
             });
             map.addOverlay(overlay);
             overlay.setPosition(evt.coordinate);
             */
        })



        //ImageArcGISRest

        return () => {
            if (map) {
                map.removeLayer(vectorLayer2);
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
            if (l.get("id") === 'bnba_layer') {
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
            if (l.get("id") === 'bnba_layer_pt') {
                //console.log(i)
                idx = i;
            }

        })

        if (layer == 'pus_hamil')
            layers[idx].setStyle(pus_hamil);
        else if (layer == 'pra_sejahtera')
            layers[idx].setStyle(pra_sejahtera);
        else if (layer == 'air_minum')
            layers[idx].setStyle(air_minum);
        else if (layer == 'rumah')
            layers[idx].setStyle(rumah);
        else if (layer == 'jamban')
            layers[idx].setStyle(jamban);
        else if (layer == 'stunting')
            layers[idx].setStyle(stunting);
        else if (layer == 'underweight')
            layers[idx].setStyle(underweight);
        else if (layer == 'resiko')
            layers[idx].setStyle(resiko);
        else if (layer == 'anak_0_23')
            layers[idx].setStyle(anak_0_23);
        else if (layer == 'anak_24_59')
            layers[idx].setStyle(anak_24_59);
        else if (layer == 'balita')
            layers[idx].setStyle(balita);

        /*{
            layers[idx].setStyle(function(feature) =>{
                createStyleEqual('BALITANC',["#e68d0f","#9bc31d"],["36%-68%","18%-36%"]));
            })
        }*/
        //layers[1].setSource(getBasemap());
        /*
        var vectorLayer = layers[idx];
    
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
                console.log(features);
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
                    var k = create_content(feature, layer);
                    k = k + "<br /> <button>zoom to</button>";
                    content.innerHTML = k;
                    container.append(content)
                    overlay = new Overlay({
                        element: container,
                        autoPan: true,
                        autoPanAnimation: {
                            duration: 250,
                        },
                    });
    
                    closer.addEventListener('click', function () {
                        featureSelected.getSource().clear();
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
            });
        };
    
     
        //map.on('click', function (evt) {
        //    displayFeatureInfo(evt);
        //  });
        */
    }, [layer]);

    return null;
};
export default StatisticLayer;