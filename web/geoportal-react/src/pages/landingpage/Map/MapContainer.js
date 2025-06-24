import React, { useContext, useEffect, useRef, useState } from "react";
import { MapViewerContext } from "src/contexts/MapViewerContext";
import { fromLonLat } from "ol/proj";
import Zoom from "ol/control/Zoom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";
import XYZ from "ol/source/XYZ";
import { getTopLeft, getBottomRight } from "ol/extent";

import { Image as ImageLayer, Group as LayerGroup } from "ol/layer";
import Overlay from "ol/Overlay.js";
import { toStringHDMS } from "ol/coordinate.js";
import { toLonLat } from "ol/proj.js";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { ImageWMS } from "ol/source";

import * as ol from "ol";
import "ol/ol.css";
import "./Map.css";
//import ZoomControl from "./controllers/Zoom";

const MapContainer = ({ children, zoom, center }) => {
  const { map, setMapCenter, setMapZoom } = useContext(MapViewerContext); // Access map and context functions

  //const mapRef = useRef();
  //const [map, setMap] = useState(null);
  // on component mount
  /*
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [
        new TileLayer({
          //source: new OSM(),
          //source: new BingMaps({
          //  key: "AjnoIAYLqvOoEE2xztBsU8enLK57KFsM9JTfJKdo4658pDU3woz2OCeejcgBCq3t",
          //  imagerySet: "AerialWithLabelsOnDemand",
          // placeholderTiles: false, // Optional. Prevents showing of BingMaps placeholder tiles
          //}),
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions:
              'Tiles Imagery © <a target="_blank" href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ArcGIS</a>',
            crossOrigin: "Anonymous",
          }),
        }),
      ],
      controls: [],
      overlays: [],
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);
  */

  useEffect(() => {
    //const ori = [117, -1]; // Set center coordinates of Indonesia
    //const zoom = 5; // Set zoom level for Indonesia
    //const center = [93, -6];
    setMapCenter(fromLonLat(center));
    setMapZoom(zoom);
    //map.setTarget(mapRef.current);
    //setMap(mapObject);
    //animateZoomTo(map.getView(), zoom + 5, fromLonLat(center)); // Set zoom level for Indonesia
    map.setTarget("map-container"); // Set the target for the map

    map.getControls().forEach((control) => {
      //console.log(control);
      map.removeControl(control);
      //if (control instanceof Zoom) {
      // map.removeControl(control);
      //}
    });

    /*

    const windData = [
      { lon: 0, lat: 0, u: 10, v: 5 },
      { lon: 1, lat: 0, u: 10, v: 5 }, // Example data point
      { lon: 2, lat: 0, u: 10, v: 5 }, // Example data point
      { lon: 3, lat: 0, u: 10, v: 5 }, // Example data point
      { lon: 4, lat: 0, u: 10, v: 5 }, // Example data point
      // Add more data points as needed
    ];

    // Create features for wind data
    const features = windData.map((data) => {
      const [x, y] = fromLonLat([data.lon, data.lat]);
      const point = new Point([x, y]);
      const feature = new Feature(point);
      // Set wind speed and direction as properties for styling
      feature.setProperties({ u: data.u, v: data.v });
      return feature;
    });

    // Create vector source and layer for wind data
    const vectorSource = new VectorSource({
      features: features,
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      // Add your custom wind animation style here
    });

    map.addLayer(vectorLayer);
    */
    // Add custom zoom control
    //const zoomControl = new ZoomControl({ map });
    //map.addControl(zoomControl);
    // }, [map, setMapCenter, setMapZoom]);

    const container = document.getElementById("popup");
    const content = document.getElementById("popup-content");
    const closer = document.getElementById("popup-closer");

    /**
     * Create an overlay to anchor the popup to the map.
     */
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    // Tambahkan overlay ke peta
    map.addOverlay(overlay);
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    map.on("singleclick", async function (evt) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      //console.log(coordinate);
      var viewResolution = /** @type {number} **/ (map.getView().getResolution());
      var layers = map.getLayers().getArray();
      //console.log(layers);
      //console.log(layers[5]);
      var idx = 0;
      layers.forEach(function (l, i) {
        //console.log(l);
        if (l instanceof LayerGroup) {
          //console.log(i)
          idx = i;
        }
      });
      var group = layers[idx];
      var wms = group.getLayers();
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
      var url;
      if (idx > -1) {
        var layer = wms.getArray()[idx];
        var wmsSource = layer.getSource();
        if (wmsSource instanceof ImageWMS) {
          // Untuk GeoServer
          url = wmsSource.getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            "EPSG:3857",
            { INFO_FORMAT: "application/json" }
          );
          if (url) {
            document.body.style.cursor = "progress";
            fetch(url)
              .then(function (response) {
                return response.text();
              })
              .then(function (html) {
                var data = JSON.parse(html);
                
                // pengecekan apakah ada fitur
                if (!data.features || data.features.length === 0) {
                  overlay.setPosition(undefined);
                  content.innerHTML = "";
                  return;
                }
    
                var feature = data.features[0];
                if (feature && feature.hasOwnProperty("properties")) {
                  var tabel = "<p>Layer: " + layer.get("title") + "</p>";
                  tabel = tabel + '<div style="max-height:250px;overflow:auto;"><table border="1">';
                  
                  // flag apa ada data
                  let hasData = false;
    
                  tabel += '<tr><td valign="top"><b>ID</b></td><td style="max-width:200px;overflow-wrap: break-word;"> ' + data.features[0].id + "</td></tr>";
                  
                  for (var prop in feature.properties) {
                    // Cek apakah properti memiliki nilai
                    if (feature.properties[prop] !== null && feature.properties[prop] !== undefined && feature.properties[prop] !== '') {
                      tabel += "<tr><td valign='top'><b>" + prop + '</b></td><td style="max-width:200px;overflow-wrap: break-word;">' + feature.properties[prop] + "</td></tr>";
                      hasData = true;
                    }
                  }
                  
                  tabel += "</table></div>";
    
                  // Hanya tampilkan popup jika ada data
                  if (hasData) {
                    content.innerHTML = tabel;
                    overlay.setPosition(coordinate);
                  } else {
                    overlay.setPosition(undefined);
                    content.innerHTML = "";
                  }
                } else {
                  overlay.setPosition(undefined);
                  content.innerHTML = "";
                }
              })
              .catch(error => {
                console.error("Error fetching feature info:", error);
                overlay.setPosition(undefined);
                content.innerHTML = "";
              });
          } else {
            overlay.setPosition(undefined);
            content.innerHTML = "";
          }
        } else {
          // Untuk ESRI
          const [lon, lat] = toLonLat(coordinate);
          const view = map.getView();
          const extent = view.calculateExtent(map.getSize());
          const bottomLeft = toLonLat(getBottomRight(extent));
          const topRight = toLonLat(getTopLeft(extent));
    
          const size = map.getSize();
          const width = size[0];
          const height = size[1];
    
          const identifyUrl =
            `${url}/identify?f=json` +
            `&geometry=${lon},${lat}&geometryType=esriGeometryPoint&sr=4326` +
            `&mapExtent=${bottomLeft[0]},${bottomLeft[1]},${topRight[0]},${topRight[1]}` +
            `&imageDisplay=${width},${height},96&tolerance=5&returnGeometry=true`;
    
          try {
            const response = await fetch(identifyUrl);
            const data = await response.json();
    
            // Cek apakah ada hasil dan memiliki data
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              
              // Tambahkan flag untuk menandakan apakah ada data
              let hasData = false;
              
              var tabel = "<p>Layer: " + result.layerName + "</p>";
              tabel = tabel + '<div style="max-height:250px;overflow:auto;"><table border="1">';
              tabel += '<tr><td valign="top"><b>Layer Id</b></td><td style="max-width:200px;overflow-wrap: break-word;"> ' + result.layerId + "</td></tr>";
              
              for (var prop in result.attributes) {
                // Cek apakah properti memiliki nilai yang berarti
                if (result.attributes[prop] !== null && result.attributes[prop] !== undefined && result.attributes[prop] !== '') {
                  tabel += "<tr><td valign='top'><b>" + prop + '</b></td><td style="max-width:200px;overflow-wrap: break-word;">' + result.attributes[prop] + "</td></tr>";
                  hasData = true;
                }
              }
              
              tabel += "</table></div>";
    
              // Hanya tampilkan popup jika ada data
              if (hasData) {
                content.innerHTML = tabel;
                overlay.setPosition(coordinate);
              } else {
                overlay.setPosition(undefined);
                content.innerHTML = "";
              }
            } else {
              overlay.setPosition(undefined);
              content.innerHTML = "";
            }
          } catch (error) {
            console.error("Identify Error:", error);
            overlay.setPosition(undefined);
            content.innerHTML = "";
          }
        }
      } else {
        overlay.setPosition(undefined);
        content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
      }
    });
  }, []);

  // Function to animate zoom
  /*
  const animateZoomTo = (view, zoom, center) => {
    view.animate({
      center: center,
      zoom: zoom,
      duration: 1000, // Animation duration in milliseconds
    });
  };
  */
  return <div id="map-container">{children}</div>;
};

export default MapContainer;
