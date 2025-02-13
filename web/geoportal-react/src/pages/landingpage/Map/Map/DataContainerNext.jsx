import {
  Box,
  Card,
  IconButton,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  Slide,
  Stack,
  Tabs,
  TextField,
  Tab,
  Paper,
  Zoom,
  Divider,
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
  Close,
  ExpandLess,
  ExpandMore,
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

const DContainer = styled(Box)(
  ({ theme }) => `
        margin: 7% auto; /* 10% from the top and centered */
        padding: 20px;
        color: white;
        transition: 'opacity 1500ms ease-in-out';
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
const CustomButton = styled(Button)({
  backgroundColor: "white", // Custom background color
  width: "100%",
  "&:hover": {
    backgroundColor: "#eee", // Custom background color on hover
  },
});
const DataContainer = ({ children }) => {
  const { map } = useContext(MapViewerContext);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("please wait..");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isVisibleData, setIsVisibleData] = useState(false);

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

  const handleCloseData = () => {
    setIsVisibleData(false);
  };

  return (
    <DContainer id="dataContainer">
      <Card>
        <Box
          sx={{
            width: "100%",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
              padding: "10px 10px 0px 10px",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ color: "#000" }}
            >
              Cari Data Geospasial
            </Typography>
            <IconButton size="small" onClick={handleCloseData}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Divider />
            <Box
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  width: "350px",
                  borderRight: "solid 1px rgba(0, 0, 0, 0.12)",
                  padding: "10px",
                  maxHeight: "64vh",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#ecf0f1 #2c3e50",
                }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#000" }}
                    >
                      API [3]
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                    <AccordionSummary
                      expandIcon={
                        <IconButton
                          //onClick={}
                          aria-label="Load"
                        >
                          <NavigateNextIcon />
                        </IconButton>
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        Peta Kita
                      </Typography>
                    </AccordionSummary>

                    <AccordionSummary
                      expandIcon={
                        <IconButton
                          //onClick={}
                          aria-label="Load"
                        >
                          <NavigateNextIcon />
                        </IconButton>
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        Pulau
                      </Typography>
                    </AccordionSummary>

                    <AccordionSummary
                      expandIcon={
                        <IconButton
                          //onClick={}
                          aria-label="Load"
                        >
                          <NavigateNextIcon />
                        </IconButton>
                      }
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        Toponimi
                      </Typography>
                    </AccordionSummary>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#000" }}
                    >
                      Bisa diunduh [6]
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                    <AccordionSummary
                      expandIcon={<NavigateNextIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        BATAS WILAYAH
                      </Typography>
                    </AccordionSummary>
                    <AccordionSummary
                      expandIcon={<NavigateNextIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        BATNAS
                      </Typography>
                    </AccordionSummary>
                    <AccordionSummary
                      expandIcon={<NavigateNextIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        BENCANA
                      </Typography>
                    </AccordionSummary>
                    <AccordionSummary
                      expandIcon={<NavigateNextIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        DEMNAS
                      </Typography>
                    </AccordionSummary>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Typography
                          gutterBottom
                          variant="h4"
                          component="div"
                          sx={{ color: "#000" }}
                        >
                          PETA CETAK [4]
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#fff" }}>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            RBI format jpeg/pdf
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            LLN/LPI format jpeg/pdf
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            ZEE format jpeg/pdf
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            Kebencanaan format jpeg/pdf
                          </Typography>
                        </AccordionSummary>
                      </AccordionDetails>
                    </Accordion>
                    <AccordionSummary
                      expandIcon={<NavigateNextIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography
                        gutterBottom
                        variant="span"
                        component="div"
                        sx={{ color: "#777" }}
                      >
                        RBI PER KAB/KOTA
                      </Typography>
                    </AccordionSummary>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#000" }}
                    >
                      Data Analog [264,887]
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          Foto Udara
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#000" }}
                    >
                      Geoservices [3]
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          GIS
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          RASTER
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          RBI
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#000" }}
                    >
                      Penghubung SJ (Inageo) [397]
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          Kementerian [29]
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#fff" }}>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          onC
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            Kementerian Kelautan dan Perikanan
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            Kementerian Pertanian
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            Kementerian Pariwisata dan Ekonomi Kreatif
                          </Typography>
                        </AccordionSummary>
                        <AccordionSummary
                          expandIcon={<NavigateNextIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography
                            gutterBottom
                            variant="span"
                            component="div"
                            sx={{ color: "#777" }}
                          >
                            Kepolisian Negara Republik Indonesia
                          </Typography>
                        </AccordionSummary>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          Lembaga [6]
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          Provinsi [35]
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="span"
                          component="div"
                          sx={{ color: "#777" }}
                        >
                          Kabupaten/Kota [325]
                        </Typography>
                      </AccordionSummary>
                    </Accordion>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  padding: "10px",
                }}
              ></Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Box sx={{ width: "80%", display: "flex" }}>
                <CustomButton
                  onClick={handleCloseData}
                  size="large"
                  variant="outlined"
                  sx={{ width: "50%" }}
                >
                  Kembali
                </CustomButton>
                <Box sx={{ width: "20px" }}></Box>
                <CustomButton
                  onClick={handleCloseData}
                  size="large"
                  variant="outlined"
                >
                  Tambahkan ke peta dan lanjutkan jelajah
                </CustomButton>
                <Box sx={{ width: "20px" }}></Box>
                <CustomButton
                  onClick={handleCloseData}
                  size="large"
                  variant="outlined"
                >
                  Tambahkan ke peta dan akhiri jelajah
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </DContainer>
  );
};

export default DataContainer;
