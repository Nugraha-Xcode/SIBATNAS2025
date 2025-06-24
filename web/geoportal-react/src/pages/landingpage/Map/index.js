//import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import environment from "src/config/environment";
import { retrievePublik } from "src/redux/actions/record";
import Draggable from "react-draggable";
import { useContext, useState, useEffect } from "react";

import {
  Paper,
  Grid,
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
  InputAdornment,
  IconButton,
  Typography,
  styled,
  Slide,
  Stack,
  Tabs,
  TextField,
  Tab,
  Zoom,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  Popover,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { fromLonLat } from "ol/proj";
///import { Link as RouterLink } from "react-router-dom";
///import FullScreenImage from "./FullScreenImage";

import {
  MapViewerProvider,
  MapViewerContext,
} from "src/contexts/MapViewerContext";
import MapContainer from "./MapContainer";

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
  Language,
  ListAlt,
  MoreVert,
  ZoomIn,
} from "@mui/icons-material";

import BasemapContainer from "./Map/BasemapContainer";
import ZoomToolsContainer from "./Map/ZoomToolsContainer";
import CoordinateContainer from "./Map/CoordinateContainer";
import ScaleContainer from "./Map/ScaleContainer";
import GpsToolsContainer from "./Map/GpsToolsContainer";
import GeocodingSearchContainer from "./Map/GeocodingSearchContainer";
import DataContainer from "./Map/DataContainer";
import AreaContainer from "./Map/AreaContainer";
import GroupLayer from "./Map/Layers/GroupLayer";
import LegendaContainer from "./Map/LegendaContainer";
import Metadata from "./Metadata";

// Site Settings
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";

const OverviewWrapper = styled(Box)(
  () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
  `
);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(50)};
  `
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      font-weight: bold;
      border-radius: 30px;
      text-transform: uppercase;
      display: inline-block;
      font-size: ${theme.typography.pxToRem(11)};
      padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
      margin-bottom: ${theme.spacing(2)};
  `
);

const Banner = styled(Box)(
  ({ theme }) => `
    display: flex; 
    width: 100%; 
    height: 13vh; 
    background-color: rgba(255, 255, 255, 1); 
    z-index: 990; 
    position: fixed; 
    padding: 1em 3em;
    align-items: center;
  `
);

const ButtonContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      right: 15px;
      bottom: 20px;
      color: white;
      transition: 0.8s;
      height: 130px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
  `
);

const MenuContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 15px;
      top: 110px;
      background-color: "white";
  `
);

const LayerContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 15px;
      top: 170px;
      color: white;
      transition: 'opacity 1500ms ease-in-out';
      padding-top: 5px;
  `
);

const DataModal = styled(Box)(
  ({ theme }) => `
    position: fixed; /* Stay in place */
    z-index: 3; /* Sit on top */
    left: 0;
    top: 0;
    padding: 0px 100px;
    width: 100vw; /* Full width */
    height: 100vh; /* Full height */
    overflow: hidden; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.4); /* Black with opacity */
    backdrop-filter: blur(5px); /* Blur effect */
  `
);

const AreaModal = styled(Box)(
  ({ theme }) => `
    position: fixed; /* Stay in place */
    z-index: 3; /* Sit on top */
    left: 0;
    top: 0;
    padding: 0px 100px;
    width: 100vw; /* Full width */
    height: 100vh; /* Full height */
    overflow: hidden; /* Enable scroll if needed */
    background-color: rgba(0, 0, 0, 0.4); /* Black with opacity */
    backdrop-filter: blur(5px); /* Blur effect */
  `
);

const CustomButton = styled(Button)({
  backgroundColor: "white", // Custom background color
  width: "100%",
  "&:hover": {
    backgroundColor: "#eee", // Custom background color on hover
  },
});

function Penyaji() {
  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pagination, setPagination] = useState(1);
  const [query, setQuery] = useState("none");
  const [tag, setTag] = useState("Semua");
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleData, setIsVisibleData] = useState(false);
  const [isVisibleArea, setIsVisibleArea] = useState(false);
  const [bbox, setBbox] = useState([
    13276235.127624, -583404.458671, 13307444.545959, -557939.102627,
  ]);
  const [mapLayer, setMapLayer] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setId] = useState(null);

  const [urlWMS, setUrlWMS] = useState(null);

  const [zoomToMap, setZoomToMap] = useState();
  const [showMetadata, setShowMetadata] = useState(false);

  const [identifierDelete, setIdentifierDelete] = useState("");
  const [identifierZoom, setIdentifierZoom] = useState("");

  // Site Settings
  const siteSetting = useSelector((state) => state.siteSetting);

  const [identifierVisible, setIdentifierVisible] = useState("");
  const [center, setCenter] = useState(() => {
    // Check if siteSetting and coverage_area exist
    if (siteSetting && siteSetting.coverage_area) {
      try {
        // Parse the coverage_area JSON string
        const coverageArea = JSON.parse(siteSetting.coverage_area);
        return [parseFloat(coverageArea.longitude), parseFloat(coverageArea.latitude)];
      } catch (e) {
        console.error("Error parsing coverage area:", e);
        return [115, -1.93]; // Default to Indonesia center
      }
    }
    return [115, -1.93]; // Default to Indonesia center
  });

  const [zoom, setZoom] = useState(() => {
    if (siteSetting && siteSetting.coverage_area) {
      try {
        const coverageArea = JSON.parse(siteSetting.coverage_area);
        const name = coverageArea.name?.toUpperCase() || "";
  
        if (name === "INDONESIA") {
          return 5.5;
        } else if (name.startsWith("KABUPATEN ") || name.startsWith("KOTA ")) {
          return 13;
        } else {
          return 9;
        }
      } catch (e) {
        console.error("Error parsing coverage area:", e);
        return 5.5;
      }
    }
    return 5.5;
  });
  
  // const [center, setCenter] = useState([115, -1.93]);
  // const [zoom, setZoom] = useState(5.5);
  const [row, setRow] = useState();

  const datas = useSelector((state) => state.record.allRecords);

  const dispatch = useDispatch();

  // Site Settings
  useEffect(() => {
    dispatch(retrievePublicSiteSettings());
  }, []);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRow(row);
    setId(row.id);
    setUrlWMS(row.url);
    console.log(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLinkWMS = () => {
    if (urlWMS) {
      window.open(urlWMS);
      setAnchorEl(null);
    }
  };
  const handleSetZoomMap = () => {
    //setZoomToMap(id);
    setIdentifierZoom(id);
    setAnchorEl(null);
  };

  const handleSetMetadata = () => {
    setShowMetadata(true);
    setAnchorEl(null);
  };
  const openPop = Boolean(anchorEl);
  const idpop = openPop ? "simple-popover" : undefined;

  useEffect(() => {
    dispatch(retrievePublik());
  }, []);

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const handleOpenData = () => {
    setIsVisibleData(true);
  };
  const handleCloseData = () => {
    setIsVisibleData(false);
  };

  const handleOpenArea = () => {
    setIsVisibleArea(true);
  };
  const handleCloseArea = () => {
    setIsVisibleArea(false);
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching...");
  };

  const handleArrowClick = (numb) => {
    // Implement your search logic here
    console.log("Click..." + numb);
  };

  function deleteDataset(id) {
    //setDataset(oldArray => [...oldArray, newElement]);
    //console.log(dataset);

    const layers = mapLayer.slice();
    console.log(id);

    //console.log(map)
    //map.eachLayer(function(layer){
    //if(layer.options.id === id)
    //map.removeLayer(layer)
    //});
    //var index = mapLayer.findIndex(x => x.id === id);
    //setDataset(mapLayer.slice(index, 1));
    //console.log(typeof(id))
    //console.log(typeof(dataset.slice()[0].id))
    //console.log(dataset.filter(item => item.id !== id))
    setMapLayer(mapLayer.filter((item) => item.id !== id));
    setIdentifierDelete(id);
  }

  function handleVisible(id) {
    //setIdentifierVisible(id);
    const data = mapLayer.slice();
    //console.log(data[0]);
    var index = mapLayer.findIndex((x) => x.id === id);
    console.log(index);
    data[index].visible = !data[index].visible;
    setMapLayer(data);
    //.log(map);
  }

  /*
  const url_list_data =
    environment.api +
    "/harvestings/limit/title/" +
    page +
    "/" +
    size +
    "/" +
    query;
  const url_list_count = environment.api + "record/count/" + query;

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //
    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
    fetch(url_list_count, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setPagination(Math.ceil(data.count / size));
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //
    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, [page]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //
    fetch(url_list_data, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
    fetch(url_list_count, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setPagination(Math.ceil(data.count / size));
      });
  }, [query]);
  */

  function getListLayers() {
    if (mapLayer !== "undefined") {
      if (mapLayer.length > 0) {
        let reverseLayer = mapLayer; //.reverse();
        return mapLayer.map((row, index) => {
          //console.log(row)
          //console.log(row.id.includes('uploader'))
          //onChange={(e) => props.setLayerVisible(row.id)}

          const labelId = `checkbox-list-label-${index}`;
          /*return (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<MoreVertOutlinedIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography
                  gutterBottom
                  variant="span"
                  component="div"
                  sx={{ color: "#777" }}
                >
                  {row.title}
                </Typography>
              </AccordionSummary>
            </Accordion>
          );*/
          return (
            <ListItem
              key={index}
              role={undefined}
              dense
              button
              style={{ padding: "0px" }}
            >
              <ListItemIcon style={{ minWidth: "16px" }}>
                <Checkbox
                  edge="start"
                  checked={row.visible}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onClick={() => handleVisible(row.id)}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={shorten(row.title, 20)}
                style={{ fontSize: "10px", maxWidth: "185px" }}
              />
              <ListItemSecondaryAction style={{ right: "0px" }}>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => deleteDataset(row.id)}
                >
                  <DeleteIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => handleClick(e, row)}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        });
      } else {
        return (
          <Accordion key={99}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography
                gutterBottom
                variant="span"
                component="div"
                sx={{ color: "#777" }}
              >
                Belum ditambahkan layer. Pilih layer dari Katalog Data terlebih
                dahulu.
              </Typography>
            </AccordionSummary>
          </Accordion>
        );
      }
    }
  }
  function shorten(str, maxLen) {
    console.log(str);
    if (str.length <= maxLen) return str;
    return str.substr(0, maxLen - 1) + " ...";
  }

  return (
    <>
      <Helmet>
        <title>Penyaji Peta</title>
      </Helmet>
      <Grid container sx={{ height: "86vh" }}>
        <MapViewerProvider>
          <MapContainer center={center} zoom={zoom}>
            <GroupLayer
              zIndex={11}
              mapLayer={mapLayer}
              identifierDelete={identifierDelete}
              setIdentifierDelete={setIdentifierDelete}
              identifierZoom={identifierZoom}
              setIdentifierZoom={setIdentifierZoom}
            />
            <MenuContainer id="menuContainer">
              <CustomButton
                startIcon={<DashboardIcon />}
                onClick={handleToggle}
                size="large"
              >
                Menu
              </CustomButton>
            </MenuContainer>
            <GeocodingSearchContainer />
            <Zoom
              in={isVisibleData}
              style={{ transitionDelay: isVisibleData ? "200ms" : "0ms" }}
            >
              <DataModal id="dataModal">
                <DataContainer
                  handleCloseData={handleCloseData}
                  dataAll={datas}
                  setMapLayer={(e) => setMapLayer(e)}
                />
              </DataModal>
            </Zoom>

            <AreaContainer
              handleCloseArea={handleCloseArea}
              isVisibleArea={isVisibleArea}
            />
            <Slide
              direction="right"
              in={isVisible}
              //mountOnEnter unmountOnExit
              timeout={{ enter: 500, exit: 200 }}
            >
              <LayerContainer id="layerContainer">
                <Card>
                  <Box
                    sx={{
                      width: "325px",
                      height: "57vh",
                    }}
                  >
                    {/*
                    <Accordion defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography
                          gutterBottom
                          variant="h4"
                          component="div"
                          sx={{ color: "#000" }}
                        >
                          Area Studi [Indonesia]
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#eee" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            marginBottom: "5px",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleOpenArea}
                          >
                            Pilih Area
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ ml: "10px" }}
                          >
                            Gambar AOI
                          </Button>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            marginTop: "5px",
                          }}
                        >
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{ color: "#333" }}
                          >
                            Bounding Box Terpilih:
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="span"
                              component="div"
                              sx={{ color: "#888" }}
                            >
                              Xmin: {bbox[0]}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="span"
                              component="div"
                              sx={{ color: "#888" }}
                            >
                              Ymin: {bbox[1]}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="span"
                              component="div"
                              sx={{ color: "#888" }}
                            >
                              Xmax: {bbox[2]}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="span"
                              component="div"
                              sx={{ color: "#888" }}
                            >
                              Ymax: {bbox[3]}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    */}
                    <Accordion defaultExpanded>
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
                          Daftar Layer Peta [{mapLayer.length}]
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List
                          style={{
                            overflow: "scroll",
                            maxHeight: "340px",
                          }}
                        >
                          {
                            getListLayers()
                            /*
                        sx={{ backgroundColor: "#eee" }}
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<MoreVertOutlinedIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Typography
                              gutterBottom
                              variant="span"
                              component="div"
                              sx={{ color: "#777" }}
                            >
                              AAtlas_Sebaran_GunungApi
                            </Typography>
                          </AccordionSummary>
                        </Accordion>
                        */
                          }
                        </List>
                        <Popover
                          id={idpop}
                          open={openPop}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          {
                            //<Typography>The content of the Popover. {identifier}</Typography>
                            id && (
                              <List
                                component="nav"
                                aria-label="main mailbox folders"
                              >
                                {/*
                                <ListItem
                                  button
                                  style={{
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                  }}
                                  onClick={() => handleSetZoomMap()}
                                >
                                  <ListItemIcon style={{ minWidth: "40px" }}>
                                    <ZoomIn />
                                  </ListItemIcon>
                                  <ListItemText primary="Perbesar ke" />
                                </ListItem>
                                */}
                                {!id.includes("uploader") && (
                                  <ListItem
                                    button
                                    style={{
                                      paddingTop: "0px",
                                      paddingBottom: "0px",
                                    }}
                                    onClick={() => handleSetMetadata()}
                                  >
                                    <ListItemIcon style={{ minWidth: "40px" }}>
                                      <ListAlt />
                                    </ListItemIcon>
                                    <ListItemText primary="Lihat Metadata" />
                                  </ListItem>
                                )}
                                {/*!id.includes("uploader") && (
                                  <ListItem
                                    button
                                    style={{
                                      paddingTop: "0px",
                                      paddingBottom: "0px",
                                    }}
                                    onClick={() => handleLinkWMS()}
                                  >
                                    <ListItemIcon style={{ minWidth: "40px" }}>
                                      <Language />
                                    </ListItemIcon>
                                    <ListItemText primary="Url Web Service" />
                                  </ListItem>
                                )*/}
                              </List>
                            )
                          }
                        </Popover>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                  <Box sx={{ padding: "10px" }}>
                    <CustomButton
                      startIcon={<LibraryBooksIcon />}
                      onClick={handleOpenData}
                      size="large"
                      variant="outlined"
                    >
                      Katalog Data [{datas.length}]
                    </CustomButton>
                  </Box>
                </Card>
              </LayerContainer>
            </Slide>
            <Metadata
              open={showMetadata}
              //id={identifier}
              row={row?.metadata}
              handleCloseMetadata={(e) => setShowMetadata(e)}
            />
            <ScaleContainer />
            <CoordinateContainer />
            <BasemapContainer />
            <LegendaContainer mapLayer={mapLayer} />
            <ButtonContainer id="buttonContainer">
              <ZoomToolsContainer />
              <GpsToolsContainer />
            </ButtonContainer>
          </MapContainer>
          <div id="popup" className="ol-popup">
            <a href="#" id="popup-closer" className="ol-popup-closer"></a>
            <div id="popup-content"></div>
          </div>
        </MapViewerProvider>
      </Grid>
    </>
  );
}

export default Penyaji;
