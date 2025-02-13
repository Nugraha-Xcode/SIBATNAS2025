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
import { Feature } from "ol";
import { Point } from "ol/geom";

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
