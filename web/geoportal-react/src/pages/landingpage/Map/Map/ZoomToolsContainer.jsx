import {
    Box,
    Card,
    IconButton,
  } from "@mui/material";
  import React, { useContext, useEffect } from "react";
  
  ///import { Link as RouterLink } from "react-router-dom";
  ///import FullScreenImage from "./FullScreenImage"; 
  import {
    Add as AddIcon,
    Dashboard as DashboardIcon,
    Remove as RemoveIcon,
    
    Delete as DeleteIcon,
    GpsFixed as GpsFixedIcon,
    LayersRounded,
    LibraryBooks as LibraryBooksIcon,
    Print as PrintIcon,
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    Dashboard,
    NavigateNext as NavigateNextIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
  } from "@mui/icons-material"; 
  
import { MapViewerContext } from "src/contexts/MapViewerContext"; 

const ZoomToolsContainer = ({ children }) => {
    const { map } = useContext(MapViewerContext);
    
    useEffect(() => {
      if (!map) return;
      
  }, [map]);
    const zoomIn = () => {
        const view = map.getView();
        const zoom = view.getZoom();
        view.setZoom(zoom + 0.5); // Increment the zoom level by 1
      };
      
      // Function to zoom out
      const zoomOut = () => {
        const view = map.getView();
        const zoom = view.getZoom();
        view.setZoom(zoom - 0.5); // Decrement the zoom level by 1
      };
      
    return(
        <Card>
                <Box
                  sx={{
                    backgroundColor: "white",
                    width: "30px",
                    height: "80px",
                  }}
                >
                  <IconButton aria-label="zoom in" color="primary" onClick={() => zoomIn()}>
                    <AddIcon />
                  </IconButton>
                  <IconButton aria-label="zoom out" color="primary" onClick={() => zoomOut()}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Card>
    )
};

export default ZoomToolsContainer;
