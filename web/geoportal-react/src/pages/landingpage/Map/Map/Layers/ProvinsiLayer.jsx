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

const StatisticLayer = ({ zIndex = 0, visible = true, layer = "pus_hamil", loadKabupaten }) => {
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
        return createStyleThree(feature, 'RISKNC', ["#cb151a", "#e68d0f", "#9bc31d"], [">90.5%", "81%-90.5%", "40.5%-81%"])
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
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah PUS Hamil: <b>" + parseInt(feature.get('PUSHMLN')).toLocaleString('id-ID') + "</b><br/>Persentase PUS Hamil: <b>" + parseFloat(feature.get('PUSHMLN')).toFixed(2).replace(".", ",") + "%</b>";
        else if (layer == 'pra_sejahtera')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Pra Sejahtera: <b>" + parseInt(feature.get('PRASEJ')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga Pra Sejahtera: <b>" +  parseFloat(feature.get('PRASEJN')).toFixed(2).replace(".", ",") + "%</b>";
        else if (layer == 'air_minum')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran Memiliki Sumber Air Minum Tidak Layak: <b>" + parseInt(feature.get('SMBAIRB')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga Sasaran Memiliki Sumber Air Minum Tidak Layak: <b>" +  parseFloat(feature.get('SMBAIRBN')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'rumah')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran Memiliki Rumah Tidak Layak Huni: <b>" + parseInt(feature.get('RMHLYKB')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga Sasaran Memiliki Rumah Tidak Layak Huni: <b>" +  parseFloat(feature.get('RMHLYKBN')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'jamban')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran Memiliki Jamban Tidak Layak: <b>" + parseInt(feature.get('JMBNLYKB')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga Sasaran Memiliki Jamban Tidak Layak: <b>" +  parseFloat(feature.get('JMBNLYKBN')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'stunting')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Prevalensi Stunting: <b>" +  parseFloat(feature.get('PREV_STUNT')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'underweight')
            return"<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Prevalensi Underweight: <b>" +  parseFloat(feature.get('PREV_UDRWG')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'resiko')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Beresiko Stunting: <b>" + parseInt(feature.get('RISK')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga Beresiko Stunting: <b>" +  parseFloat(feature.get('RISKN')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'anak_0_23')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga dengan Anak Usia 0-23 Bulan: <b>" + parseInt(feature.get('BLN_0_23')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga dengan Anak Usia 0-23 Bulan: <b>" +  parseFloat(feature.get('BLN_0_23N')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'anak_24_59')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga dengan Anak Usia 24-59 Bulan: <b>" + parseInt(feature.get('BLN_24_59')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga dengan Anak Usia 24-59 Bulan: <b>" +  parseFloat(feature.get('BLN_24_59N')).toFixed(2).replace(".", ",")  + "%</b>";
        else if (layer == 'balita')
            return "<span style='font-weight:bolder;color: #2F4E6F'>" + feature.get('WADMPR') + "</span><br />Jumlah Keluarga: <b>" + parseInt(feature.get('JML_KLG')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga Sasaran: <b>" + parseInt(feature.get('KLG_SSRN')).toLocaleString('id-ID') + "</b><br />Jumlah Keluarga dengan Anak Usia Balita: <b>" + parseInt(feature.get('BALITAB')).toLocaleString('id-ID') + "</b><br/>Persentase Keluarga dengan Anak Usia Balita: <b>" +  parseFloat(feature.get('BALITAN')).toFixed(2).replace(".", ",")  + "%</b>";
    }

    
    useEffect(() => {
        if (!map) return;

        const vectorLayer = new VectorLayer({
            zindex: zIndex,
            visible: visible,
            source: new VectorSource({
                url: './data/provinsi/provinsi_stats.geojson',
                format: new GeoJSON(),
            }),
            // style: function (feature, resolution) {
            //     return getStyle(layer, feature, resolution);
            //},
        });

        vectorLayer.set('id', 'provinsi_layer')


        map.addLayer(vectorLayer);

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
            vectorLayer.getFeatures(pixel).then(function (features) {
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
            vectorLayer.getFeatures(evt.pixel).then(function (features) {
                //console.log(features);
                if (overlay)
                    map.removeOverlay(overlay)
                const feature = features.length ? features[0] : undefined;
                //const info = document.getElementById('info');
                if (features.length) {
                    //console.log(feature);
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
                    var info = document.getElementById('info').innerHTML;
                    var k = create_content(feature, info);
                    content.innerHTML = k +"<br />";
                    var b = document.createElement('button');
                    b.innerHTML = "zoom";
                    content.append(b);
                    //k = k + "<br /> <button>zoom to</button>";
                    //content.innerHTML = k;
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
            if (l.get("id") === 'provinsi_layer') {
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
            if (l.get("id") === 'provinsi_layer') {
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