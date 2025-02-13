import {
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography,
  styled,
  Stack,
  Zoom,
  Divider,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";

///import { Link as RouterLink } from "react-router-dom";
///import FullScreenImage from "./FullScreenImage";
import { Close, ExpandMore, ExpandLess } from "@mui/icons-material";
import imagery_thumb from "./Layers/Basemap/thumbs/imagery.png";
import osm_thumb from "./Layers/Basemap/thumbs/osm.png";
import gray_thumb from "./Layers/Basemap/thumbs/gray.png";
import rbi_thumb from "./Layers/Basemap/thumbs/rbi.png";
import { rbi, osm, topo, gray, imagery } from "./Layers/Basemap";
import { MapViewerContext } from "src/contexts/MapViewerContext";
import { ImageWMS as ImageWMSSource } from "ol/source";

const ContainerLegenda = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:2;
      right: 20px;
      top: 120px;
      color: white;
      transition: 0.8s;
  `
);

const BasemapButton = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      right: 70px;
      bottom: 20px;
      color: white;
      transition: 0.8s;
  `
);

const LegendaContainer = ({ children, mapLayer }) => {
  const { map } = useContext(MapViewerContext);

  const [basemapVisible, setBasemapVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("imagery");
  const [selectedOpacity, setSelectedOpacity] = useState(100);

  const [bmap, setBmap] = useState(imagery_thumb);
  const [datas, setDatas] = useState([
    { img: rbi_thumb, name: "rbi" },
    { img: imagery_thumb, name: "imagery" },
    { img: osm_thumb, name: "osm" },
    { img: gray_thumb, name: "gray" },
  ]);

  const [opacities, setOpacities] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 25 },
    { id: 3, value: 50 },
    { id: 4, value: 75 },
    { id: 5, value: 100 },
  ]);

  useEffect(() => {
    if (!map) return;
  }, [map]);

  function closeMenu() {
    //var legendContainer = document.getElementById("legendContainer");
    //var legendContent = document.getElementById("legendContent");
    setCollapsed(!collapsed);

    /*
    if (collapsed) {
      legendContainer.style.width = "200px";
      legendContainer.style.height = "250px";
      setCollapsed(false);
      setTimeout(function () {
        legendContent.style.display = "block";
      }, 500);
    } else {
      legendContainer.style.width = "95px";
      legendContainer.style.height = "30px";
      setCollapsed(true);
      legendContent.style.display = "none";
    }
      */
  }
  function getBasemap(name) {
    //console.log(basemap);
    switch (name) {
      case "rbi":
        return rbi();
      case "osm":
        return osm();
      case "topo":
        return topo();
      case "gray":
        return gray();
      case "imagery":
        return imagery();
      default:
        return rbi();
    }
  }

  const generate_thumbs = () => {
    return (
      <CardMedia
        sx={{
          width: 100,
          height: 100,
          borderRadius: "5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "end",
        }}
        image={bmap}
        title={selectedBasemap}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ color: "#eee" }}
        >
          Legenda
        </Typography>
        <Divider />
      </CardMedia>
    );
  };

  function load_legend_wms() {
    if (typeof mapLayer !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (mapLayer !== null) {
        if (mapLayer.length > 0) {
          return mapLayer.map((row, index) => {
            // console.log(row)
            //console.log(row.layer)
            //Config.proxy_domain +
            if (row.tipe === "wms") {
              //alert('main')
              //Config.proxy_domain +
              if (row.server === "geoserver" && row.visible) {
                var wmsSource = new ImageWMSSource({
                  url: row.url,
                  params: { LAYERS: row.layer },
                  ratio: 1,
                  serverType: row.server,
                  crossOrigin: "Anonymous",
                });

                //var resolution = peta.getView().getResolution();
                //console.log(resolution)
                var graphicUrl = wmsSource.getLegendUrl();

                return (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <b>{row.title}</b>
                    <br />
                    <img src={graphicUrl} alt={row.title} />
                  </div>
                );
              } else if (row.server === "esri" && row.visible) {
                //https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_1988_Meulaboh/ImageServer/legend?bandIds=&renderingRule=&f=pjson
                if (row.url.includes("ImageServer")) {
                  var url_replace = row.url + "/legend?f=pjson";
                  //console.log(url_replace)
                  //var src = 'https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/GARISPANTAI_50K_2021/MapServer/0/images/208cf6314143ad5675accb3a37e0ca81';
                  get_src_image(url_replace, index);

                  return (
                    <div key={index} style={{ fontSize: "12px" }}>
                      <b>{row.title}</b>
                      <br />
                      <div id={"img-" + index} alt={row.title} />
                    </div>
                  );
                } else {
                  var url_replace = row.url + "/legend?f=pjson";
                  //var src = 'https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/GARISPANTAI_50K_2021/MapServer/0/images/208cf6314143ad5675accb3a37e0ca81';
                  get_src(url_replace, index);

                  return (
                    <div key={index} style={{ fontSize: "12px" }}>
                      <b>{row.title}</b>
                      <br />
                      <div id={"img-" + index} alt={row.title} />
                    </div>
                  );
                }
                //<img id={"img-" + index} alt={row.title} />
              }
            } else if (row.tipe === "zip" && row.visible) {
              if (row.geom === "Point") {
                return (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <b>{row.title}</b>
                    <br />

                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        borderColor: "#49a5d2",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    ></div>
                  </div>
                );
              } else if (row.geom === "LineString") {
                return (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <b>{row.title}</b>
                    <br />

                    <div
                      style={{
                        marginTop: "9.5px",
                        marginBottom: "9.5px",
                        width: "20px",
                        height: "1px",
                        border: "0.5px solid #49a5d2",
                        borderColor: "#49a5d2",
                        backgroundColor: "#49a5d2",
                      }}
                    ></div>
                  </div>
                );
              } else {
                return (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <b>{row.title}</b>
                    <br />

                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "1px solid #ccc",
                        borderColor: "#49a5d2",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    ></div>
                  </div>
                );
              }
            }

            /*
            var wmsSource = new ImageWMSSource({
                url:  row.url,
                params: { 'LAYERS': row.layer },
                ratio: 1,
                serverType: row.server,
                crossOrigin: 'Anonymous'
            });

            //var resolution = peta.getView().getResolution();
            //console.log(resolution)
            var graphicUrl = wmsSource.getLegendUrl(props.resolution);
            //console.log(graphicUrl)


            if (row.layer) {
                //<img src={main + "?" + request} alt="alt" />
                return <Row className="mr-0" key={index}>
                    <Col xs={10} className="ml-2 mt-1 font-11"><b>{row.title}</b>
                        <br />
                        <img crossOrigin="Anonymous" referrerPolicy="origin" src={graphicUrl} alt={row.title} onLoad={() => { console.log(this) }} />
                    </Col>
                </Row>
            } else {
                if (row.tipe === 'zip') {
                    return <Row className="mr-0" key={index}>
                        <Col xs={10} className="ml-2 mt-1 font-11"><b>{row.title}</b> <br />
                            <div className="border bg-light border-primary" style={{ width: "20px", height: "20px" }}>

                            </div>
                        </Col>
                    </Row>
                } else {
                    return null
                }
            }
            */
          });
        } else {
          return <span>Tidak ada legenda</span>;
        }
      } else {
        return <span>Tidak ada legenda</span>;
      }
    } else {
      return <span>Tidak ada legenda</span>;
    }
  }

  function get_src(url, index) {
    const requestOptions = {
      method: "GET",
    };
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        if (data.error) {
          var div = document.getElementById("img-" + index);
          div.innerHTML = "<span>" + data.error.message + "</span>";
        } else {
          var content = "";
          data?.layers?.forEach((layer) => {
            //console.log(layer);
            content += layer.layerName + " (" + layer.layerId + ")<br/>";
            layer.legend.forEach((legend) => {
              //console.log(legend)
              content +=
                '<img src="data:' +
                legend.contentType +
                ";base64," +
                legend.imageData +
                '" alt=' +
                legend.label +
                "> <span>" +
                legend.label +
                "</span><br/>";
              /*var tr = document.createElement('tr');   
  
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
        
            var text1 = document.createTextNode('Text1');
            var text2 = document.createTextNode(legend.label);
        
            td1.appendChild(text1);
            td2.appendChild(text2);
            tr.appendChild(td1);
            tr.appendChild(td2);
        
            table.appendChild(tr);
            */
            });
          });
          var div = document.getElementById("img-" + index);
          div.innerHTML = content;
        }
      });
    /*
    fetch(url, requestOptions).then(res => res.json()).then(data => {
      //console.log(data);
      var img = document.getElementById('img-' + index);
      img.src = url.replace("/legend?f=pjson", "") + '/0/images/' + data.layers[0].legend[0].url;

      //setDataAttribute(data.fields)

    });
    //return src;
    */
  }

  function get_src_image(url, index) {
    const requestOptions = {
      method: "GET",
    };
    /*
    <table>
<tbody><tr valign="middle">
<td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwcdIkqhiWn5fHwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6JrzFUAAAAASUVORK5CYII=" alt="Red: Band_1"></td>
<td>Red: Band_1</td>
</tr>
<tr valign="middle">
<td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwaeIkqhiWl5/HwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6sKxboAAAAASUVORK5CYII=" alt="Green: Band_2"></td>
<td>Green: Band_2</td>
</tr>
<tr valign="middle">
<td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwadJEqhiWl5fPwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu75+IUcAAAAASUVORK5CYII=" alt="Blue: Band_3"></td>
<td>Blue: Band_3</td>
</tr>
</tbody></table>
    */
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          var div = document.getElementById("img-" + index);
          div.innerHTML = "<span>" + data.error.message + "</span>";
        } else {
          var content = "";
          data?.layers?.forEach((layer) => {
            console.log(layer);
            layer.legend.forEach((legend) => {
              console.log(legend);
              content +=
                '<img src="data:' +
                legend.contentType +
                ";base64," +
                legend.imageData +
                '" alt=' +
                legend.label +
                "> <span>" +
                legend.label +
                "</span><br/>";
              /*var tr = document.createElement('tr');   
  
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
        
            var text1 = document.createTextNode('Text1');
            var text2 = document.createTextNode(legend.label);
        
            td1.appendChild(text1);
            td2.appendChild(text2);
            tr.appendChild(td1);
            tr.appendChild(td2);
        
            table.appendChild(tr);
            */
            });
          });
          var div = document.getElementById("img-" + index);
          div.innerHTML = content;
        }
      });
    //return src;
  }

  const icon = collapsed ? (
    <ExpandMore fontSize="small" />
  ) : (
    <ExpandLess fontSize="small" />
  );

  return (
    <ContainerLegenda id="legendaContainer">
      <Card
        sx={{
          width: collapsed ? "150px" : "275px",
          height: collapsed ? "45px" : "310px",
          padding: "10px",
          cursor: "pointer",
          transition: "0.6s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography
            gutterBottom
            variant="h4"
            component="div"
            sx={{ color: "#000" }}
          >
            Legenda
          </Typography>
          <IconButton id="icon" size="small" onClick={() => closeMenu()}>
            {icon}
          </IconButton>
        </Box>
        <Box
          id="legendContent"
          sx={{
            overflow: "scroll",
            maxHeight: "260px",
          }}
        >
          {load_legend_wms()}
        </Box>
      </Card>
    </ContainerLegenda>
  );
};

export default LegendaContainer;
