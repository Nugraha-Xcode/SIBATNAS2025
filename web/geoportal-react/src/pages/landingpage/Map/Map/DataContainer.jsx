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
  Tab,
  Paper,
  Zoom,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputBase,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";

import no_thumb from "./no_preview.png";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import "./penjelajah.css";
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
        margin: 3% auto; /* 10% from the top and centered */
        padding: 20px;
        color: white;
        transition: 'opacity 1500ms ease-in-out';
    `
);

const CustomButton = styled(Button)({
  backgroundColor: "white", // Custom background color
  width: "100%",
  "&:hover": {
    backgroundColor: "#eee", // Custom background color on hover
  },
});

const Wrapper = styled("div")({
  margin: "0px", // Custom background color
  display: "flex",
  height: "100%",
});

const FormContainer = styled("div")({});
const LeftContent = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: "5px 0px 5px 5px",
  width: "50%",
});

const RightContent = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  padding: "5px 0px 5px 5px",
  width: "50%",
});

const Filter = styled("div")({
  maxHeight: "50%",
  paddingRight: "10px",
});

const FormInput = styled("div")({
  margin: 0,
  display: "flex",
});

const FormInputRight = styled("div")({
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
});

const Label = styled("div")({
  width: "150px",
});

const Entry = styled("div")({
  flexGrow: 1,
  display: "flex",
});

const SpanContainer = styled("div")({
  flexGrow: 1,
  display: "flex",
  justifyContent: "flex-end",
});

const EntryMiddle = styled("div")({
  flexGrow: 1,
  paddingRight: "10px",
});

const AvailableDataset = styled("div")({
  flexGrow: 1,
  paddingRight: "10px",
});

const Metadata = styled("div")({
  display: "flex",
  height: "50%",
  maxHeight: "50%",
});

const Description = styled("div")({
  flexGrow: 1,
  width: "70%",
});

const Thumbnail = styled("div")({
  flexGrow: 1,
  width: "30%",
});

const Attribute = styled("div")({
  flexGrow: 1,
});

const Title = styled("h3")({
  margin: 0,
  color: "#2f4e6f",
});
const DataContainer = ({
  children,
  handleCloseData,
  open,
  handleCloseBrowseData,
  setSelectArea,
  labelArea,
  dataAll,
  setMapLayer,
}) => {
  const { map } = useContext(MapViewerContext);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("please wait..");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isVisibleData, setIsVisibleData] = useState(false);
  const url_list_organizations = "api/organizations/";
  const url_list_year = "api/query/year/";
  const url_list_keywords = "api/keywords/";

  const [idCountry, setIdCountry] = useState("");
  const [data, setData] = useState();
  const [dataAttribute, setDataAttribute] = useState();

  const [numberData, setNumberData] = useState(0);
  const [title, setTitle] = useState();
  const [identifier, setIdentifier] = useState();
  const [abstract, setAbstract] = useState();
  const [type, setType] = useState();
  const [organization, setOrganization] = useState();
  const [subjects, setSubjects] = useState();

  const [idOrganization, setIdOrganization] = useState(0);
  const [listOrganizations, setListOrganizations] = useState();

  const [idYear, setIdYear] = useState("All");
  const [listYears, setListYears] = useState();

  const [idKeywords, setIdKeywords] = useState(0);
  const [listKeywords, setListKeywords] = useState();
  const [query, setQuery] = useState("");
  const [urlWMS, setUrlWMS] = useState();
  const [layerWMS, setLayerWMS] = useState();
  const [layerOriginal, setLayerOriginal] = useState();
  const [layerPdf, setLayerPdf] = useState();
  const [layerKML, setLayerKML] = useState();
  const [layerGML, setLayerGML] = useState();
  const [layerSHP, setLayerSHP] = useState();
  const [layerCSV, setLayerCSV] = useState();
  const [layerExcel, setLayerExcel] = useState();
  const [layerGeojson, setLayerGeojson] = useState();

  const [metadata, setMetadata] = useState({
    title: "title",
    abstract: "abstract",
    identifier: "identifier",
    type: "type",
    organization: "organization",
    subjects: null,
    links: null,
    date_publication: null,
  });

  const [layerName, setLayerName] = useState("");
  const [urlThumb, setUrlThumb] = useState(no_thumb);
  const [server, setServer] = useState("geoserver");

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

  function setDataAktif(e, row) {
    //alert(id)
    //var list = document.getElementsByClassName("label-menu");
    //console.log(e, row)
    var aktif = document.getElementsByClassName("bgKuning");
    if (aktif.length > 0) {
      if (!aktif[0].classList.contains("data")) aktif[0].classList.add("data");
      aktif[0].classList.remove("bgKuning");
    }
    if (e !== null) {
      if (e.target.parentNode.classList.contains("data"))
        e.target.parentNode.classList.remove("data");
      e.target.parentNode.classList.add("bgKuning");
    }

    load_aktif(row);
  }

  const handleClose = () => {
    handleCloseData(false);
  };

  function addAndGo() {
    handleCloseData(false);
    setMapLayer((oldArray) => [
      ...oldArray,
      {
        id: generateId(identifier),
        title: layerName,
        server: server,
        tipe: "wms",
        url: urlWMS,
        geom: "",
        layer: layerWMS,
        metadata: metadata,
        table: layerGeojson ? true : false,
        visible: true,
        opacity: 1,
      },
    ]);
    //setMapLayer(oldArray => [...oldArray, { id: 'xxxxx', title: 'test', server: 'esri', tipe: 'wms', url: 'https://services3.arcgis.com/q3g0HH9M99zRvCna/ArcGIS/rest/services/Area_Genangan/FeatureServer', geom:'', layer: 'AreaGenangan', metadata: true, table: false, visible: true, opacity: 1 }])
  }

  function generateId(identifier) {
    const randomSuffix = Math.floor(100 + Math.random() * 900); // Random 3-digit number
    return `${identifier}${randomSuffix}`;
  }

  function addAndKeep() {
    setMapLayer((oldArray) => [
      ...oldArray,
      {
        id: generateId(identifier),
        title: layerName,
        server: server,
        tipe: "wms",
        url: urlWMS,
        geom: "",
        layer: layerWMS,
        metadata: metadata,
        table: layerGeojson ? true : false,
        visible: true,
        opacity: 1,
      },
    ]);
  }

  const handleChangeOrganization = (event) => {
    setIdOrganization(event.target.value);
    setIdYear("All");
    setIdKeywords(0);

    setQuery("");
    if (event.target.value === "0") {
      load_years(idYear);
    } else {
      load_organizations(event.target.value);
    }
  };

  function load_organizations(id) {
    //console.log(data);

    //var result = data.filter(p => {
    //console.log(data);
    var result;
    if (id === 0) {
      result = dataAll;
    } else {
      result = dataAll.filter((p) => p.organizations.id === parseInt(id));
    }

    setData(result); //.slice(0, 10));
    setNumberData(result.length);

    if (result.length > 0) {
      setDataAktif(null, result.slice(0, 1)[0]);
    } else {
      emptyDataset();
    }
  }

  const handleChangeYear = (event) => {
    setIdYear(event.target.value);
    setIdKeywords(0);
    setQuery("");
    if (event.target.value === "All") {
      //console.log(data)
      //setData(dataAll);//.slice(0, 10));
      //setNumberData(dataAll.length);
      //setDataAktif(null, dataAll.slice(0, 1)[0])
      //var themes = dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
      //var organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
      load_organizations(idOrganization);
    } else {
      load_years(event.target.value);
    }
  };

  const handleChangeKeywords = (event) => {
    setIdKeywords(event.target.value);
    setQuery("");
    if (event.target.value === "All") {
      //console.log(data)
      //setData(dataAll);//.slice(0, 10));
      //setNumberData(dataAll.length);
      //setDataAktif(null, dataAll.slice(0, 1)[0])
      //var themes = dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
      //var organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
      load_years(idYear);
    } else {
      var raw = listKeywords.filter((x) => x.id === event.target.value);
      load_keywords(raw[0].name);
    }
  };
  function validateForm() {
    return true; // !loading && selectedFile && selectedFile.length > 0 && shapeFile && name;
  }

  function createData(id, title, modified) {
    return { id, title, modified };
  }

  function createAttr(id, name, type) {
    return { id, name, type };
  }

  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.common.white,
      border: "1px solid #ced4da",
      fontSize: 16,
      width: "auto",
      flexGrow: 1,
      padding: "5px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  }));

  useEffect(() => {
    if (dataAll) {
      setData(dataAll);
      setNumberData(dataAll.length);
      //console.log(dataAll)
      setDataAktif(null, dataAll?.slice(0, 1)[0]);
    }
  }, [dataAll]);

  useEffect(() => {
    //let mounted = true;
    let mounted2 = true;
    //let mounted3 = true;
    let mounted4 = true;
    let mounted5 = true;

    const requestOptions = {
      method: "GET",
    };
    //-180, -90, 180, 90
    //100.0248/-1.1223/103.8146/2.9191
    /*
    fetch(url_list_harvesting + bbox[0].toFixed(6) + "/" + bbox[1].toFixed(6) + "/" + bbox[2].toFixed(6) + "/" + bbox[3].toFixed(6), requestOptions).then(res => res.json()).then(data => {
       
        if (mounted) {
            //console.log(data.data)
            var result = data.data.sort((a, b) => (a.title > b.title) ? 1 : -1);
            setData(result);//.slice(0, 10));
            setDataAll(result);
            setNumberData(result.length);
            setDataAktif(null, result.slice(0, 1)[0])

        }
    })
    */

    fetch(url_list_organizations, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted2) {
          //console.log(data.data);
          var dataset = [{ id: 0, name: "All" }];
          data.data.forEach((element) => {
            dataset.push(element);
          });
          //console.log(dataset)
          setListOrganizations(dataset);
        }
      });

    fetch(url_list_year, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted4) {
          //console.log(data.data);
          var dataset = [{ year: "All" }];
          data.data.forEach((element) => {
            dataset.push(element);
          });
          //console.log(dataset)
          setListYears(dataset);
        }
      });

    fetch(url_list_keywords, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (mounted5) {
          //console.log(data.data);
          var dataset = [{ id: 0, name: "All" }];
          data.data.forEach((element) => {
            dataset.push(element);
          });
          //console.log(dataset)
          setListKeywords(dataset);
        }
      });

    return function cleanup() {
      //mounted = false;
      mounted2 = false;
      //mounted3 = false;
      mounted4 = false;
      mounted5 = false;
    };
  }, []);

  function getOrganizations() {
    if (typeof listOrganizations !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listOrganizations !== null) {
        if (listOrganizations.length > 0) {
          return listOrganizations.map((row, index) => {
            //console.log(row.id, index)

            return (
              <MenuItem key={index} value={row?.id}>
                {row?.name}
              </MenuItem>
            );
          });
        }
      } else {
        return <option></option>;
      }
    } else {
      return <option></option>;
    }
  }

  function getYears() {
    if (typeof listYears !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listYears !== null) {
        if (listYears.length > 0) {
          return listYears.map((row, index) => {
            //console.log(row.id, index)

            return (
              <MenuItem key={index} value={row?.year}>
                {row?.year}
              </MenuItem>
            );
          });
        }
      } else {
        return <option></option>;
      }
    } else {
      return <option></option>;
    }
  }

  function getKeywords() {
    if (typeof listKeywords !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (listKeywords !== null) {
        if (listKeywords.length > 0) {
          return listKeywords.map((row, index) => {
            //console.log(row.id, index)

            return (
              <MenuItem key={index} value={row?.id}>
                {row?.name}
              </MenuItem>
            );
          });
        }
      } else {
        return <option></option>;
      }
    } else {
      return <option></option>;
    }
  }

  function getRowsData() {
    if (typeof data !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (data !== null) {
        if (data.length > 0) {
          return data.map((row, index) => {
            //console.log(row);
            /*
                     if (index === 0)
                         return <Row key={index} className="mx-0 border-bottom bg-kuning font-11" onClick={(e) => setDataAktif(e, row)}><Col xs={8} className="px-1 breaking ">{row.title}</Col><Col xs={4} className="px-2">{row.publication_date}</Col></Row>
                     else
                         return <Row key={index} className="mx-0 border-bottom font-11" onClick={(e) => setDataAktif(e, row)}><Col xs={8} className="px-1 breaking">{row.title}</Col><Col xs={4} className="px-2">{row.publication_date}</Col></Row>
                     */
            ///cr = cr + 1
            //return <tr><td className="p-2">{cr}</td><td className="p-2">{row.name}</td><td className="p-2">{row.sj}</td><td className="p-2">{row.kategori}</td><td className="p-2">{row.katalog}</td><td className="p-2 pointer"> <FileEarmarkText size={14} onClick={() => showMetadata(row)} className="mr-2" /> {' '} {row.viewable === 'true' ? <Eye onClick={() => showView(row)} className="mr-2" size={14} /> : ""} {' '} {row.downloadable === 'true' ? <Download size={12}  onClick={() => showDownload(row)} /> : ""}  </td></tr>
            if (index === 0) {
              return (
                <TableRow
                  key={index}
                  className="bgKuning"
                  onClick={(e) => setDataAktif(e, row)}
                >
                  <TableCell>{row?.title}</TableCell>
                  <TableCell>{row?.date_publication}</TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow
                  key={row?.identifier}
                  className="data"
                  onClick={(e) => setDataAktif(e, row)}
                >
                  <TableCell>{row?.title}</TableCell>
                  <TableCell>
                    {row?.date_publication?.replace("T", " ")}
                  </TableCell>
                </TableRow>
              );
            }
          });
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function emptyDataset() {
    /*
    setIdentifier("");
    setTitle("");
    setAbstract("");
    setLayerName("");
    setType("");
    setUrlThumb(no_thumb);
    setSubjects("");
    setOrganization("");
    */
  }

  function load_years(val) {
    //console.log(data);

    //var result = data.filter(p => {
    //console.log(data);
    var organizations;

    if (idOrganization === 0) {
      organizations = dataAll;
    } else {
      organizations = dataAll.filter(
        (p) => p.organizations.id === parseInt(idOrganization)
      );
    }

    //var result = themes.filter(p => p.organizations.id === parseInt(id));
    var result;
    //console.log(organizations[0]);
    if (val === "All") {
      result = organizations;
    } else {
      //console.log(val)
      result = organizations.filter(
        (p) => parseInt(p.publication_date.substring(0, 4)) === val
      );
    }

    setData(result); //.slice(0, 10));
    setNumberData(result.length);

    if (result.length > 0) {
      setDataAktif(null, result.slice(0, 1)[0]);
    } else {
      emptyDataset();
    }
  }

  function load_keywords(val) {
    var organizations;
    var years;

    if (idOrganization === 0) {
      organizations = dataAll;
    } else {
      organizations = dataAll.filter(
        (p) => p.organizations.id === parseInt(idOrganization)
      );
    }

    if (idYear === "All") {
      years = organizations;
    } else {
      //onsole.log(val)
      years = organizations.filter(
        (p) => parseInt(p.publication_date.substring(0, 4)) === idYear
      );
    }

    //var result = themes.filter(p => p.organizations.id === parseInt(id));
    var result;
    // console.log(organizations[0]);
    if (val === "All") {
      result = years;
    } else {
      //console.log(val)
      result = years.filter((p) =>
        p.keywords.toLowerCase().includes(val.toLowerCase())
      );
    }

    setData(result); //.slice(0, 10));
    setNumberData(result.length);

    if (result.length > 0) {
      setDataAktif(null, result.slice(0, 1)[0]);
    } else {
      emptyDataset();
    }
  }

  function handleSearch(event) {
    setQuery(event.target.value);
    /*
    if (key.length < 2) {
        //console.log(data)
        //setData(dataAll);//.slice(0, 10));
        //setNumberData(dataAll.length);
        //setDataAktif(null, dataAll.slice(0, 1)[0])
        //var themes = dataAll.filter(p => p.keywords.toLowerCase().includes(idTheme.toLowerCase()));
        //var organizations = themes.filter(p => p.organizations.id === parseInt(idOrganization));
        //
        //var raw = listKeywords.filter(x => x.id ===idKeywords)
        //console.log(raw[0].name)
        //load_keywords(raw[0].name)
        //if (idKeywords === 0){
//
//           }
//         else{
 //           var raw = listKeywords.filter(x => x.id ===idKeywords)
   //         load_keywords(raw[0].name)
    //    }
        
        //load_keywords(raw[0].name)
    } else {
        //alert(key)

    }*/
  }
  function handleSearch2(key) {
    // console.log(key);

    /*
    if (key.length < 2) {
        //alert('cari')
        //setData(dataAll);
        //setNumberData(dataAll.length);
        alert('key: ' + key)
        var organizations;
        var years;
        var keywords;


        if (idOrganization === 0) {
            organizations = dataAll;
        } else {
            organizations = dataAll.filter(p => p.organizations.id === parseInt(idOrganization));
        }

        if (idYear === "All") {
            years = organizations;
        } else {
            //onsole.log(val)
            years = organizations.filter(p => parseInt(p.publication_date.substring(0, 4)) === idYear);
        }

        // console.log(organizations[0]);



        if (idKeywords === "All") {
            keywords = years;
        } else {
            var raw = listKeywords.filter(x => x.id === idKeywords)
            keywords = years.filter(p => p.keywords.toLowerCase().includes(raw[0].name.toLowerCase()));
        }

        var result = keywords;

        setData(result);//.slice(0, 10));
        setNumberData(result.length);
    } else {
    */
    if (key.length > 2) {
      var organizations;
      var years;
      var keywords;

      if (idOrganization === 0) {
        organizations = dataAll;
      } else {
        organizations = dataAll.filter(
          (p) => p.organizations.id === parseInt(idOrganization)
        );
      }

      if (idYear === "All") {
        years = organizations;
      } else {
        //onsole.log(val)
        years = organizations.filter(
          (p) => parseInt(p.publication_date.substring(0, 4)) === idYear
        );
      }

      // console.log(organizations[0]);
      if (idKeywords === "All") {
        keywords = years;
      } else {
        var raw = listKeywords.filter((x) => x.id === idKeywords);
        keywords = years.filter((p) =>
          p.keywords.toLowerCase().includes(raw[0].name.toLowerCase())
        );
      }

      var result = keywords;
      var resultQ = result.filter((p) =>
        p.title.toLowerCase().includes(key.toLowerCase())
      );

      setData(resultQ); //.slice(0, 10));
      setNumberData(resultQ.length);

      if (resultQ.length > 0) {
        setDataAktif(null, resultQ.slice(0, 1)[0]);
      } else {
        emptyDataset();
      }
    }
    setQuery(key);
  }

  function doSearch() {
    // console.log(key);
    var q = document.getElementById("q");

    var key = q.value;

    var organizations;
    var years;
    var keywords;

    if (idOrganization === 0) {
      organizations = dataAll;
    } else {
      organizations = dataAll.filter(
        (p) => p.organizations.id === parseInt(idOrganization)
      );
    }

    if (idYear === "All") {
      years = organizations;
    } else {
      //onsole.log(val)
      years = organizations.filter(
        (p) => parseInt(p.publication_date.substring(0, 4)) === idYear
      );
    }
    // console.log(organizations[0]);
    if (idKeywords === 0) {
      keywords = years;
    } else {
      var raw = listKeywords.filter((x) => x.id === idKeywords);
      keywords = years.filter((p) =>
        p.keywords.toLowerCase().includes(raw[0].name.toLowerCase())
      );
    }

    console.log(keywords);
    var result = keywords;
    var resultQ = result.filter((p) =>
      p.title.toLowerCase().includes(key.toLowerCase())
    );

    setData(resultQ); //.slice(0, 10));
    setNumberData(resultQ.length);

    if (resultQ.length > 0) {
      setDataAktif(null, resultQ.slice(0, 1)[0]);
    } else {
      emptyDataset();
    }
  }

  function load_aktif(row) {
    if (row) {
      console.log("INI ROW",row.keywords)
      setMetadata({
        title: row?.title,
        abstract: row?.abstract,
        identifier: row?.identifier,
        type: row?.type,
        organization: row?.organization,
        keywords: row?.keywords,
        links: row?.links,
        date_publication: row?.date_publication,
      });

      setIdentifier(row?.identifier);

      setLayerName(row?.title);
      //console.log(row);
      //console.log(row.links);
      // Split by comma
      const parts = row?.links.split(",");
      //[
      //  'my_workspace:RBI25K_TITIKKONTROLGEODESI_PT_25K',
      //  'None',
      //  'OGC:WMS',
      //  'http://localhost/geoserver/my_workspace/wms'
      //]
      var esri_wms = parts[2].includes("ESRI:ArcGIS:MapServer");
      var esri_image = parts[2].includes("ESRI:ArcGIS:ImageServer");
      var esri_feature = parts[2].includes("ESRI:ArcGIS:FeatureServer");
      var wms = parts[2].includes("OGC:WMS");
      var wfs = parts[2].includes("OGC:WFS");
      var link = parts[2].includes("WWW:LINK");

      var thumb;

      if (esri_wms > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(parts[3]);
        setLayerWMS("");
      } else if (esri_image > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(parts[3]);
        setLayerWMS("");
      } else if (esri_feature) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(parts[3]);
        setLayerWMS("");
      } else {
        if (wms) {
          thumb = parts[3] + "/reflect?layers=" + parts[0];
          setServer("geoserver");
          setUrlWMS(parts[3].replace("?", ""));
          setLayerWMS(parts[0]);
        }
      }

      setUrlThumb(thumb);
      setDataAttribute();
      if (esri_wms > 0) {
        load_info_attribute_esri(parts[3]);
      } else if (esri_image) {
        load_info_attribute_esri_image(parts[3]);
      } else if (esri_feature) {
        load_info_attribute_esri(parts[3]);
      } else {
        //console.log(wms)
        if (wms) {
          //console.log(wms[0].url.replace("wms", "wfs"))
          load_info_attribute(parts[3].replace("wms", "wfs"), parts[0]);
        }
      }

      //console.log(row.references);
      /*
      //var json_obj = JSON.parse(row.distributions);
      var json_obj = [];
      //OGC:WMS
      //OGC:WFS
      //WWW:LINK

      //console.log(json_obj);

      var esri_wms = json_obj.filter(
        (p) => p.protocol === "ESRI:ArcGIS:MapServer"
      );
      var esri_image = json_obj.filter(
        (p) => p.protocol === "ESRI:ArcGIS:ImageServer"
      );
      var esri_feature = json_obj.filter(
        (p) => p.protocol === "ESRI:ArcGIS:FeatureServer"
      );
      var wms = json_obj.filter((p) => p.protocol === "OGC:WMS");
      var wfs = json_obj.filter((p) => p.protocol === "OGC:WFS");
      var link = json_obj.filter((p) => p.protocol === "WWW:LINK");

      var thumb;
      //console.log(typeof (esri));
      //console.log(typeof (wms));
      console.log(wms);

      if (esri_wms.length > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = esri_wms[0].url + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(esri_wms[0].url);
        setLayerWMS("");
      } else if (esri_image.length > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = esri_image[0].url + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(esri_image[0].url);
        setLayerWMS("");
      } else if (esri_feature.length > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = esri_feature[0].url + "/info/thumbnail";
        setServer("esri");
        setUrlWMS(esri_feature[0].url);
        setLayerWMS("");
      } else {
        console.log(wms);
        if (wms.length > 0) {
          console.log(wms[0].url);
          thumb = wms[0].url + "/reflect?layers=" + wms[0].name;
          setServer("geoserver");
          setUrlWMS(wms[0].url.replace("?", ""));
          setLayerWMS(wms[0].name);
        }
      }

      setUrlThumb(thumb);
      setDataAttribute();
      if (esri_wms.length > 0) {
        load_info_attribute_esri(esri_wms[0].url);
      } else if (esri_image.length > 0) {
        load_info_attribute_esri_image(esri_image[0].url);
      } else if (esri_feature.length > 0) {
        load_info_attribute_esri(esri_feature[0].url);
      } else {
        //console.log(wms)
        if (wms.length > 0) {
          //console.log(wms[0].url.replace("wms", "wfs"))
          load_info_attribute(wms[0].url.replace("wms", "wfs"), wms[0].name);
        }
      }

      //var download_scheme = json_obj.filter(p => p.protocol === 'WWW:DOWNLOAD-1.0-http--download')
      //console.log(row.references.filter(p => p.scheme === 'WWW:LINK-1.0-http--link'));
      //console.log(row.references.filter(p => p.scheme === 'WWW:DOWNLOAD-1.0-http--download').filter(x => x.url.includes('wms?') && !x.url.includes('legend') && x.url.includes('png')));
      //WWW:DOWNLOAD-1.0-http--download

      //setUrlThumb(references[0].url);
      //var thumbs = download_scheme.filter(x => x.url.toLowerCase().includes('thumbs'));
      //setUrlThumb(Config.proxy_domain + url_domain)
      /*
        var original = download_scheme.filter(x => x.url.toLowerCase().includes('download'))
        var getmap = download_scheme.filter(x => x.url.toLowerCase().includes('getmap'));
        var jpeg = getmap.filter(x => x.url.toLowerCase().includes('jpeg'))
        var png = getmap.filter(x => x.url.toLowerCase().includes('png'))

        var getfeature = download_scheme.filter(x => x.url.toLowerCase().includes('getfeature'));

        var kml = download_scheme.filter(x => x.url.toLowerCase().includes('kml'));

        if (thumbs.length > 0) {
            setUrlThumb(Config.proxy_domain + thumbs[0].url);
        } else {

            if (png.length > 0) {
                var url_domain = png[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setUrlThumb(Config.proxy_domain + url_domain);
            } else if (jpeg.length) {
                setUrlThumb(Config.proxy_domain + jpeg[0].url);
            } else {
                setUrlThumb(no_thumb);
            }
        }

        var raw = original.filter(x => !x.url.toLowerCase().includes('kml'))
        console.log(raw)
        console.log(original)
        if (raw.length > 0) {
            //original dataset
            var url_domain = raw[0].url.replace("91.225.61.58", "landscapeportal.org");
            url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
            setLayerOriginal(url_domain);
        } else {
            setLayerOriginal("")
        }

        if (getmap.length > 0) {
            //jpeg

            if (jpeg.length > 0) {
                var url_domain = jpeg[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                var main = url_domain.split("?")[0]
                console.log(main)
                var layer = url_domain.split("?")[1].split("&");
                console.log(layer)
                var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                // console.log(id)
                setUrlWMS(main);
                setLayerWMS(unescape(id));
            } else if (png.length > 0) {
                var url_domain = png[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                var main = url_domain.split("?")[0]
                console.log(main)
                var layer = url_domain.split("?")[1].split("&");
                console.log(layer)
                var id = layer.filter(x => x.toLowerCase().includes('layers='))[0].replace("layers=", "")
                console.log(id)
                setUrlWMS(main);
                setLayerWMS(unescape(id));
            } else {
                setUrlWMS("");
                setLayerWMS("");
            }


            var pdf = getmap.filter(x => x.url.toLowerCase().includes('pdf'))
            if (pdf.length > 0) {
                var url_domain = pdf[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerPdf(url_domain);
            } else {
                setLayerPdf("")
            }
            //console.log(png)
        } else {
            setUrlWMS("");
            setLayerWMS("");
            setLayerPdf("")
        }

        setDataAttribute()

        if (getfeature.length > 0) {
            var shape = getfeature.filter(x => x.url.toLowerCase().includes('shape-zip'))
            if (shape.length > 0) {
                var url_domain = shape[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerSHP(url_domain)
            } else {
                setLayerSHP("")
            }
            var csv = getfeature.filter(x => x.url.toLowerCase().includes('csv'))
            if (csv.length > 0) {
                var url_domain = csv[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerCSV(url_domain)
            } else {
                setLayerCSV("")
            }
            var excel = getfeature.filter(x => x.url.toLowerCase().includes('excel'))
            if (excel.length > 0) {
                var url_domain = excel[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerExcel(url_domain)
            } else {
                setLayerExcel("")
            }

            var gml = getfeature.filter(x => x.url.toLowerCase().includes('gml2'))
            if (gml.length > 0) {
                var url_domain = gml[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerGML(url_domain)
            } else {
                setLayerGML("")
            }

            var geojson = getfeature.filter(x => x.url.toLowerCase().includes('json'))
            if (geojson.length > 0) {
                var url_domain = geojson[0].url.replace("91.225.61.58", "landscapeportal.org");
                url_domain = url_domain.replace("91.225.62.74", "landscapeportal.org");
                setLayerGeojson(url_domain)
                load_info_attribute(url_domain)
            } else {
                setLayerGeojson("")
            }
        } else {
            setLayerSHP("")
            setLayerCSV("")
            setLayerExcel("")
            setLayerGML("")
            setLayerGeojson("")
        }

        if (kml.length > 0) {
            setLayerKML(kml[0].url);
        } else {
            setLayerKML("");
        }
        */
    }
  }

  function viewSubject(subjects) {
    //console.log(subjects);
    return subjects;
    /*
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var list = [];
        s.forEach(function (x) {
          //console.log(x.keywords);
          x.keywords.forEach(function (y) {
            list.push(y);
          });
        });
        //console.log(s[0].keywords);
        //console.log(s[0].keywords.join(", "));
        //console.log(list)
        if (list) return list.join(", ");
        else return "";
      }
    }*/
  }

  function load_info_attribute_esri(url) {
    //console.log(url)
    //setDataAttribute()
    const requestOptions = {
      method: "GET",
    };
    var url_replace = url + "/0?f=pjson";
    fetch(url_replace, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.fields)
        setDataAttribute(data.fields);
      });
  }
  function load_info_attribute_esri_image(url) {
    const requestOptions = {
      method: "GET",
    };
    var url_replace = url + "?f=pjson";
    //https://geoservices.big.go.id/raster/rest/services/IMAGERY/CTSRT_2019_SUMUT1/ImageServer?f=pjson

    fetch(url_replace, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.fields)
        setDataAttribute(data.fields);
      });
  }

  function load_info_attribute(url, name) {
    //console.log(url)
    const requestOptions = {
      method: "GET",
    };
    //http://sumbarprov.ina-sdi.or.id:8080/geoserver/wfs?SERVICE=WfS&REQUEST=GetFeature&VERSION=2.0.0&typeName=ADMIN:administrasi_ar_250k_130020201203152021&featureID=1&outputFormat=application/json
    //var url_replace = url.replace("GetFeature", "DescribeFeatureType").replace("json", "application/json")
    var url_replace =
      url +
      "?SERVICE=WFS&REQUEST=DescribeFeatureType&VERSION=2.0.0&typeName=" +
      name +
      "&featureID=1&outputFormat=application/json";
    //http://landscapeportal.org/geoserver/wfs?typename=geonode%3Akenya_nyando_basin_landtenure1964&outputFormat=application/json&version=1.0.0&request=DescribeFeatureType&service=WFS
    //console.log(url_replace)
    //Config.proxy_domain
    fetch(url_replace, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          //console.log(data)
          //    console.log(data.featureTypes[0])
          //console.log(data.featureTypes[0].properties)
          setDataAttribute(data.featureTypes[0].properties);
        } else {
          setDataAttribute();
        }
      });
  }

  function getRowsAttribute() {
    if (typeof dataAttribute !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (dataAttribute !== null) {
        if (dataAttribute.length > 0) {
          return dataAttribute.map((row, index) => {
            //console.log(row)
            return (
              <TableRow key={"att" + index}>
                <TableCell></TableCell>
                <TableCell>{row?.name}</TableCell>
                <TableCell>{row?.type}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
            ///cr = cr + 1
            //return <tr><td className="p-2">{cr}</td><td className="p-2">{row.name}</td><td className="p-2">{row.sj}</td><td className="p-2">{row.kategori}</td><td className="p-2">{row.katalog}</td><td className="p-2 pointer"> <FileEarmarkText size={14} onClick={() => showMetadata(row)} className="mr-2" /> {' '} {row.viewable === 'true' ? <Eye onClick={() => showView(row)} className="mr-2" size={14} /> : ""} {' '} {row.downloadable === 'true' ? <Download size={12}  onClick={() => showDownload(row)} /> : ""}  </td></tr>
          });
        } else {
          return (
            <TableRow key={99}>
              <TableCell colSpan={4}>No attribute found</TableCell>
            </TableRow>
          );
        }
      } else {
        return (
          <TableRow key={99}>
            <TableCell colSpan={4}>No attribute found</TableCell>
          </TableRow>
        );
      }
    } else {
      return (
        <TableRow key={99}>
          <TableCell colSpan={4}>No attribute found</TableCell>
        </TableRow>
      );
    }
  }

  return (
    <DContainer id="dataContainer">
      <Card>
        <Box
          sx={{
            width: "100%",
            height: "90vh",
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
              Penjelajah Data Geospasial
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
            <Wrapper>
              <LeftContent>
                {/*
                <Filter>
                  <Title>Filtering</Title>
                  <FormContainer
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      minHeight: "35vh",
                    }}
                  >
                    <FormInput>
                      <Label>Study Area</Label>
                      <EntryMiddle>
                        <BootstrapInput
                          defaultValue={labelArea}
                          disabled
                          fullWidth
                        />
                      </EntryMiddle>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setSelectArea(true)}
                      >
                        Change
                      </Button>
                    </FormInput>
                    <FormInput>
                      <Label>Organization</Label>
                      <Entry>
                        <TextField
                          id="outlined-select-currency"
                          select
                          value={idOrganization}
                          onChange={handleChangeOrganization}
                          variant="outlined"
                          size="small"
                          fullWidth
                        >
                          {getOrganizations()}
                        </TextField>
                      </Entry>
                    </FormInput>
                    <FormInput>
                      <Label>Year</Label>
                      <Entry>
                        <TextField
                          id="outlined-select-currency"
                          select
                          value={idYear}
                          onChange={handleChangeYear}
                          variant="outlined"
                          size="small"
                          fullWidth
                        >
                          {getYears()}
                        </TextField>
                      </Entry>
                    </FormInput>
                    <FormInput>
                      <Label>Keywords</Label>
                      <Entry>
                        <TextField
                          id="outlined-select-currency"
                          select
                          value={idKeywords}
                          onChange={handleChangeKeywords}
                          variant="outlined"
                          size="small"
                          fullWidth
                        >
                          {getKeywords()}
                        </TextField>
                      </Entry>
                    </FormInput>
                    {/*
                                    <FormInput>
                                        <Label>Title Search (Any text)</Label>
                                        <Entry> 
                                                <BootstrapInput placeholder="type title" id="q" fullWidth autoComplete="off"  />
                                        </Entry>
                                    </FormInput>
                                    <FormInputRight>
                                        <Button variant="contained" color="primary" size="small"  onClick={doSearch}>Search</Button>
                                    </FormInputRight>
                                        /}
                  </FormContainer>
                </Filter>
                */}
                <AvailableDataset>
                  <Title>Available Dataset ({numberData})</Title>
                  <TableContainer
                    style={{ maxHeight: 250 }}
                    className="pointer"
                  >
                    <Table stickyHeader size="small" aria-label="a dense table">
                      <TableHead color="#ddd">
                        <TableRow key={999}>
                          <TableCell>Title</TableCell>
                          <TableCell>Publication Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getRowsData()}

                        {/*
                                            rows.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.title}</TableCell>
                                                <TableCell>{row.modified}</TableCell>
                                            </TableRow>
                                        ))
                                        */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AvailableDataset>
              </LeftContent>
              <RightContent>
                <Metadata>
                  <Description>
                    <Title>Metadata</Title>
                    <p style={{ margin: "0px 0px 5px 0px" }}>
                      Title: {metadata.title}
                    </p>
                    <p style={{ margin: "0px 0px 5px 0px" }}>
                      Type: {metadata.type}
                    </p>
                    <p style={{ margin: "0px 0px 5px 0px" }}>
                      Organization: {metadata.organization}{" "}
                    </p>
                    <p style={{ margin: "0px 0px 5px 0px" }}>
                      Keywords:
                      <br />
                      {
                        viewSubject(metadata.keywords)
                        //console.log(metadata)
                      }
                    </p>
                    {/*
                                    {
                                    whiteSpace: 'nowrap',
                                    width: '250px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                    }
                                    */}
                    <p
                      style={{
                        maxHeight: "80px",
                        overflowY: "auto",
                        margin: "0px 0px 5px 0px",
                      }}
                    >
                      Abstract:
                      <br />
                      {metadata.abstract}
                    </p>
                  </Description>
                  <Thumbnail>
                    <p style={{ fontWeight: "bold" }}>Map Preview</p>
                    <img
                      src={urlThumb}
                      alt="preview"
                      width="150"
                      height="80"
                      style={{ border: "1px solid #ccc" }}
                      onError={(e) => {
                        e.target.src = no_thumb;
                      }}
                    />
                  </Thumbnail>
                </Metadata>
                <Attribute>
                  <Title>Data Attribute ({dataAttribute?.length})</Title>
                  <TableContainer style={{ maxHeight: 240 }}>
                    <Table stickyHeader size="small" aria-label="a dense table">
                      <TableHead color="#ddd">
                        <TableRow key={999}>
                          <TableCell>#</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getRowsAttribute()}
                        {/*
                                            attr.map((att) => (
                                            <TableRow key={att.id}>
                                                <TableCell> </TableCell>
                                                <TableCell>{att.name}</TableCell>
                                                <TableCell>{att.type}</TableCell>
                                            </TableRow>
                                            ))
                                            */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Attribute>
              </RightContent>
            </Wrapper>
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
                  onClick={addAndKeep}
                  size="large"
                  variant="outlined"
                >
                  Tambahkan ke peta dan lanjutkan jelajah
                </CustomButton>
                <Box sx={{ width: "20px" }}></Box>
                <CustomButton
                  onClick={addAndGo}
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
