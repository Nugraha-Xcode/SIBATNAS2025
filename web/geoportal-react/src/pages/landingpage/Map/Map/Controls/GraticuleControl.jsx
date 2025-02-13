import React, { useContext, useEffect, useState } from "react";
import Graticule from 'ol/layer/Graticule';
import MapContext from "../MapContext";
import Stroke from 'ol/style/Stroke';
import {
    Control
} from 'ol/control';

const GraticuleControl = () => {
    const { map } = useContext(MapContext);
    
    useEffect(() => {
        if (!map) return;
      
        const locate = document.createElement('div');
        locate.className = 'ol-control ol-unselectable graticule';
        locate.innerHTML = '<button title="Show/Hide Graticule"><i class="fa fa-th"></i></button>';
        

        const graticuleControl = new Control({ element: locate });

        map.controls.push(graticuleControl);

        let layers = map.getLayers().getArray();
        //console.log(layers);
        //console.log(layers[5])
        var idx = 0;
        layers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === 'graticule_layer') {
                //console.log(i)
                idx = i;
            }

        })

        locate.addEventListener('click', function () {
            layers[idx].setVisible(!layers[idx].getVisible())
        });

        return () => map.controls.remove(graticuleControl);
    }, [map]);
    return null;
};
export default GraticuleControl;