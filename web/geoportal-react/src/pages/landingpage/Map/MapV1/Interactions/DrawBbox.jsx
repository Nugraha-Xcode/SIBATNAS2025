import React, { useContext, useEffect, useState } from "react";

import MapContext from "../MapContext";
import DragBox from 'ol/interaction/DragBox';


const DrawBbox = ({ drawing, setBbox, setDrawing, setVisibleBbox, setLabelArea }) => {
    const { map } = useContext(MapContext);
    var dragBox = new DragBox({
        //condition: platformModifierKeyOnly,
    });

    useEffect(() => {
        if (!map) return;

        if (drawing) {
            map.addInteraction(dragBox);
        }
        return () => map.removeInteraction(dragBox);
    }, [map]);

    useEffect(() => {
        if (!map) return;
        if (drawing) {
            map.addInteraction(dragBox);
            var layers = map.getLayers().getArray();
            //console.log(wms)

            var _sourceBbox = layers[3].getSource()
            var _sourceCountry = layers[2].getSource()

            dragBox.on('boxstart', function () {
                _sourceCountry.clear();
                _sourceBbox.clear();
            });
            dragBox.on('boxend', function () {
                // features that intersect the box geometry are added to the
                // collection of selected features

                // if the view is not obliquely rotated the box geometry and
                // its extent are equalivalent so intersecting features can
                // be added directly to the collection
                //var rotation = map.getView().getRotation();
                //var oblique = rotation % (Math.PI / 2) !== 0;
                //var candidateFeatures = oblique ? [] : selectedFeatures;

                var bbox = dragBox.getGeometry().getExtent();
                //map.getView().fit(bbox)
                //map.getView().animate({zoom: map.getView().getZoom() - 0.5});
                setLabelArea('Gambar BBox')
                setBbox([bbox[0], bbox[1], bbox[2], bbox[3]])

                //props.setBboxLabel('[' + bbox[0].toFixed(2) + ', ' + bbox[1].toFixed(2) + ', ' + bbox[2].toFixed(2) + ', ' + bbox[3].toFixed(2) + ']')
                setDrawing(false)
                setVisibleBbox(true)
                map.removeInteraction(dragBox);

                //vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
                //candidateFeatures.push(feature);
                //});

                // when the view is obliquely rotated the box extent will
                // exceed its geometry so both the box and the candidate
                // feature geometries are rotated around a common anchor
                // to confirm that, with the box geometry aligned with its
                // extent, the geometries intersect

            });
        } 
    }, [drawing]);

    return null;
};

export default DrawBbox;