import {
  Box,
  Card,
  IconButton,
  styled,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";

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

const SearchContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:2;
      left: 120px;
      top: 110px;
      color: white;
      transition: 0.8s;
  `
);

const ResultContainer = styled(Paper)(
  ({ theme }) => `
    position: absolute;
    z-index: 2;
    width: 500px;
    top: 60px;
    transition: 0.8s;
  `
);

const suggestions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];

const GeocodingSearchContainer = ({ children }) => {
  const { map } = useContext(MapViewerContext);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("please wait..");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length >= 4) {
      //const filtered = suggestions.filter((suggestion) =>
      // suggestion.toLowerCase().includes(value.toLowerCase())
      // );
      //setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      geocode(value);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (query) => {
    setInputValue(query.display_name);

    setShowSuggestions(false);
    console.log(query);
    const { lat, lon } = query;
    //const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);
    const point = new Feature({
      geometry: new Point(fromLonLat([parseFloat(lon), parseFloat(lat)])),
    });
    console.log(lon, lat);
    console.log(typeof lon, typeof lat);
    console.log(point);

    const style = new Style({
      image: new Icon({
        color: "#FF00FF", //'#FF00FF', // Magenta color
        crossOrigin: "anonymous",
        src: "https://openlayers.org/en/latest/examples/data/dot.png", // Dot image
      }),
    });

    // Apply the style to the point feature
    point.setStyle(style);

    let layers = map.getLayers().getArray();
    //console.log(layers);
    //console.log(layers[5])
    var idx = 0;
    layers.forEach(function (l, i) {
      // /console.log(l)
      if (l.get("id") === "geocoding_layer") {
        //console.log(i)
        idx = i;
      }
    });
    var source = layers[idx].getSource();

    source.clear();

    // Add the point feature to the vector source
    source.addFeature(point);

    // Animate the point feature (optional)
    map.getView().animate({
      center: fromLonLat([lon, lat]), // Target center
      duration: 2000, // Animation duration in milliseconds
      zoom: 17, // Target zoom level
    });
  };

  useEffect(() => {
    if (!map) return;
    var vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    vectorLayer.set("id", "geocoding_layer");
    map.addLayer(vectorLayer);
  }, [map]);

  // Function to animate the point feature

  // Function to zoom out
  const geocode = (query) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=7&viewbox=89.64811%2C24.76668%2C155.30240%2C-9.18899`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          setFilteredSuggestions(data);
          setMessage("");
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        setMessage("Geocoding error:", error);
      });
  };

  return (
    <SearchContainer>
      <Card sx={{ padding: "7px", width: "220px", height: "50px" }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          size="small"
          placeholder="Cari Lokasi"
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={inputValue}
          onChange={handleInputChange}
        />
      </Card>

      {showSuggestions && (
        <ResultContainer>
          {message != "" ? <Box sx={{ padding: "10px" }}>{message}</Box> : ""}
          <List>
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion.display_name} />
              </ListItem>
            ))}
          </List>
        </ResultContainer>
      )}
    </SearchContainer>
  );
};

export default GeocodingSearchContainer;
