import {
    Box,
    Card,
    IconButton,
  } from "@mui/material";
  import React, { useContext, useEffect } from "react";

  import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
  
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

const GpsToolsContainer = ({ children }) => {
    const { map } = useContext(MapViewerContext);
  
    useEffect(() => {
        if (!map) return;
        var gpsVectorSource  = new VectorSource();
        const gpsVectorLayer = new VectorLayer({
          source: gpsVectorSource
        });
        gpsVectorLayer.set('id', 'gps_layer')
        map.addLayer(gpsVectorLayer);
    }, [map]);
   

    // Function to animate the point feature
 
      // Function to zoom out
      const navigate = () => {
        if ('geolocation' in navigator) {
            // Use navigator.geolocation.getCurrentPosition() to get the current position
            navigator.geolocation.getCurrentPosition(
              // Success callback function
              function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(longitude, latitude);
                console.log(typeof(longitude), typeof(latitude));
                // Create a point feature at the current position
                const point = new Feature({
                  geometry: new Point(fromLonLat([longitude, latitude]))
                });
                console.log(point);
                const style = new Style({
                    image: new Icon({
                      color: '#00FFFF', //'#FF00FF', // Magenta color
                      crossOrigin: 'anonymous',
                      src: 'https://openlayers.org/en/latest/examples/data/dot.png' // Dot image
                    })
                  });
            
                  // Apply the style to the point feature
                  point.setStyle(style);
                  //vectorSource.clear();
          
                // Add the point feature to the vector source
                let layers = map.getLayers().getArray();
                //console.log(layers);
                //console.log(layers[5])
                var idx = 0;
                layers.forEach(function (l, i) {
                    // /console.log(l)
                    if (l.get("id") === 'gps_layer') {
                        //console.log(i)
                        idx = i;
                    }
        
                })
               var source = layers[idx].getSource();
               
                source.clear();
                 
                  // Add the point feature to the vector source
                source.addFeature(point);
          
                // Animate the point feature (optional)
                map.getView().animate({
                    center: fromLonLat([longitude, latitude]), // Target center
                    duration: 2000, // Animation duration in milliseconds
                    zoom: 17 // Target zoom level
                  });
              },
              // Error callback function
              function(error) {
                console.error('Error getting geolocation:', error);
              }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
      };
      
    return(
        <Card>
                <Box
                  sx={{
                    backgroundColor: "white",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <IconButton aria-label="gps" color="primary" onClick={()=>navigate()}>
                    <GpsFixedIcon />
                  </IconButton>
                </Box>
              </Card>
    )
};

export default GpsToolsContainer;
