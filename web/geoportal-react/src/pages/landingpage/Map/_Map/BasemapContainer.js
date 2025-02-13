import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Card,
  CardMedia,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput,
  Input,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
  IconButton,
  Typography,
  styled,
  Slide,
  Stack,
  Tabs,
  TextField,
  Tab,
  Divider,
  Drawer,
  Chip,
  Fade,
} from "@mui/material";
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
  Remove as RemoveIcon,
  Close,
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  GpsFixed as GpsFixedIcon,
  LayersRounded,
  Print as PrintIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard,
  Menu as MenuIcon,
  Apps as AppsIcon,
} from "@mui/icons-material";
import { MapViewerContext } from "src/contexts/MapViewerContext";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import imagery_thumb from "./Layers/Basemap/thumbs/imagery.png";
import osm_thumb from "./Layers/Basemap/thumbs/osm.png";
import gray_thumb from "./Layers/Basemap/thumbs/gray.png";
import rbi_thumb from "./Layers/Basemap/thumbs/rbi.png";
import { rbi, osm, topo, gray, imagery } from "./Layers/Basemap";

const BasemapButton = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 10px;
      bottom: 20px;
      color: white;
      transition: 0.8s;
  `
);

const ContainerBasemap = styled(Box)(
  ({ theme }) => `
        position: absolute;
        z-index:2;
        left: 110px;
        bottom: 24px;
        color: white;
        transition: 2s;
    `
);

const BasemapContainer = ({ children }) => {
  const { map } = useContext(MapViewerContext);

  const [basemapVisible, setBasemapVisible] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("imagery");
  const [bmap, setBmap] = useState(imagery_thumb);
  const [datas, setDatas] = useState([
    { img: rbi_thumb, name: "rbi" },
    { img: imagery_thumb, name: "imagery" },
    { img: osm_thumb, name: "osm" },
    { img: gray_thumb, name: "gray" },
  ]);

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

  const handleBasemap = (name) => {
    var a = datas.filter(function (el) {
      return el.name === name;
    });
    setBmap(a[0].img);
    setSelectedBasemap(name);
    let layers = map.getLayers().getArray();
    layers[0].setSource(getBasemap(name));
    setBasemapVisible(false);
  };

  const generate_thumbs = () => {
    return (
      <CardMedia
        sx={{
          width: 80,
          height: 80,
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "end",
        }}
        image={bmap}
        title={selectedBasemap}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ color: "#eee", fontSize: "12px" }}
        >
          {selectedBasemap}
        </Typography>
      </CardMedia>
    );
  };

  const generate_basemap = () => {
    return datas.map((data) => (
      <Box key={data.name} onClick={() => handleBasemap(data.name)}>
        <img
          src={data.img}
          width="70px"
          height="70px"
          style={{
            objectFit: "cover",
            borderRadius: "5px",
            border: data.name == selectedBasemap ? "solid #4e9ce6 3px" : "none",
          }}
        />
      </Box>
    ));
  };

  return (
    <div>
      <BasemapButton id="basemapButton" onClick={toggleBasemap}>
        <Card sx={{ padding: "3px", cursor: "pointer" }}>
          {generate_thumbs()}
        </Card>
      </BasemapButton>
      <Slide
        direction="right"
        in={basemapVisible}
        style={{ transitionDelay: basemapVisible ? "200ms" : "0ms" }}
      >
        <ContainerBasemap id="basemap-container">
          <Card
            sx={{
              height: "80px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <Box>
              <Stack direction="row" spacing={1}>
                {generate_basemap()}
              </Stack>
            </Box>
          </Card>
        </ContainerBasemap>
      </Slide>
    </div>
  );
};

export default BasemapContainer;
