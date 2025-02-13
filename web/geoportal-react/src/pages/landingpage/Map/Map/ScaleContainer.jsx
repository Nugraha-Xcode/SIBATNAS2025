import {
    Box,
    Card,
    IconButton,
    styled,
  } from "@mui/material";
  import React, { useContext, useState, useEffect } from "react";
  
import { METERS_PER_UNIT } from 'ol/proj/Units';
import { MapViewerContext } from "src/contexts/MapViewerContext"; 


const ContainerScale = styled(Box)(
    ({ theme }) => `
    position: absolute;
    z-index:1;
    left: 15px;
    bottom: 20px;
    color: white;
    transition: 0.8s;
    padding-top: 5px;
  `
  ); 
  const ScaleBar = styled(Box)(
    ({ theme }) => `
     margin-left: -64.5px;
     text-align: center;
     min-width: 129px;
     left: 258px;
  `
  );
const ScaleContainer = ({ children }) => {
    const { map } = useContext(MapViewerContext);
    const [scale, setScale] = useState("N/A");

    const calculateScale = () => {
        const view = map.getView();
        const resolution = view.getResolution();
        const units = view.getProjection().getUnits();
        const dpi = 25.4 / 0.28; // 1 inch = 25.4 mm, 0.28 mm per pixel
        const mpu = METERS_PER_UNIT[units]; // Meters per unit
        const scale = resolution * mpu * 39.37 * dpi; // 39.37 inches per meter
        return scale/100;
      };
      
      // Update the scale display
      const updateScale = () => {
        const scal = calculateScale();
        setScale(scal);
      };
     
    useEffect(() => {
        if (!map) return;

        map.getView().on('change:resolution', updateScale);
    }, [map]);
    // Add an event listener for mouse move events

      
    return(
        <ContainerScale>
              <Card>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: "white",
                    width: "200px",
                    height: "30px",
                    fontSize: "8pt",
                  }}
                >
                  <span>{Math.round(scale)} m</span>
                  <img
                    src={
                      process.env.PUBLIC_URL + "/static/images/scale_bar.png"
                    }
                  />
                </Box> 
                </Card>         
      </ContainerScale>
          );
};

export default ScaleContainer;
