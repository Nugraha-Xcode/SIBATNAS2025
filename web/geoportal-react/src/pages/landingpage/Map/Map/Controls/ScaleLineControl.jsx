import React, { useContext, useEffect, useState } from "react";
import { ScaleLine } from "ol/control";
import MapContext from "../MapContext";

const ScaleLineControl = () => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 125 });
    map.controls.push(scaleLine);
    
    return () => map.controls.remove(scaleLine);
  }, [map]);
  return null;
};
export default ScaleLineControl;