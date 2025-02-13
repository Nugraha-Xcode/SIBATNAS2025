import React, { useContext, useEffect, useState } from "react";
import { ZoomToExtent } from "ol/control";
import MapContext from "../MapContext";

const ZoomToExtentControl = () => {
  const { map } = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    const el = document.createElement('div');
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">' +
        '<path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>' +
        '<path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>' +
        '</svg>';
    let  zoomToExtentControl = new ZoomToExtent({
        'tipLabel': 'Zoom to inital extent',
        'label': el,
        'extent': [10601985.68, -1223385.35, 15698207.12, 630668.52]
    })
    map.controls.push(zoomToExtentControl);
    
    return () => map.controls.remove(zoomToExtentControl);
  }, [map]);
  return null;
};
export default ZoomToExtentControl;