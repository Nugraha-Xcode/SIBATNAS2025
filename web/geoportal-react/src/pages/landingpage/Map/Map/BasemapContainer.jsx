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
import { Close } from "@mui/icons-material";
import imagery_thumb from "./Layers/Basemap/thumbs/imagery.png";
import osm_thumb from "./Layers/Basemap/thumbs/osm.png";
import gray_thumb from "./Layers/Basemap/thumbs/gray.png";
import rbi_thumb from "./Layers/Basemap/thumbs/rbi.png";
import { rbi, osm, topo, gray, imagery } from "./Layers/Basemap";

import { MapViewerContext } from "src/contexts/MapViewerContext";
const ContainerBasemap = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:2;
      right: 70px;
      bottom: 20px;
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

const BasemapContainer = ({ children }) => {
  const { map } = useContext(MapViewerContext);

  const [basemapVisible, setBasemapVisible] = useState(false);
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

  const toggleBasemap = () => {
    setBasemapVisible(!basemapVisible);
  };

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
          Peta Dasar
        </Typography>
      </CardMedia>
    );
  };

  const generate_basemap = () => {
    return datas.map((data) => (
      <Box key={data.name} onClick={() => handleBasemap(data.name)}>
        <img
          src={data.img}
          width="80px"
          height="80px"
          style={{
            objectFit: "cover",
            borderRadius: "5px",
            border: data.name == selectedBasemap ? "solid #4e9ce6 3px" : "none",
          }}
        />
      </Box>
    ));
  };
  const generate_opacity = () => {
    return opacities.map((data) => (
      <Button
        key={data.id}
        size="small"
        variant={data.value == selectedOpacity ? "contained" : "outlined"}
        onClick={() => handleOpacity(data.value)}
      >
        {data.value}%
      </Button>
    ));
  };

  const handleOpenBasemap = () => {
    setBasemapVisible(true);
  };
  const handleCloseBasemap = () => {
    setBasemapVisible(false);
  };

  const handleBasemap = (name) => {
    var a = datas.filter(function (el) {
      return el.name === name;
    });
    setBmap(a[0].img);
    setSelectedBasemap(name);
    let layers = map.getLayers().getArray();
    layers[0].setSource(getBasemap(name));
  };

  const handleOpacity = (val) => {
    var a = opacities.filter(function (el) {
      return el.value === val;
    });
    setSelectedOpacity(val);
    let layers = map.getLayers().getArray();
    layers[0].setOpacity(val / 100);
  };
  return (
    <div>
      <Zoom
        in={basemapVisible}
        style={{ transitionDelay: basemapVisible ? "200ms" : "0ms" }}
      >
        <ContainerBasemap id="basemapContainer">
          <Card
            sx={{
              width: "375px",
              height: "210px",
              padding: "10px",
              cursor: "pointer",
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
                Peta Dasar
              </Typography>
              <IconButton size="small" onClick={handleCloseBasemap}>
                <Close />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction="row" spacing={1}>
                {generate_basemap()}
              </Stack>
            </Box>
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ color: "#000" }}
            >
              Opacity
            </Typography>
            <Stack direction="row" spacing={1}>
              {generate_opacity()}
            </Stack>
          </Card>
        </ContainerBasemap>
      </Zoom>
      <BasemapButton id="basemapButton">
        <Card
          sx={{ padding: "5px", cursor: "pointer" }}
          onClick={handleOpenBasemap}
        >
          {generate_thumbs()}
        </Card>
      </BasemapButton>
    </div>
  );
};

export default BasemapContainer;
