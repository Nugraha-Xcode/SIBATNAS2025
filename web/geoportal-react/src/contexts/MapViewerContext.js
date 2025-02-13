import { useState, useEffect, createContext } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import BingMaps from "ol/source/BingMaps";
import XYZ from "ol/source/XYZ";

export const MapViewerContext = createContext({});

export const MapViewerProvider = ({ children }) => {
  const [map] = useState(
    new Map({
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
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    })
  );
  const setMapCenter = (center) => {
    map.getView().setCenter(center);
  };

  const setMapZoom = (zoom) => {
    map.getView().setZoom(zoom);
  };

  //useEffect(() => {
  //  return () => {
  //    map.setTarget(null);
  //  };
  //}, [map]);
  return (
    <MapViewerContext.Provider value={{ map, setMapCenter, setMapZoom }}>
      {children}
    </MapViewerContext.Provider>
  );
};
