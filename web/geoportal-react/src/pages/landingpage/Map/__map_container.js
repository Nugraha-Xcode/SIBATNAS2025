import "ol/ol.css";
import "./App.css";
//import Config from "./config.json";

//import styled from "styled-components";
import { useState, useEffect, forwardRef } from "react";
import { IconButton, Slide, styled, Box } from "@mui/material";
import { Close } from "@mui/icons-material";

import TopMenu from "src/components/TopMenu";
import LeftMenu from "./LeftMenu";
import MapContainer from "./MapContainer";
import Area from "./Area/Area";
import Data from "./Data/Data";
//import SelectArea from "./Area/SelectArea";
//import BrowseData from "./Data/BrowseData";
//import ImportData from "./Data/ImportData";
//import Analysis from "./Analysis/Analysis";
//import Statistic from "./Statistic/Statistic";
//import Digsig from "./Digsig/Digsig";
import About from "./About/About";
//import { makeStyles } from "@material-ui/core/styles";

import environment from "src/config/environment";
/*
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
*/
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  //const classes = useStyles();
  const idCountry = 1;
  const url_get_country = environment.api + "/countries/id/";

  const [center, setCenter] = useState([115, -1.93]);
  const [zoom, setZoom] = useState(5.6);
  const [basemap, setBasemap] = useState("rbi");

  const [menu, setMenu] = useState("area");
  const [slideBar, setSliderBar] = useState(false);
  const [open, setOpen] = useState(false);
  const [statistic, setStatistic] = useState(false);
  const [digsig, setDigsig] = useState(false);
  const [value, setValue] = useState(2);

  const [selectArea, setSelectArea] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [browseData, setBrowseData] = useState(false);
  const [importData, setImportData] = useState(false);
  //const [openSearch, setOpenSearch] = useState(false);

  const [bbox, setBbox] = useState([
    10576432.203633543, -1232970.377072403, 15698207.799929712,
    677753.767059113,
  ]);

  //const [bboxLabel, setBboxLabel] = useState('[' + bbox[0].toFixed(2) + ', ' + bbox[1].toFixed(2) + ', ' + bbox[2].toFixed(2) + ', ' + bbox[3].toFixed(2) + ']');
  const [visibleBbox, setVisibleBbox] = useState(true);
  const [boundary, setBoundary] = useState();
  const [visibleBoundary, setVisibleBoundary] = useState(true);
  const [zoomBbox, setZoomBbox] = useState(false);
  const [visibleStatistic, setVisibleStatistic] = useState(false);
  const [visibleAnalysis, setVisibleAnalysis] = useState(false);

  const [dataAll, setDataAll] = useState();
  const [mapLayer, setMapLayer] = useState([]);
  const url_list_harvesting = environment.api + "/harvestings/bbox/";

  const [labelArea, setLabelArea] = useState("Indonesia");
  const [identifierMetadata, setIdentifierMetadata] = useState("");
  const [identifierAttribute, setIdentifierAttribute] = useState("");
  const [identifierDelete, setIdentifierDelete] = useState("");
  const [identifierVisible, setIdentifierVisible] = useState("");
  const [buffered, setBuffered] = useState();
  const [zoomToMap, setZoomToMap] = useState();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [sidebarTitle, setSidebarTitle] = useState({
    area: "Area Studi",
    data: "Data ",
    about: "About ",
  });

  const [sidebarContent, setSidebarContent] = useState({
    area: null,
    data: null,
  });

  function handlingMenu(e) {
    //closeMenu();

    setMenu(e);
    if (e === "analysis" || e === "statistic" || e === "digsig") {
      var sidebar = document.getElementById("sidebar");
      sidebar.style.width = "0px";

      var buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.style.marginLeft = "15px";
      if (e === "analysis") {
        setOpen(true);
      } else if (e === "statistic") {
        setStatistic(true);
      } else if (e === "digsig") {
        setDigsig(true);
      }
    } else {
      var sidebar = document.getElementById("sidebar");
      sidebar.style.width = "330px";
      var close = document.getElementById("close");
      close.style.display = "inline-block";
      var buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.style.marginLeft = "350px";
    }

    //var mapContainer = document.getElementById('mapContainer');
    //mapContainer.style.marginLeft = "350px";
    //sideHelper.addClass('')
  }

  //document.getElementById("mySidenav").style.width = "250px";
  //document.getElementById("main").style.marginLeft = "250px";

  function closeMenu() {
    setMenu();
    var sidebar = document.getElementById("sidebar");
    sidebar.style.width = "0px";
    var close = document.getElementById("close");
    close.style.display = "none";
    var buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.style.marginLeft = "15px";
    //var mapContainer = document.getElementById('mapContainer');
    //mapContainer.style.marginLeft = "0px";
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //mountOnEnter unmountOnExit
  /*
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  */

  function handleCloseAnalysis(e) {
    setOpen(false);
    setMenu();
  }
  function handleCloseStatistic(e) {
    setStatistic(false);
    setMenu();
  }
  function handleCloseDigsig(e) {
    setDigsig(false);
    setMenu();
  }
  function handleCloseSelectArea(e) {
    setSelectArea(false);
  }
  function handleCloseBrowseData(e) {
    setBrowseData(false);
  }
  function handleCloseImportData(e) {
    setImportData(false);
  }

  function renderIt() {
    if (menu === "area") {
      return (
        <Area
          labelArea={labelArea}
          setSelectArea={(e) => setSelectArea(e)}
          drawing={drawing}
          setDrawing={(e) => setDrawing(e)}
          visibleBoundary={visibleBoundary}
          setVisibleBoundary={(e) => setVisibleBoundary(e)}
          bbox={bbox}
          visibleBbox={visibleBbox}
          setVisibleBbox={(e) => setVisibleBbox(e)}
          setZoomBbox={(e) => setZoomBbox(e)}
        />
      );
    } else if (menu === "data") {
      return (
        <Data
          setBrowseData={(e) => setBrowseData(e)}
          setImportData={(e) => setImportData(e)}
          mapLayer={mapLayer}
          deleteDataset={(e) => deleteDataset(e)}
          handleVisible={(e) => handleVisible(e)}
          setZoomToMap={(e) => setZoomToMap(e)}
        />
      );
    } else if (menu === "about") {
      return <About />;
    }
  }

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
    //console.log(index);
    data[index].visible = !data[index].visible;
    setMapLayer(data);
  }

  function handleOpacity(id, val) {
    //setIdentifierVisible(id);
    const data = mapLayer.slice();
    //console.log(data[0]);
    var index = mapLayer.findIndex((x) => x.id === id);
    //console.log(index);
    data[index].opacity = val;
    setMapLayer(data);
  }

  /*
  const handleClickOpen = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
  };
  */
  useEffect(() => {
    let mounted = true;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //
    fetch(url_get_country + idCountry, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          if (data.status === "ok") {
            //console.log(data.message);
            //props.setAreaName(areaLabel)
            var bbox = JSON.parse(data.message.bbox);
            var geom = JSON.parse(data.message.geom);

            //console.log(bbox.coordinates[0][0][0])
            // var center = JSON.parse(data.message.center);
            //console.log(center.coordinates)
            setBbox([
              bbox.coordinates[0][0][0],
              bbox.coordinates[0][0][1],
              bbox.coordinates[0][2][0],
              bbox.coordinates[0][2][1],
            ]);
            //props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
            setBoundary(geom);
            //props.setPerformZoom(true)
            //props.setBboxGeom([center, geom, 2]);
          }
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);
  /*
    
  //alert('aaa')
  props.setShowArea(true)
 
        */
  /*

   <Dialog fullScreen open={openSearch} onClose={handleCloseSearch} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar style={{display:'flex', justifyContent: 'space-between'}} >
            <IconButton edge="start" color="inherit" onClick={handleCloseSearch} aria-label="close">
              <CloseIcon />
            </IconButton>
            <TopSearch>
                <Paper component="form" style={{ display: 'flex', width: '100%' }} >
                    <InputBase
                        placeholder="Search Dataset"
                        inputProps={{ 'aria-label': 'search dataset' }}
                        style={{ marginLeft: '10px', flex: 1 }}
                    />
                    <IconButton aria-label="search" style={{ padding: 10 }} >
                        <Search />
                    </IconButton>
                </Paper>
            </TopSearch>
          
            <Button autoFocus color="inherit" onClick={handleCloseSearch}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
       
      </Dialog>
      */
  useEffect(() => {
    async function loadDataset() {
      /*
              const requestOptions = {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': token 
                        }
                    };
    
          */
      const response = await fetch(
        url_list_harvesting +
          bbox[0].toFixed(6) +
          "/" +
          bbox[1].toFixed(6) +
          "/" +
          bbox[2].toFixed(6) +
          "/" +
          bbox[3].toFixed(6)
      );

      var json = await response.json();

      if (response.status === 200) {
        //console.log(json.data)
        setDataAll(json.data); //.sort((a, b) => (a.title > b.title) ? 1 : -1));

        const ele = document.getElementById("ipl-progress-indicator");
        if (ele) {
          // fade out
          ele.classList.add("available");
          setTimeout(() => {
            // remove from DOM
            ele.outerHTML = "";
          }, 1000);
        }
      } else {
        console.log(response.status);
      }
    }

    loadDataset();
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    //-180, -90, 180, 90
    //100.0248/-1.1223/103.8146/2.9191
    //setIdOrganization(0)
    //setIdTheme(0)
    fetch(
      url_list_harvesting +
        bbox[0].toFixed(6) +
        "/" +
        bbox[1].toFixed(6) +
        "/" +
        bbox[2].toFixed(6) +
        "/" +
        bbox[3].toFixed(6),
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.data)

        //var result = data.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
        setDataAll(data.data); //.sort((a, b) => (a.title > b.title) ? 1 : -1));
      });
  }, [bbox]);

  return (
    <Container>
      {/*
      <SelectArea
        open={selectArea}
        handleCloseSelectArea={(e) => handleCloseSelectArea(e)}
        labelArea={labelArea}
        setLabelArea={setLabelArea}
        setBbox={setBbox}
        setBoundary={setBoundary}
        setZoomBbox={setZoomBbox}
        setVisibleBbox={setVisibleBbox}
        setVisibleBoundary={setVisibleBoundary}
      />
      <BrowseData
        open={browseData}
        handleCloseBrowseData={(e) => handleCloseBrowseData(e)}
        labelArea={labelArea}
        setSelectArea={(e) => setSelectArea(e)}
        dataAll={dataAll}
        setMapLayer={(e) => setMapLayer(e)}
      />
      <ImportData
        open={importData}
        handleCloseImportData={(e) => handleCloseImportData(e)}
        setMapLayer={(e) => setMapLayer(e)}
      />
      */}
      {/*
      <Analysis
        open={open}
        handleCloseAnalysis={(e) => handleCloseAnalysis(e)}
        mapLayer={mapLayer}
        setBuffered={(e) => setBuffered(e)}
        visibleAnalysis={visibleAnalysis}
        setVisibleAnalysis={setVisibleAnalysis}
      />
      <Statistic
        open={statistic}
        handleCloseStatistic={(e) => handleCloseStatistic(e)}
        visibleStatistic={visibleStatistic}
        setVisibleStatistic={setVisibleStatistic}
      />
      <Digsig
        open={digsig}
        handleCloseDigsig={(e) => handleCloseDigsig(e)}
        visibleStatistic={visibleStatistic}
        setVisibleStatistic={setVisibleStatistic}
      />
        */}
      <TopMenu />
      <Main>
        <Content>
          <LeftMenu
            menu={menu}
            setMenu={(e) => handlingMenu(e)}
            total={dataAll?.length}
          />
          <MapContainer
            id="mapContainer"
            center={center}
            zoom={zoom}
            basemap={basemap}
            setBasemap={setBasemap}
            bbox={bbox}
            visibleBbox={visibleBbox}
            boundary={boundary}
            visibleBoundary={visibleBoundary}
            zoomBbox={zoomBbox}
            setZoomBbox={setZoomBbox}
            drawing={drawing}
            setBbox={setBbox}
            setDrawing={setDrawing}
            setVisibleBbox={setVisibleBbox}
            setLabelArea={setLabelArea}
            visibleStatistic={visibleStatistic}
            mapLayer={mapLayer}
            identifierDelete={identifierDelete}
            setIdentifierDelete={setIdentifierDelete}
            visibleAnalysis={visibleAnalysis}
            buffered={buffered}
            zoomToMap={zoomToMap}
            setZoomToMap={setZoomToMap}
          />
        </Content>
        <Sidebar id="sidebar">
          <Closer>
            <SidebarTitle>{sidebarTitle[menu]}</SidebarTitle>
            <IconButton id="close" size="small" onClick={() => closeMenu()}>
              <Close fontSize="small" />
            </IconButton>
          </Closer>
          {
            renderIt()
            //sidebarContent[menu]
          }
        </Sidebar>
      </Main>
    </Container>
  );
}

export default App;

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
        margin-top: 4px;
        transform: scale(.8);
`
);

const Container = styled("div")(
  () => `
  display: flex;
  height: 100vh;
  flex-direction: column;
`
);

const Main = styled("div")(
  () => `
  display: flex;
  flex-grow: 1;
  height: 92vh;
`
);

const Sidebar = styled("div")(
  () => `
  height: 90vh;
  width: 330px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  margin-left: 70px;
  margin-top: 9.25vh;
  background-color: white;
  overflow-x: hidden;
  overflow-y: hidden;
  transition: 0.8s;
  border-right: 1px solid #eee;
`
);
const Closer = styled("div")(
  () => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 5px;
`
);

const SidebarTitle = styled("h3")(
  () => `
  padding-left: 17px;
`
);

const Content = styled("div")(
  () => `
  background-color: white;
  flex-grow: 1;
  display: flex;
  width: 100%;
`
);
