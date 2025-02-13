import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import { Group as LayerGroup } from "ol/layer";
import { ImageWMS as ImageWMSSource, ImageArcGISRest, Vector as VectorSource, TileArcGISRest } from 'ol/source';
import { Image as ImageLayer, Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';

import { GeoJSON } from 'ol/format';

import Config from '../../../config.json';

const GroupLayer = ({ zIndex = 0, mapLayer, identifierDelete, setIdentifierDelete }) => {
    const { map } = useContext(MapContext);


    useEffect(() => {
        if (!map) return;

        let layerGroup = new LayerGroup({
            zIndex,
        });

        map.addLayer(layerGroup);
        /*
        var wmsSource = new ImageWMSSource({
            //Config.proxy_domain + 
            url: 'http://geoportal.palembang.go.id/geoserver/wms',
            params: { 'LAYERS': 'Dukcapil-PLG:jumlah_penduduk_pekerjaan_kec_ar_167120200831044858' },
            ratio: 1,
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });
        var wmsLayer = new ImageLayer({
            source: wmsSource
        })
        wmsLayer.set('id', 'id')
        wmsLayer.set('title', 'title')

        
        //console.log(map.getLayerGroup())
        //var group = map.getLayerGroup()

        //var layers = peta.getLayers().getArray();
        //var group = layers[i_group].getLayers().getArray()
        //console.log(layers)
        //group.push(wmsLayer)
        //console.log(layers)
        layerGroup.getLayers().array_.push(wmsLayer)


        var esriSource = new ImageArcGISRest({
            //Config.proxy_domain + 
            ratio: 1,
            params: {},
            url: 'https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/Danau_50K/MapServer',
        });
        var esriLayer = new ImageLayer({
            source: esriSource
        })
        esriLayer.set('id', 'id2')
        esriLayer.set('title', 'title2')
        layerGroup.getLayers().array_.push(esriLayer)
        */
        //ImageArcGISRest

        return () => {
            if (map) {
                map.removeLayer(layerGroup);
            }
        };
    }, [map]);

    useEffect(() => {
        if (!map) return;
        //let layers = map.getLayers().getArray();
        //layers[0].setSource(getBasemap());

        if (mapLayer.length > 0) {
            //console.log(mapLayer)
            //console.log(props.mapLayer[props.mapLayer.length - 1])
            //var row = props.mapLayer[props.mapLayer.length - 1]
            //console.log(row)
            //console.log(row.layer)
            //
            var layers = map.getLayers().getArray();
            //console.log(layers);
            //console.log(layers[5])
            var idx = 0;
            layers.forEach(function (l, i) {
                //console.log(l)
                if (l instanceof LayerGroup) {
                    //console.log(i)
                    idx = i;
                }

            })
            var group = layers[idx]
            //console.log(group)

            //var group_arr = layers[idx].getLayers().getArray()
            //console.log(group_arr)

            mapLayer.forEach(function (l, y) {
                //console.log(l)

                var check = false
                //var group = map.getLayerGroup()

                //console.log(group)
                group.getLayers().forEach(function (layer, i) {
                    if (layer.get('id') === l.id) {
                        layer.setVisible(l.visible)
                        layer.setOpacity(parseFloat(l.opacity))
                        //console.log(l.opacity)
                        check = true;
                        map.updateSize();
                    }
                })
                if (!check) {
                    //alert('oi')
                    if (l.tipe === "wms") {
                        //alert('main')
                        //Config.proxy_domain + 
                        if (l.server === 'geoserver') {
                            //alert('geo')
                            var wmsSource = new ImageWMSSource({
                                url: Config.proxy_domain + l.url,
                                params: { 'LAYERS': l.layer },
                                ratio: 1,
                                serverType: l.server,
                                crossOrigin: 'anonymous'
                            });
                            var wmsLayer = new ImageLayer({
                                source: wmsSource
                            })
                            wmsLayer.set('id', l.id)
                            wmsLayer.set('title', l.title)
                            //map.addLayer(wmsLayer)
                            group.getLayers().array_.push(wmsLayer)
                            wmsSource.on('imageloadstart', function (event) {
                                //console.log('imageloadstart event', event);
                                map.updateSize();
                                //replace with your custom action
                                //var elemId = event.target.params_.ELEMENTID;
                                //document.getElementById(elemId).src = 'css/images/tree_loading.gif';
                            });

                            wmsSource.on('imageloadend', function (event) {
                                //console.log('imageloadend event', event);
                                map.updateSize();
                                //replace with your custom action
                                //var elemId = event.target.params_.ELEMENTID;
                                //document.getElementById(elemId).src = 'css/images/ok.png';
                            });

                            wmsSource.on('imageloaderror', function (event) {
                                console.log('imageloaderror event', event);
                                //alert('imageloaderror event', event)
                                //replace with your custom action
                                //var elemId = event.target.params_.ELEMENTID;
                                //document.getElementById(elemId).src = 'css/images/no.png';
                            });

                        } else {

                            if (l.url.includes("ImageServer")) {
                                var esriSource = new TileArcGISRest({
                                    url: l.url,
                                });
                                var esriLayer = new TileLayer({
                                    source: esriSource
                                })
                                esriLayer.set('id', l.id)
                                esriLayer.set('title', l.title)
                                //map.addLayer(wmsLayer)
                                group.getLayers().array_.push(esriLayer)
                                esriSource.on('imageloadstart', function (event) {
                                    //console.log('imageloadstart event', event);
                                    map.updateSize();
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/tree_loading.gif';
                                });
    
                                esriSource.on('imageloadend', function (event) {
                                    //console.log('imageloadend event', event);
                                    map.updateSize();
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/ok.png';
                                });
    
                                esriSource.on('imageloaderror', function (event) {
                                    console.log('imageloaderror event', event);
                                    //alert('imageloaderror event', event)
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/no.png';
                                });
                            } else {
                                var esriSource = new ImageArcGISRest({
                                    //Config.proxy_domain + 
                                    ratio: 1,
                                    params: {},
                                    url: l.url,
                                });
                                var esriLayer = new ImageLayer({
                                    source: esriSource
                                })
                                esriLayer.set('id', l.id)
                                esriLayer.set('title', l.title)
                                //map.addLayer(wmsLayer)
                                group.getLayers().array_.push(esriLayer)
                                esriSource.on('imageloadstart', function (event) {
                                    //console.log('imageloadstart event', event);
                                    map.updateSize();
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/tree_loading.gif';
                                });
    
                                esriSource.on('imageloadend', function (event) {
                                    //console.log('imageloadend event', event);
                                    map.updateSize();
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/ok.png';
                                });
    
                                esriSource.on('imageloaderror', function (event) {
                                    console.log('imageloaderror event', event);
                                    //alert('imageloaderror event', event)
                                    //replace with your custom action
                                    //var elemId = event.target.params_.ELEMENTID;
                                    //document.getElementById(elemId).src = 'css/images/no.png';
                                });
                            }

                        }

                    } else if (l.tipe === 'zip') {
                        var shapeSource = new VectorSource({
                            features: new GeoJSON().readFeatures(l.layer, {
                                featureProjection: 'EPSG:3857'
                            }),
                            wrapX: false
                        })

                        var shapeLayer = new VectorLayer({
                            source: shapeSource,
                            zIndex: 899,
                        });


                        shapeLayer.set('id', l.id)
                        shapeLayer.set('title', l.title)
                        //map.addLayer(wmsLayer)
                        group.getLayers().array_.push(shapeLayer)
                        map.updateSize();
                    }
                }
            });
            map.updateSize();
        }
    }, [mapLayer]);

    useEffect(() => {
        if (!map) return;
        //alert(props.showBbox)

        if (identifierDelete) {
            // alert('ok')
            //console.log(map.getLayers().getArray().length)

            var layers = map.getLayers().getArray();
            //console.log(layers);
            //console.log(layers[5])
            var idx = 0;
            layers.forEach(function (l, i) {
                //console.log(l)
                if (l instanceof LayerGroup) {
                    //console.log(i)
                    idx = i;
                }

            })
            var group = layers[idx];

            group.getLayers().forEach(function (layer, i) {
                //alert('ya')
                //console.log(layer);
                if (layer) {
                    //console.log(layer.getKeys())
                    if (layer.getKeys().includes("id")) {
                        //console.log(layer);
                        //alert('wow')
                        //console.log(identifierDelete)
                        console.log(layer.get("id"))
                        if (layer.get("id") === identifierDelete) {
                            //alert('oi')
                            //console.log(group.getLayers().array_)
                            group.getLayers().array_.splice(i, 1);
                            //console.log(group.getLayers().array_)

                            setIdentifierDelete('');
                            map.updateSize();
                        }
                    }
                }
                /*
                if (layer.get("id") !== undefined && layer.get("id") === props.identifierDelete) {
                    
                }
                */
            });

            //if (candidate) {
            //map.removeLayer(candidate)
            //group.getLayers().array_.pop(candidate)
            //}


        }


    }, [identifierDelete])
    /*
    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray()
        layers[0].setSource(getBasemap());
    }, [basemap]);
    */
    return null;
};
export default GroupLayer;