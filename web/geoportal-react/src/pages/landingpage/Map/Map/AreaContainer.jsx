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
import { isVisible } from "@testing-library/user-event/dist/utils";
const ContainerBasemap = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:2;
      left: 370px;
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

const AreaContainer = ({ children, isVisibleArea, handleCloseArea }) => {
  const { map } = useContext(MapViewerContext);

  useEffect(() => {
    if (!map) return;
  }, [map]);

  const handleOpenBasemap = () => {
    //setBasemapVisible(true);
  };

  return (
    <div>
      <Zoom
        in={isVisibleArea}
        style={{ transitionDelay: isVisibleArea ? "200ms" : "0ms" }}
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
                Definisikan Area Studi
              </Typography>
              <IconButton size="small" onClick={handleCloseArea}>
                <Close />
              </IconButton>
            </Box>
            <Divider />
          </Card>
        </ContainerBasemap>
      </Zoom>
      <BasemapButton id="basemapButton">
        <Card
          sx={{ padding: "5px", cursor: "pointer" }}
          onClick={handleOpenBasemap}
        >
          {
            //generate_thumbs()
          }
        </Card>
      </BasemapButton>
    </div>
  );
};

export default AreaContainer;
