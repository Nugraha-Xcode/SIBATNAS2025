import React, { useContext, useEffect, useState } from "react";
import { OverviewMap } from "ol/control";
import MapContext from "../MapContext";

import OLTileLayer from "ol/layer/Tile";
import { rbi, osm, topo, gray, imagery, stamen } from "../Layers/Basemap";

const OverviewMapControl = ({ basemap }) => {
    const { map } = useContext(MapContext);

    function getBasemap() {
        //console.log(basemap);
        switch (basemap) {
            case 'rbi':
                return rbi();
            case 'osm':
                return osm();
            case 'topo':
                return topo();
            case 'gray':
                return gray();
            case 'imagery':
                return imagery();
            case 'stamen':
                return stamen();
            default:
                return rbi();
        }
    }
    let source = getBasemap()

  

    useEffect(() => {
        if (!map) return;
        var overviewMap = new OverviewMap({
            // see in overviewmap-custom.html to see the custom CSS used
            className: 'ol-overviewmap ol-custom-overviewmap',
            layers: [
                new OLTileLayer({
                    source: source
                })
            ],
            collapseLabel: '\u00BB',
            label: '\u00AB',
            collapsed: false,
        });
        overviewMap.set('id', 'overviewmap');
        map.controls.push(overviewMap);

        return () => map.controls.remove(overviewMap);
    }, [map]);

    //var layers_ = controllers[4].getOverviewMap().getLayers().getArray()

    useEffect(() => {
        if (!map) return;
        //let layers = overviewMap.getOverviewMap().getLayers().getArray()
        //console.log(layers)
        var controllers = map.getControls().getArray()
        var idx = 0;
        controllers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === 'overviewmap') {
                //console.log(i)
                idx = i;
            }

        })
     
        var layers_ = controllers[idx].getOverviewMap().getLayers().getArray()

        layers_[0].setSource(getBasemap());
          /*
        let layers = map.getLayers().getArray();
        //console.log(layers);
        //console.log(layers[5])
      
        */

    }, [basemap]);

    return null;
};
export default OverviewMapControl;