import { useContext, useState, useEffect } from "react";
import MapContext from "./MapContext";
import Overlay from 'ol/Overlay';

import { Button, ButtonGroup, IconButton } from "@mui/material";

import { fromLonLat } from "ol/proj";

import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

import { Image as ImageLayer, Group as LayerGroup } from 'ol/layer';
import { transform } from 'ol/proj';

const PopUp = ({ coordinate, show, content, setShow, level, setLevel, kode, layer, setIdProvince, setIdMunicipal, setIdKecamatan, setIdDesa, list }) => {
    const { map } = useContext(MapContext); 
    const [attribut, setAttribut] = useState();    

    const indikator_ = [
        { id: 1, label: list[0], layer:'_1', column: 'PREVSTUNT'},
        { id: 2, label: list[1], layer:'_2', column: 'P_BADUTA'},
        { id: 3, label: list[2], layer:'_3', column: 'P_BALITA'},
        { id: 4, label: list[3], layer:'_4', column: 'P_AIRTDKLYK'},
        { id: 5, label: list[4], layer:'_5', column: 'P_JMBNTDKLYK'},
        { id: 6, label: list[5], layer:'_6', column: 'P_PUS'},
        { id: 7, label: list[6], layer:'_7', column: 'P_PUSHML'},
        { id: 8, label: list[7], layer:'_8', column: 'P_TLLMUDA'},
        { id: 9, label: list[8], layer:'_9', column: 'P_TLLTUA'},
        { id: 10, label: list[9], layer:'_10', column: 'P_TLLDEKAT'},
        { id: 11, label: list[10], layer:'_11', column: 'P_TLLBNYK'},
        { id: 12, label: list[11], layer:'_12', column: 'P_RISK'},
        { id: 13, label: list[12], layer:'_13', column: 'P_RISKMSKNEX'},
        { id: 14, label: list[13], layer:'_14', column: 'P_RISKMSKRTN'},
        { id: 15, label: list[14], layer:'_15', column: 'P_RISKTDKMSKN'}
      ];

    useEffect(() => {

        if (coordinate) {
            //console.log(coordinate)
            //console.log(transform(coordinate, 'EPSG:3857','EPSG:4326'))
            //console.log(show)
            map.getOverlayById('popup').setPosition(coordinate);
            //if (popup)
            //    popup.setPosition(transform(coordinate, 'EPSG:3857','EPSG:4326'));
        }
    }, [map, coordinate]);

    useEffect(() => {
        if (!map) return;
        
      
        var popup = new Overlay({
            id: 'popup',
            element: document.getElementById('popup'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });
        //if(coordinate)
        //    popup.setPosition(fromLonLat(coordinate));
        map.addOverlay(popup);

        
         map.on('singleclick', function (evt) {
             //
             setShow(true);
             popup.setPosition(evt.coordinate);

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
             
            console.log(idx);
             
            var group = layers[idx]
            var wms = group.getLayers();
            //console.log(wms)
    
            var idx = -1;
    
            wms.forEach(function (layer, i) {
                //var layerid = i;
                //console.log(layer.getVisible())
                if (layer instanceof ImageLayer) {
                    if (layer.getVisible()) {
                        idx = i;
                    }
                }
    
    
            });
            console.log(idx);
            var viewResolution = /** @type {number} **/ (map.getView().getResolution());
            console.log(viewResolution);
            var url;
            if (idx === -1) {
                alert("There is no WMS layer visible")
            } else {
                //console.log();
                var layer = wms.getArray()[idx]
                console.log(layer)
                console.log(layer.get("id"))
                var wmsSource = layer.getSource()

                url = wmsSource.getFeatureInfoUrl(
                    evt.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    { 'INFO_FORMAT': 'application/json' }
                    //text/html
                );
            }

            console.log(url)
            if (url) {
                //document.body.style.cursor = 'progress'
                setAttribut("...");
                fetch(url)
                    .then(function (response) { return response.text(); })
                    .then(function (html) {
                        //console.log(html)
                        var data = JSON.parse(html);
                                //console.log(html)
                        var feature = data.features[0];
                        //sourceHighlight.clear();
                        if (feature) {
                            console.log(feature)
                            //console.log(feature.geometry.coordinates[0])
                            var transform = true;
                            if (feature.geometry.type === "MultiPolygon") {
                                var koordinat = feature.geometry.coordinates[0][0][0][0]
                                //console.log(koordinat)
                                if (koordinat > 180 || koordinat < -180)
                                    transform = false;
                                //console.log(cek_koordinat);
                            } else {

                            }
                            //console.log(transform)
                            if (transform) {
                                //console.log(new GeoJSON().readFeature(feature, {featureProjection: 'EPSG:3857'}))
                                //sourceHighlight.addFeature(new GeoJSON().readFeature(feature, {
                                //    featureProjection: 'EPSG:3857'
                                //}))
                            } else {
                                //sourceHighlight.addFeature(new GeoJSON().readFeature(feature))
                            }

                            if (feature.hasOwnProperty("properties")) {
                                //console.log(data.features[0].properties)
                                var tabel = '<p>Layer: ' + layer.get('title') + '</p>';
                                var tampung = indikator_.filter(item => item.label === layer.get('title'))
                                console.log(tampung[0]);
                                tabel = tabel + '<div style="max-height:250px;overflow:auto;"><table class="table table-strip font-11">';
                                //tabel += '<tr><td>ID</td><td style="max-width:200px;overflow-wrap: break-word;"> ' + data.features[0].id + '</td></tr>'
                                for (var prop in feature.properties) {
                                    //console.log(prop)
                                    //console.log(feature.properties[prop])
                                    if (prop == "WADMPR"){
                                        tabel += '<tr><td>' + prop + '</td><td>:</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                                    }
                                    if(layer.get('id').includes("kabupaten") || layer.get('id').includes("kecamatan") || layer.get('id').includes("desa")){
                                        if (prop == "WADMKK"){
                                            tabel += '<tr><td>' + prop + '</td><td>:</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                                        }
                                    }
                                    if(layer.get('id').includes("kecamatan") || layer.get('id').includes("desa")){
                                        if (prop == "WADMKC"){
                                            tabel += '<tr><td>' + prop + '</td><td>:</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                                        }
                                    }
                                    if( layer.get('id').includes("desa")){
                                        if (prop == "WADMKD"){
                                            tabel += '<tr><td>' + prop + '</td><td>:</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '</td></tr>'
                                        }
                                    }

                                    if (prop == tampung[0].column ){
                                        tabel += '<tr><td>' + prop + '</td><td>:</td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + '%</td></tr>'
                                    }
                                }
                                //feature.properties.forEach(element => {
                                //    console.log(element);
                                // });
                                tabel += "</table></div>"
                                //content.innerHTML = tabel;
                                //console.log(tabel);
                                setAttribut(tabel);
                                /*
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
                                */
                                //overlay = new Overlay({
                                //    element: container,
                                //    autoPan: true,
                                //    autoPanAnimation: {
                                //         duration: 250,
                                //    },
                                //});
                                /*
                                closer.addEventListener('click', function () {
                                    //sourceHighlight.clear();
                                    //overlay.setPosition(undefined);
                                    closer.blur();
                        
                                    return false;
                                });

                                */
                            
                                //map.addOverlay(overlay);
                                //overlay.setPosition(evt.coordinate);
                            }
                        }
                    });
            }
             
         })
         


        /*
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
        var k = "test";//create_content(feature, info);
        content.innerHTML = k +"<br />";
        var b = document.createElement('button');
        b.innerHTML = "zoom";
        content.append(b);
        //k = k + "<br /> <button>zoom to</button>";
        //content.innerHTML = k;
        container.append(content)
        var overlay = new Overlay({
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
        */

    }, [map]);

    function handleClose() {
        setShow(false)
        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'selected_layer') {
                idx = i;
            }
        })
        var sourceSelected = layers[idx].getSource();
        //console.log(sourceSelected)
        sourceSelected.clear()
    }

    function handleZoom() {
        setShow(false)
        let layers = map.getLayers().getArray();
        var idx = 0;
        layers.forEach(function (l, i) {
            if (l.get("id") === 'selected_layer') {
                idx = i;
            }
        })
        var sourceSelected = layers[idx].getSource();
        //console.log(sourceSelected)
        map.getView().fit(sourceSelected.getExtent())
        sourceSelected.clear()
        if (level === "negara") {
            setLevel("provinsi")
            setIdProvince(kode)
        } else if (level === "provinsi") {
            setLevel("kabkot")
            setIdMunicipal(kode)
        } else if (level === "kabkot") {
            setLevel("kecamatan")
            setIdKecamatan(kode)
        } else if (level === "kecamatan") {
            setLevel("desa")
            setIdDesa(kode)
        }

        //handleClose();

    }

    function handleZoomOut() {
        setShow(false)

        if (level === "desa") {
            setLevel("kecamatan")
            setIdKecamatan(kode)
        } else if (level === "kecamatan") {
            setLevel("kabkot")
            setIdMunicipal(kode)
        } else if (level === "kabkot") {
            setLevel("provinsi")
            setIdProvince(kode)
        } else if (level === "provinsi") {
            setLevel("negara")
            setIdProvince(0)
        }

        //handleClose();

    }
    var listArea = [
        /*53,
        '53.01','53.02','53.03','53.04','53.05','53.06','53.07','53.08','53.09','53.10','53.11','53.12','53.13','53.14','53.15','53.16','53.17','53.18','53.19','53.20','53.21','53.71',
        '53.02.01', '53.02.02', '53.02.03', '53.02.04', '53.02.05', '53.02.06', '53.02.07', '53.02.08', '53.02.09', '53.02.10', '53.02.11', '53.02.12', '53.02.13', '53.02.14', '53.02.15', 
        '53.02.16', '53.02.17', '53.02.18', '53.02.19', '53.02.20', '53.02.21', '53.02.22', '53.02.23', '53.02.24', '53.02.25', '53.02.26', '53.02.27', '53.02.28', '53.02.29', '53.02.30', 
        '53.02.31', '53.02.32',
        */
        '53.02.02.2001', '53.02.02.2003', '53.02.02.2006', '53.02.02.2008', '53.02.02.2010', '53.02.02.2012', '53.02.02.2013'];

    function generate_button() {
        if (level === "kecamatan" || level === "desa") {
            return ""
        }else{
            return ""
           return <Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={() => handleZoom()}>Zoom In</Button>
        }
        /*
        if (level === "negara") {
            if (kode == 12)
                return <Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={() => handleZoom()}>Zoom In</Button>
            else
                return ""
        } else if (level === "kecamatan") {
            if (String(kode).includes('12.71'))
                return <Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={() => handleZoom()}>Zoom In</Button>
            else
                return ""

        } else if (level === "desa") {
                return ""
        } else {
            return <Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={() => handleZoom()}>Zoom In</Button>
        }*/
    }
    return (
        <div id="popup" className="ol-popup" style={{ display: show ? 'block' : 'none' }}>
            <span className="ol-popup-closer" onClick={() => handleClose()}></span>
            <div dangerouslySetInnerHTML={{ __html: attribut }} style={{ maxHeight: "250px", overflowY: 'auto' }} />
            {
                generate_button()
            }
            {
                //level === "desa"? "": listArea.includes(kode)? <Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={()=>handleZoom()}>Zoom In</Button>:""}


                //<Button variant="contained" size="small" fullWidth color="secondary" disableElevation={true} style={{ marginTop: "15px", borderRadius: "20px" }} onClick={()=>handleZoomOut()}>Zoom Out</Button>
            }
        </div>
    )
};



export default PopUp;