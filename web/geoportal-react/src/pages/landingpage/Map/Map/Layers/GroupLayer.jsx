import { useContext, useEffect } from "react";
//import MapContext from "../MapContext";

import { MapViewerContext } from "src/contexts/MapViewerContext";
import { Group as LayerGroup } from "ol/layer";
import {
  ImageWMS as ImageWMSSource,
  ImageArcGISRest,
  Vector as VectorSource,
  TileArcGISRest,
} from "ol/source";
import {
  Image as ImageLayer,
  Vector as VectorLayer,
  Tile as TileLayer,
} from "ol/layer";
import { createXYZ } from "ol/tilegrid";
import { GeoJSON } from "ol/format";
import { tile as tileStrategy } from "ol/loadingstrategy";
import EsriJSON from "ol/format/EsriJSON";
import XYZ from "ol/source/XYZ";
import OLTileLayer from "ol/layer/Tile";
//import environment from "src/config/environment";

const GroupLayer = ({
  zIndex = 0,
  mapLayer,
  identifierDelete,
  setIdentifierDelete,
}) => {
  const { map } = useContext(MapViewerContext);

  useEffect(() => {
    if (!map) return;

    let layerGroup = new LayerGroup({
      zIndex: zIndex,
    });

    map.addLayer(layerGroup);
    /*
        var wmsSource = new ImageWMSSource({
            //Config.proxy_domain + 
            url: 'http://geoportal.palembang.go.id/geoserver/wms',
            params: { 'LAYERS': 'Dukcapil-PLG:jumlah_penduduk_pekerjaan_kec_ar_167120200831044858' },
            ratio: 1,
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        });
        var wmsLayer = new ImageLayer({
            source: wmsSource
        })
        wmsLayer.set('id', 'id')
        wmsLayer.set('title', 'title')

        
        //console.log(map.getLayerGroup())
        //var group = map.getLayerGroup()

        //var layers = peta.getLayers().getArray();
        //var group = layers[i_group].getLayers().getArray()
        //console.log(layers)
        //group.push(wmsLayer)
        //console.log(layers)
        layerGroup.getLayers().array_.push(wmsLayer)


        var esriSource = new ImageArcGISRest({
            //Config.proxy_domain + 
            ratio: 1,
            params: {},
            url: 'https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/Danau_50K/MapServer',
        });
        var esriLayer = new ImageLayer({
            source: esriSource
        })
        esriLayer.set('id', 'id2')
        esriLayer.set('title', 'title2')
        layerGroup.getLayers().array_.push(esriLayer)
        */
    //ImageArcGISRest

    return () => {
      if (map) {
        map.removeLayer(layerGroup);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (mapLayer.length > 0) {
      console.log(mapLayer);
      //console.log(props.mapLayer[props.mapLayer.length - 1])
      //var row = props.mapLayer[props.mapLayer.length - 1]
      //console.log(row)
      //console.log(row.layer)
      //
      var layers = map.getLayers().getArray();
      var idx = 0;
      layers.forEach(function (l, i) {
        //console.log(l)
        if (l instanceof LayerGroup) {
          //console.log(i);
          idx = i;
        }
      });
      console.log(idx);
      var group = layers[idx];
      //console.log(group);
      //ap.getView().setZoom(map.getView().getZoom() + 0.0001);
      mapLayer.reverse().forEach(function (l, y) {
        console.log(l);

        var check = false;
        group.getLayers().forEach(function (layer, i) {
          if (layer.get("id") === l.id) {
            layer.setVisible(l.visible);
            layer.setOpacity(parseFloat(l.opacity));
            //console.log(l.opacity)
            check = true;
          }
        });
        if (!check) {
          console.log("belum ada");
          if (l.tipe === "wms") {
            //alert('main')
            //Config.proxy_domain +
            console.log(l);
            if (l.server === "geoserver") {
              //alert('geo')
              var wmsSource = new ImageWMSSource({
                url: l.url, //Config.proxy_domain + l.url,
                params: { LAYERS: l.layer },
                ratio: 1,
                serverType: l.server,
                crossOrigin: "anonymous",
              });
              var wmsLayer = new ImageLayer({
                source: wmsSource,
              });
              wmsLayer.set("id", l.id);
              wmsLayer.set("title", l.title);

              //map.addLayer(wmsLayer);

              //group.getLayers().array_.push(wmsLayer);
              group.getLayers().push(wmsLayer);
              map.render();
              //wmsLayer.getSource().refresh();
              //map.getView().setZoom(map.getView().getZoom() + 0.0001);
            } else {
              var esriSource = new ImageArcGISRest({
                //Config.proxy_domain +
                ratio: 1,
                params: {},
                url: l.url,
              });
              var esriLayer = new ImageLayer({
                source: esriSource,
              });
              esriLayer.set("id", l.id);
              esriLayer.set("title", l.title);
              console.log(esriLayer);
              //map.addLayer(wmsLayer)
              //group.getLayers().array_.push(esriLayer);
              group.getLayers().push(esriLayer);
              map.render();
              //esriLayer.getSource().refresh();
              //map.getView().setZoom(map.getView().getZoom() + 1);
              //map.getView().setZoom(map.getView().getZoom() - 1);
              //map.updateSize();
            }
          }
        } else {
          console.log("sudah ada");
          map.render();
        }
      });
      //map.getView().setZoom(map.getView().getZoom() + 1);
      //map.getView().setZoom(map.getView().getZoom() - 1);
      //map.updateSize();
    }
  }, [mapLayer]);

  useEffect(() => {
    if (!map) return;
    //alert(props.showBbox)

    if (identifierDelete) {
      // alert('ok')
      //console.log(map.getLayers().getArray().length)

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

      group.getLayers().forEach(function (layer, i) {
        //alert('ya')
        //console.log(layer);
        if (layer) {
          //console.log(layer.getKeys())
          if (layer.getKeys().includes("id")) {
            //console.log(layer);
            //alert('wow')
            //console.log(identifierDelete)
            console.log(layer.get("id"));
            if (layer.get("id") === identifierDelete) {
              //alert('oi')
              //console.log(group.getLayers().array_)
              group.getLayers().array_.splice(i, 1);
              //console.log(group.getLayers().array_)

              setIdentifierDelete("");
            }
          }
        }
      });
      map.render();
      //map.getView().setZoom(map.getView().getZoom() + 1);
      //map.getView().setZoom(map.getView().getZoom() - 1);
      //map.updateSize();

      //if (candidate) {
      //map.removeLayer(candidate)
      //group.getLayers().array_.pop(candidate)
      //}
    }
  }, [identifierDelete]);

  /*
    useEffect(() => {
        if (!map) return;
        let layers = map.getLayers().getArray()
        layers[0].setSource(getBasemap());
    }, [basemap]);
    */
  return null;
};
export default GroupLayer;
