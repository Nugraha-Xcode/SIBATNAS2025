import {
    Box,
    Card,
    IconButton,
    styled,
  } from "@mui/material";
  import React, { useContext, useState, useEffect } from "react";
import { fromLonLat, toLonLat } from 'ol/proj';
  
import { MapViewerContext } from "src/contexts/MapViewerContext"; 


const ContainerCoordinate = styled(Box)(
    ({ theme }) => `
      position: absolute;
      z-index:1;
      left: calc(50vw - 125px);
      bottom: 20px;
      color: white;
      transition: 0.8s;
      padding-top: 5px;
  `
  ); 
const CoordinateContainer = ({ children }) => {
    const { map } = useContext(MapViewerContext);
    const [lon, setLon] = useState("N/A");
    const [lat, setLat] = useState("N/A");

     
    useEffect(() => {
        if (!map) return;
        map.on('pointermove', function (event) {
            const coordinates = toLonLat(event.coordinate);
            setLon(coordinates[0].toFixed(6));
            setLat(coordinates[1].toFixed(6));
          });
    }, [map]);
    // Add an event listener for mouse move events

      
    return(
        <ContainerCoordinate>
        <Card>
        <Box
          sx={{
            backgroundColor: "white",
            width: "250px",
            height: "30px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            fontSize: "8pt",
          }}
        >
          <span>Lat {lat} °{lat < 0? 'S':'N'} </span>
          <span>Long {lon} °{lon < 0? 'W':'E'} </span>
        </Box>
      </Card>
      </ContainerCoordinate>
          );
};

export default CoordinateContainer;
