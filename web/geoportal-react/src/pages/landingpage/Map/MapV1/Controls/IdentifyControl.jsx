import React, { useContext, useEffect, useState } from "react";
import Graticule from 'ol/layer/Graticule';
import MapContext from "../MapContext";
import Stroke from 'ol/style/Stroke';
import {
    Control
} from 'ol/control';

const IdentifyControl = () => {
    const { map } = useContext(MapContext);
    
    const [measurement, setMeasurement] = useState(false);

    useEffect(() => {
        if (!map) return;

        const identify = document.createElement('div');
        identify.className = 'ol-control ol-unselectable identify';
        identify.innerHTML = '<button title="Identify"><i class="fa fa-info-circle"></i></button>';
        identify.addEventListener('click', function () {
            var cek = document.getElementById("identifying");
            cek.classList.contains('show') ? setMeasurement(false) : setMeasurement(true);
            //setIdentify(true);
        });

        const identifyControl = new Control({
            element: identify
        });

        map.controls.push(identifyControl);
        /*
        var closeMeasurement = document.getElementById('close_measurement');

        closeMeasurement.addEventListener(
            'click',
            function () {
                setMeasurement(false)
            },
            false
        );
        */
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
        return () => map.controls.remove(identifyControl);
    }, [map]);
    return (
        <div id="identifying" className={measurement ? 'show' : 'hide'} >
        <div className="">Identify<button type="button" className="close" onClick={()=> setMeasurement(false)}><span aria-hidden="true" className="text-secondary">×</span><span className="sr-only">Close</span></button></div>
        
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
export default IdentifyControl;