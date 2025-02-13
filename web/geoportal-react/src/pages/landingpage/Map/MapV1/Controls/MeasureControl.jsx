import React, { useContext, useEffect, useState } from "react";
import Graticule from 'ol/layer/Graticule';
import MapContext from "../MapContext";
import Stroke from 'ol/style/Stroke';
import {
    Control
} from 'ol/control';

const MeasureControl = () => {
    const { map } = useContext(MapContext);
    
    const [measurement, setMeasurement] = useState(false);

    useEffect(() => {
        if (!map) return;

        const measure = document.createElement('div');
        measure.className = 'ol-control ol-unselectable measure';
        measure.innerHTML = '<button title="Measurement"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rulers" viewBox="0 0 16 16">' +
            '<path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z"/>' +
            '</svg></button>';
        measure.addEventListener('click', function () {
            var cek = document.getElementById("measurement");
            cek.classList.contains('show') ? setMeasurement(false) : setMeasurement(true);
        });

        const measureControl = new Control({
            element: measure
        });

        map.controls.push(measureControl);

        var closeMeasurement = document.getElementById('close_measurement');

        closeMeasurement.addEventListener(
            'click',
            function () {
                setMeasurement(false)
            },
            false
        );
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
        return () => map.controls.remove(measureControl);
    }, [map]);
    return (
        <div id="measurement" className={measurement ? 'show' : 'hide'} >
        <div className="">Measurement<button type="button" className="close" id="close_measurement"><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
        
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
export default MeasureControl;