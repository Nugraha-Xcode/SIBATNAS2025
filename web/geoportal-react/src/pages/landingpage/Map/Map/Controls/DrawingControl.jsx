import React, { useContext, useEffect, useState } from "react";
import Graticule from 'ol/layer/Graticule';
import MapContext from "../MapContext";
import Stroke from 'ol/style/Stroke';
import {
    Control
} from 'ol/control';

const DrawingControl = () => {
    const { map } = useContext(MapContext);
    
    const [measurement, setMeasurement] = useState(false);

    useEffect(() => {
        if (!map) return;

        const drawingDiv = document.createElement('div');
        drawingDiv.className = 'ol-control ol-unselectable drawing';
        drawingDiv.innerHTML = '<button title="Draw"><i class="fa fa-pencil"></i></button>';
        drawingDiv.addEventListener('click', function () {
            var cek = document.getElementById("drawing");
            cek.classList.contains('show') ? setMeasurement(false) : setMeasurement(true);
        });

        const drawingControl = new Control({
            element: drawingDiv
        });
        map.controls.push(drawingControl);

        /*
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
        */
        return () => map.controls.remove(drawingControl);
    }, [map]);
    return (
        <div id="drawing" className={measurement ? 'show' : 'hide'} >
        <div className="">Drawing<button type="button" className="close"  onClick={()=>setMeasurement(false)}><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
        
        {
            /*
        <Row className="mx-3 my-3">
            <Col className="px-1 font-11">
                <form className="form-inline">
                    <label htmlFor="type">Measurement type &nbsp;</label>
                    <select id="type">
                        <option value="length">Length (LineString)</option>
                        <option value="area">Area (Polygon)</option>
                    </select>
                </form>
            </Col>
        </Row>
        <Row className='show px-1 pt-2'>
            <Col className="">
                <Button size="sm" variant="secondary" className="py-0 font-11" block id="finish_measurement">Start Measurement</Button>
                <Button size="sm" variant="secondary" className="py-0 font-11" block id="clear_measurement">Clear Measurement</Button>
            </Col>
        </Row>
        */ }
    </div>
    );
};
export default DrawingControl;