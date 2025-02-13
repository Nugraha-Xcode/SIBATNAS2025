import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
//import styled from "styled-components";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Close } from "@mui/icons-material";

import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import environment from "src/config/environment";

//import { makeStyles } from "@material-ui/core/styles";
//import Config from "../../config.json";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
function createData(id, name, obj) {
  return { id, name, obj };
}
const rows = [
  createData(
    1,
    "Jawa Barat",
    <Button size="small" variant="contained" color="primary">
      Select
    </Button>
  ),
];

//rows =[];
/*
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  show: {
    visibility: "visible",
  },
  hide: {
    visibility: "hidden",
    display: "none",
  },
}));
*/
export default function SelectArea({
  open,
  handleCloseSelectArea,
  labelArea,
  setLabelArea,
  setBoundary,
  setBbox,
  setZoomBbox,
  setVisibleBbox,
  setVisibleBoundary,
}) {
  //const classes = useStyles();
  const [value, setValue] = useState(0);

  const [idCountry, setIdCountry] = useState(1);
  const [labelCountry, setLabelCountry] = useState("");
  const [idProvince, setIdProvince] = useState(0);
  const [labelProvince, setLabelProvince] = useState("");
  const [idMunicipal, setIdMunicipal] = useState(0);
  const [labelMunicipal, setLabelMunicipal] = useState("");
  const url_list_country = environment.api + "/countries/";
  const url_get_country = environment.api + "/countries/id/";
  const url_list_provinces = environment.api + "/provinces/country/";
  const url_get_province = environment.api + "/provinces/id/";
  const url_list_municipals = environment.api + "/regions/province/";
  const url_get_municipal = environment.api + "/regions/id/";
  const url_search_municipal = environment.api + "/regions/search/";
  const [listCountries, setListCountries] = useState();
  const [listProvinces, setListProvinces] = useState();
  const [listMunicipals, setListMunicipals] = useState();
  const [localLabelArea, setLocalLabelArea] = useState("Indonesia");

  const [data, setData] = useState();
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    let mounted2 = true;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //
    fetch(url_list_country, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          //console.log(data);
          //var dataset = [{ id: 0, name: "All" }]
          var dataset = [];
          data.data.forEach((element) => {
            dataset.push(element);
            setLabelCountry(element.name);
          });
          //console.log(dataset)
          setListCountries(dataset);
        }
      });

    fetch(url_list_provinces + idCountry, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted2) {
          //console.log(data);
          var dataset = [{ id: 0, name: "Semua Provinsi" }];
          data.data.forEach((element) => {
            dataset.push(element);
          });
          //console.log(dataset)
          setListProvinces(dataset);
        }
      });

    return function cleanup() {
      mounted = false;
      mounted2 = false;
    };
  }, []);

  function getCountries() {
    if (typeof listCountries !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listCountries !== null) {
        if (listCountries.length > 0) {
          return listCountries.map((row, index) => {
            //console.log(row.id, index)
            return (
              <MenuItem key={index} value={row.id}>
                {row.name}
              </MenuItem>
            );
          });
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function getProvinces() {
    if (typeof listProvinces !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listProvinces !== null) {
        if (listProvinces.length > 0) {
          return listProvinces.map((row, index) => {
            //console.log(row.id, index)
            return (
              <MenuItem key={index} value={row.id}>
                {row.name}
              </MenuItem>
            );
          });
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function getMunicipals() {
    if (typeof listMunicipals !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listMunicipals !== null) {
        if (listMunicipals.length > 0) {
          return listMunicipals.map((row, index) => {
            //console.log(row.id, index)
            return (
              <MenuItem key={index} value={row.id}>
                {row.name}
              </MenuItem>
            );
          });
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  const handleChangeSelect = (event) => {
    setIdCountry(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeProvinces = (event) => {
    //setIdCountry(event.target.value);
    setIdProvince(event.target.value);
    //console.log(event.target);
    var raw = listProvinces.filter((x) => x.id === event.target.value);
    //console.log(event.target.value);

    setLabelProvince(raw[0].name);

    if (event.target.value === 0) {
      setLocalLabelArea(labelCountry);
      setListMunicipals([{ id: 0, name: "Semua Kabupaten/Kota" }]);
      //props.setAreaName("Choose Country/Region")
      //props.setBbox([-180, -90, 180, 90])
      //props.setBboxLabel('[]');
      //props.setBboxGeom([{type:"Point", coordinates:[60,-2]},{type:"Point", coordinates:[[0,0]]},0]);
    } else {
      //alert ('Generate Regions')
      setIdMunicipal(0);
      setLocalLabelArea(labelCountry + "/" + raw[0].name);
      load_municipals(event.target.value);
    }
  };

  function load_municipals(id) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(url_list_municipals + id, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.data);
        var dataset = [{ id: 0, name: "Semua Kabupaten/Kota" }];
        data.data.forEach((element) => {
          dataset.push(element);
        });
        //console.log(dataset)
        setListMunicipals(dataset);
      });
  }

  const handleChangeMunicipal = (event) => {
    setIdMunicipal(event.target.value);
    var raw = listMunicipals.filter((x) => x.id === event.target.value);
    //console.log(event.target.value);

    setLabelMunicipal(raw[0].name);
    if (event.target.value === 0) {
      setLocalLabelArea(labelCountry + "/" + labelProvince);
    } else {
      //alert ('Generate Regions')
      setLocalLabelArea(labelCountry + "/" + labelProvince + "/" + raw[0].name);
    }
  };

  const handleClose = () => {
    handleCloseSelectArea(false);
  };

  function handlingRefine() {
    //alert('oke')
    if (idCountry > 0) {
      if (idProvince > 0) {
        if (idMunicipal > 0) {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };

          //props.setShowArea(true)
          fetch(url_get_municipal + idMunicipal, requestOptions)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "ok") {
                //console.log(data.message);
                setLabelArea(localLabelArea);
                var bbox = JSON.parse(data.message.bbox);
                var geom = JSON.parse(data.message.geom);

                //console.log(bbox.coordinates[0][0][0])
                var center = JSON.parse(data.message.center);
                console.log(center.coordinates);
                setBbox([
                  bbox.coordinates[0][0][0],
                  bbox.coordinates[0][0][1],
                  bbox.coordinates[0][2][0],
                  bbox.coordinates[0][2][1],
                ]);
                //props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                setBoundary(geom);
                setZoomBbox(true);
                setVisibleBoundary(true);
                setVisibleBbox(true);
                //props.setBboxGeom([center, geom, 2]);
              }
            });
        } else {
          const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };

          //alert('aaa')
          //props.setShowArea(true)
          fetch(url_get_province + idProvince, requestOptions)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "ok") {
                //console.log(data.message);
                //props.setAreaName(areaLabel)
                setLabelArea(localLabelArea);
                var bbox = JSON.parse(data.message.bbox);
                var center = JSON.parse(data.message.center);

                var geom = JSON.parse(data.message.geom);
                //console.log(bbox.coordinates[0][0][0])
                setBbox([
                  bbox.coordinates[0][0][0],
                  bbox.coordinates[0][0][1],
                  bbox.coordinates[0][2][0],
                  bbox.coordinates[0][2][1],
                ]);
                //props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
                setBoundary(geom);
                setZoomBbox(true);
                setVisibleBoundary(true);
                setVisibleBbox(true);
                //props.setPerformZoom(true)
                //props.setBboxGeom([center, geom, 1]);
              }
            });
        }
      } else {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };

        //alert('aaa')
        //props.setShowArea(true)
        fetch(url_get_country + idCountry, requestOptions)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              //console.log(data.message);
              //props.setAreaName(areaLabel)
              setLabelArea(localLabelArea);
              var bbox = JSON.parse(data.message.bbox);
              var center = JSON.parse(data.message.center);

              var geom = JSON.parse(data.message.geom);
              //console.log(bbox.coordinates[0][0][0])

              setBbox([
                bbox.coordinates[0][0][0],
                bbox.coordinates[0][0][1],
                bbox.coordinates[0][2][0],
                bbox.coordinates[0][2][1],
              ]);
              //props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
              setBoundary(geom);
              setZoomBbox(true);
              setVisibleBoundary(true);
              setVisibleBbox(true);
              //props.setPerformZoom(true)
              //props.setBboxGeom([center, geom, 1]);
            }
          });
      }
    } else {
      setLabelArea("Indonesia");
      setBbox([
        10576432.203633543, -1232970.377072403, 15698207.799929712,
        677753.767059113,
      ]);
      setZoomBbox(true);
      setVisibleBoundary(true);
      setVisibleBbox(true);
      //props.setBboxLabel('[-133044556.25, -20037508.34, 133044555.80, 20037508.35]');
      //props.setCountry()
      //props.setPerformZoom(true)
      //props.setBboxGeom([{ type: "Point", coordinates: [60, -2] }, { type: "Polygon", coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]] }, 0]);
    }
  }

  function handleSearch(event) {
    //console.log(key);
    let key = event.target.value;

    setQuery(key);
    if (key.length < 2) {
      setData();
    } else {
      //alert('cari')
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch(url_search_municipal + key, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setData(data.data);
          //console.log(data.data)
        });
    }
  }

  function getRowsData() {
    if (typeof data !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (data !== null) {
        if (data.length > 0) {
          return data.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  style={{ padding: "5px 15px", borderRadius: "20px" }}
                  onClick={() => handlingRefineSearch(row)}
                >
                  Pilih
                </Button>
              </TableCell>
            </TableRow>
          ));
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function handlingRefineSearch(row) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    //props.setShowArea(true)
    fetch(url_get_municipal + row.id, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          //console.log(data.message);
          //props.setAreaName(row.name)
          setLabelArea(row.name);
          var bbox = JSON.parse(data.message.bbox);
          var geom = JSON.parse(data.message.geom);
          //console.log(bbox.coordinates[0][0][0])
          var center = JSON.parse(data.message.center);
          //console.log(center.coordinates)
          setBbox([
            bbox.coordinates[0][0][0],
            bbox.coordinates[0][0][1],
            bbox.coordinates[0][2][0],
            bbox.coordinates[0][2][1],
          ]);
          //props.setBboxLabel('[' + bbox.coordinates[0][0][0].toFixed(2) + ', ' + bbox.coordinates[0][0][1].toFixed(2) + ', ' + bbox.coordinates[0][2][0].toFixed(2) + ', ' + bbox.coordinates[0][2][1].toFixed(2) + ']')
          setBoundary(geom);
          setZoomBbox(true);
          setVisibleBoundary(true);
          setVisibleBbox(true);
          //props.setBboxGeom([center, geom, 2]);
        }
      });
  }

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle
        style={{
          cursor: "move",
          padding: "5px 10px",
          backgroundColor: "#f3f3f3",
        }}
        id="draggable-dialog-title"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5 style={{ margin: "0px" }}>Definisikan Area Studi</h5>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent style={{ minHeight: "55vh", padding: "0px" }}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="select and search area study"
            variant="fullWidth"
          >
            <Tab label="Pilih" {...a11yProps(0)} />
            <Tab label="Cari" {...a11yProps(1)} />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <h3 style={{ margin: "0px 0px 15px 0px", textAlign: "center" }}>
            {localLabelArea}
          </h3>
          <FormControl
            fullWidth
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              minHeight: "35vh",
            }}
          >
            <TextField
              id="outlined-select-currency"
              select
              label="Negara"
              value={idCountry}
              onChange={handleChangeSelect}
              variant="outlined"
              size="small"
            >
              {getCountries()}
            </TextField>
            <TextField
              id="outlined-select-province"
              select
              label="Provinsi"
              value={idProvince}
              onChange={handleChangeProvinces}
              variant="outlined"
              size="small"
            >
              {getProvinces()}
            </TextField>
            <TextField
              id="outlined-select-municipal"
              select
              label="Kabupaten/Kota"
              value={idMunicipal}
              onChange={handleChangeMunicipal}
              variant="outlined"
              size="small"
            >
              {
                //className={idProvince > 0 ? classes.show : classes.hide}
              }
              {getMunicipals()}
            </TextField>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              style={{ padding: "5px 15px", borderRadius: "20px" }}
              onClick={handlingRefine}
            >
              Perbarui
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              style={{ padding: "5px 15px", borderRadius: "20px" }}
              onClick={handleClose}
            >
              Batal
            </Button>
          </FormControl>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <TextField
              id="outlined-select-currency"
              label="Ketik Nama Area"
              defaultValue={query}
              onChange={handleSearch}
              size="small"
              variant="outlined"
              autoComplete="off"
            />
          </FormControl>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead color="#ddd">
                <TableRow>
                  <TableCell>Id </TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRowsData()}
                {/*
                                    rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.obj}</TableCell>
                                    </TableRow>
                                ))
                                */}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
/*

 <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>

            */
