import React, { useContext, useEffect, useState } from "react";
import { Attribution } from "ol/control";
import MapContext from "../MapContext";

const AttributionControl = ({basemap}) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    
    var attribution= new Attribution({ collapsed: false });
    map.controls.push(attribution);
    
    return () => map.controls.remove(attribution);
  }, [map]);
  return null;
};
export default AttributionControl;