import React, { useContext, useEffect, useState } from "react";

//import MapContext from "../MapContext";

import { MapViewerContext } from "src/contexts/MapViewerContext";
import Draggable from "react-draggable";
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  styled,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Control } from "ol/control";

import { Image as ImageLayer, Group as LayerGroup } from "ol/layer";
import { unByKey } from "ol/Observable";
import Overlay from "ol/Overlay";
import { GeoJSON } from "ol/format";

const Wrapper = styled("div")(
  ({ theme }) => `
  padding: 5px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  background-color: #eee;
 `
);

const ButtonWrapper = styled("div")(
  ({ theme }) => `
  margin: 10px;
  display: flex;
  flex-direction: column;
`
);

const Title = styled("h5")(
  ({ theme }) => `
  padding-top: 4px;
  margin: 0px;
`
);
/*
const Wrapper = styled.div`
  padding: 5px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  background-color: #eee;
`;

const Title = styled.h5`
  padding-top: 4px;
  margin: 0px;
`;

const FormInput = styled.div`
  margin: 10px;
  display: flex;
`;

const ButtonWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
`;
*/

const IdentifyControl = ({ mapLayer }) => {
  const { map } = useContext(MapViewerContext);

  const [identify, setIdentify] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [enableIdentify, setEnableIdentify] = useState(false);

  const [alertIdentify, setAlertIdentify] = useState(false);

  const [labelIdentifying, setLabelIdentifying] = useState("Start Identifying");
  const [listen, setListen] = useState();

  var overlay;

  /*
    var container = document.getElementById('popup');
 
    var closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     *
    var overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    */

  useEffect(() => {
    if (!map) return;

    const identify = document.createElement("div");
    identify.className = "ol-control ol-unselectable identify";
    identify.innerHTML =
      '<button title="Identify"><i class="fa fa-info-circle"></i></button>';
    identify.addEventListener("click", function () {
      var cek = document.getElementById("identifying");
      cek.classList.contains("show") ? setIdentify(false) : setIdentify(true);
      //setIdentify(true);
    });

    const identifyControl = new Control({
      element: identify,
    });

    map.controls.push(identifyControl);
    /*
        alert('a')
        console.log(map);
        var helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip';
        var helpTooltip = new Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        map.addOverlay(helpTooltip);
        //map.addOverlay(overlay);
        //console.log(map.overlays)

        //console.log(url)
        var layers = map.getLayers().getArray();
        //console.log(wms)
        //console.log(layers)
        var idbb = 0;
        layers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === 'identify_layer') {
                //console.log(i)
                idbb = i;
            }
        })

        var sourceHighlight = layers[idbb].getSource()


        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         /

        closer?.addEventListener('click', function () {
            sourceHighlight.clear();
            overlay.setPosition(undefined);
            closer.blur();

            return false;
        });

        */

    //return () => map.controls.remove(identifyControl);
  }, [map]);

  useEffect(() => {
    if (!map) return;
    // console.log(mapLayer)
    var layers = map.getLayers().getArray();
    //console.log(layers);
    //console.log(layers[5])
    var idx = 0;
    layers.forEach(function (l, i) {
      //console.log(l)
      if (l instanceof LayerGroup) {
        //console.log(i)
        idx = i;
      }
    });
    var group = layers[idx];
    var wms = group.getLayers();
    //console.log(wms)

    var idx = -1;

    wms.forEach(function (layer, i) {
      //var layerid = i;
      //console.log(layer.getVisible())
      if (layer instanceof ImageLayer) {
        if (layer.getVisible()) {
          idx = i;
        }
      }
    });

    var name_layer = document.getElementById("name_layer");
    //console.log(name_layer)
    if (idx === -1) {
      name_layer.innerHTML = "None";
      setEnableIdentify(false);
    } else {
      //console.log();
      // name_layer.innerHTML = wms[i_group].getLayers().getArray()[idx].get('title');
      name_layer.innerHTML = wms.getArray()[idx].get("title");
      setEnableIdentify(true);
    }
  }, [mapLayer]);

  useEffect(() => {
    if (!map) return;
    // console.log(mapLayer)

    if (identifying) {
      //alert('true')
      if (!listen) {
        var listener = map.on("singleclick", function (evt) {
          //document.getElementById('info').innerHTML = '';

          //alert('cuy')
          if (overlay) map.removeOverlay(overlay);
          var viewResolution = /** @type {number} **/ (
            map.getView().getResolution()
          );

          //console.log(viewResolution);

          var layers = map.getLayers().getArray();
          //console.log(layers);
          //console.log(layers[5])
          var idx = 0;
          layers.forEach(function (l, i) {
            //console.log(l)
            if (l instanceof LayerGroup) {
              //console.log(i)
              idx = i;
            }
          });
          var group = layers[idx];
          var wms = group.getLayers();
          var idx = -1;
          wms.forEach(function (layer, i) {
            //var layerid = i;
            //console.log(layer.getVisible())
            if (layer instanceof ImageLayer) {
              if (layer.getVisible()) {
                idx = i;
              }
            }
          });
          var url;
          if (idx === -1) {
            alert("There is no WMS layer visible");
          } else {
            //console.log();
            var layer = wms.getArray()[idx];
            //console.log(layer)
            var wmsSource = layer.getSource();

            url = wmsSource.getFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              "EPSG:3857",
              { INFO_FORMAT: "application/json" }
              //text/html
            );
          }

          //console.log(url)
          var layers = map.getLayers().getArray();
          //console.log(wms)
          //console.log(layers)
          var idbb = 0;
          layers.forEach(function (l, i) {
            // /console.log(l)
            if (l.get("id") === "identify_layer") {
              //console.log(i)
              idbb = i;
            }
          });

          var sourceHighlight = layers[idbb].getSource();

          if (url) {
            document.body.style.cursor = "progress";
            fetch(url)
              .then(function (response) {
                return response.text();
              })
              .then(function (html) {
                console.log(html);
                document.body.style.cursor = "help";
                var data = JSON.parse(html);
                //console.log(html)
                var feature = data.features[0];
                //html;

                // overlay.setPosition();
                sourceHighlight.clear();
                if (feature) {
                  console.log(feature);
                  //console.log(feature.geometry.coordinates[0])
                  var transform = true;
                  if (feature.geometry.type === "MultiPolygon") {
                    var koordinat = feature.geometry.coordinates[0][0][0][0];
                    //console.log(koordinat)
                    if (koordinat > 180 || koordinat < -180) transform = false;
                    //console.log(cek_koordinat);
                  } else {
                  }
                  //console.log(transform)
                  if (transform) {
                    //console.log(new GeoJSON().readFeature(feature, {featureProjection: 'EPSG:3857'}))
                    sourceHighlight.addFeature(
                      new GeoJSON().readFeature(feature, {
                        featureProjection: "EPSG:3857",
                      })
                    );
                  } else {
                    sourceHighlight.addFeature(
                      new GeoJSON().readFeature(feature)
                    );
                  }

                  if (feature.hasOwnProperty("properties")) {
                    //console.log(data.features[0].properties)
                    var tabel = "<p>Layer: " + layer.get("title") + "</p>";
                    tabel =
                      tabel +
                      '<div style="max-height:250px;overflow:auto;"><table class="table table-strip font-11">';
                    //tabel += '<tr><td>ID</td><td style="max-width:200px;overflow-wrap: break-word;"> ' + data.features[0].id + '</td></tr>'
                    for (var prop in feature.properties) {
                      //console.log(prop)
                      //console.log(feature.properties[prop])
                      tabel +=
                        "<tr><td>" +
                        prop +
                        '</td><td style="max-width:200px;overflow-wrap: break-word;">' +
                        feature.properties[prop] +
                        "</td></tr>";
                    }
                    //feature.properties.forEach(element => {
                    //    console.log(element);
                    // });
                    tabel += "</table></div>";
                    //content.innerHTML = tabel;
                    console.log(tabel);
                    var container = document.createElement("div");
                    container.className = "ol-popup";
                    //container.innerHTML="Halo"
                    var closer = document.createElement("span");
                    //closer.setAttribute("href", "");
                    closer.className = "ol-popup-closer";
                    //<a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    //<div id="popup-content" ></div>
                    container.append(closer);
                    var content = document.createElement("div");
                    content.innerHTML = tabel;
                    container.append(content);
                    overlay = new Overlay({
                      element: container,
                      autoPan: true,
                      autoPanAnimation: {
                        duration: 250,
                      },
                    });

                    closer.addEventListener("click", function () {
                      sourceHighlight.clear();
                      overlay.setPosition(undefined);
                      closer.blur();

                      return false;
                    });

                    map.addOverlay(overlay);
                    overlay.setPosition(evt.coordinate);
                  }
                }
              });
          }
        });
        //console.log(listener)
        setListen(listener);
      }
    } else {
      //alert('false')
      //console.log(listen)
      unByKey(listen);
      setListen(null);
    }
  }, [identifying]);

  function handleStartIdentifying() {
    if (identifying) {
      setLabelIdentifying("Start Identifying");
      document.body.style.cursor = "default";
      setIdentifying(false);
      setAlertIdentify(false);
    } else {
      //alert
      setLabelIdentifying("Finish Identifying");
      document.body.style.cursor = "help";
      setIdentifying(true);
      setAlertIdentify(true);
    }
  }

  return (
    <Draggable
      handle="#draggable-identify"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <div
        id="identifying"
        className={
          identify ? "identifyContainer show" : "identifyContainer hide"
        }
      >
        <Wrapper id="draggable-identify">
          <Title>Identifying</Title>
          <IconButton size="small" onClick={() => setIdentify(false)}>
            <Close />
          </IconButton>
        </Wrapper>
        <ButtonWrapper>
          {alertIdentify ? (
            <Button
              variant="outlined"
              className="py-0 font-11 mb-2"
              style={{ color: "green" }}
            >
              <b>Feature Identification is ACTIVE</b>
            </Button>
          ) : (
            <Button variant="outlined" className="py-0 font-11 mb-2" disabled>
              <b>Feature Identification is NOT ACTIVE</b>
            </Button>
          )}
          <span>
            Layer (Top-Visible): <br />
            <b>
              <span id="name_layer">None</span>
            </b>
          </span>
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="button"
            style={{ marginBottom: "1em" }}
            onClick={handleStartIdentifying}
            disabled={!enableIdentify}
          >
            {labelIdentifying}
          </Button>
        </ButtonWrapper>
      </div>
    </Draggable>
  );
};
export default IdentifyControl;
