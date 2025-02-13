import {
  Backdrop,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import Draggable from "react-draggable";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { alpha, ThemeProvider, createTheme } from "@mui/material/styles";
import { makeStyles, withStyles } from "@mui/styles"; // This is now a separate package

import { get } from "ol/proj";

import * as turf from "@turf/turf";

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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
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

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Analysis({
  open,
  handleCloseAnalysis,
  mapLayer,
  setBuffered,
  visibleAnalysis,
  setVisibleAnalysis,
}) {
  const [value, setValue] = useState(0);
  const [idLayer, setIdLayer] = useState(0);
  const [buffer, setBuffer] = useState(500);
  const [bufferLayerName, setBufferLayerName] = useState("Buffer_Analysis");
  const [intersectLayerName, setIntersectLayerName] =
    useState("Intersect_Layer");

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    handleCloseAnalysis(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeSelect = (event) => {
    setIdLayer(event.target.value);
  };

  const handleChangeBuffer = (event) => {
    const newBuffer = event.target.value;
    setBuffer(newBuffer);
  };

  const handleChangeBufferLayerName = (event) => {
    setBufferLayerName(event.target.value);
  };

  const handleChangeIntersectLayerName = (event) => {
    setIntersectLayerName(event.target.value);
  };

  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
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
      // Use the system font instead of the default Roboto font.
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
  }))(InputBase);

  function getListVectorLayer() {
    if (mapLayer !== "undefined") {
      if (mapLayer.length > 0) {
        return mapLayer.map((row, index) => {
          //console.log(row)
          //console.log(row.id.includes('uploader'))
          //onChange={(e) => props.setLayerVisible(row.id)}
          if (row.geom !== "" && row.visible) {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <MenuItem key={index} value={row.id}>
                {row.title}
              </MenuItem>
            );
          }
        });
      } else {
        return (
          <MenuItem key={0} value={0}>
            No Vector Layer Found. Browse or Import first.
          </MenuItem>
        );
      }
    }
  }

  const handleProcess = () => {
    setOpenBackdrop(true);
    setTimeout(function () {
      setOpenBackdrop(false);
      //var buffered = turf.buffer(point, 500, {units: 'miles'});
      //console.log(idLayer)
      var vector = mapLayer.filter((item) => item.id === idLayer);
      //console.log(vector[0].layer)
      var buffered = turf.buffer(vector[0].layer, buffer, { units: "meters" });
      //console.log(buffered)
      setBuffered(buffered);
      setVisibleAnalysis(true);
    }, 2000);
  };

  const handleDelete = () => {
    setVisibleAnalysis(false);
  };

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={true}
      maxWidth="sm"
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
          <span>Analysis</span>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent style={{ minHeight: "40vh", padding: "0px" }}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="select and search area study"
            variant="fullWidth"
          >
            <Tab label="Buffer" {...a11yProps(0)} />
            <Tab label="Intersect" {...a11yProps(1)} disabled />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              minHeight: "30vh",
            }}
          >
            <FormInput>
              <Label>Vector Layer</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idLayer}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  {getListVectorLayer()}
                </TextField>
              </Entry>
            </FormInput>

            <FormInput>
              <Label>Buffer Distance</Label>
              <EntryMiddle>
                {
                  //<BootstrapInput id="buffer-distance" placeholder="" defaultValue={buffer} onChange={handleChangeBuffer} fullWidth />
                }
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  defaultValue={buffer}
                  onChange={handleChangeBuffer}
                  size="small"
                  fullWidth
                />
              </EntryMiddle>
              <Label>meter</Label>
            </FormInput>
            <FormInput>
              <Label>Buffer Layer Name</Label>
              <EntryMiddle>
                {
                  //<BootstrapInput id="buffer-layer-name" placeholder="" defaultValue={bufferLayerName} onChange={handleChangeBufferLayerName} fullWidth />
                }
                <TextField
                  id="buffer-layer-name"
                  variant="outlined"
                  defaultValue={bufferLayerName}
                  onChange={handleChangeBufferLayerName}
                  size="small"
                  fullWidth
                />
              </EntryMiddle>
            </FormInput>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="small"
              onClick={handleProcess}
              disabled={!(mapLayer.length > 0)}
            >
              Process Buffer
            </Button>
            {visibleAnalysis && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="small"
                onClick={handleDelete}
              >
                Delete Layer
              </Button>
            )}
          </div>
          <Backdrop className={classes.backdrop} open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              minHeight: "30vh",
            }}
          >
            <FormInput>
              <Label>Vector Layer 1</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idLayer}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    Batas Administrasi
                  </MenuItem>
                </TextField>
              </Entry>
            </FormInput>
            <FormInput>
              <Label>Vector Layer 2</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idLayer}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    Kawasan Hutan
                  </MenuItem>
                </TextField>
              </Entry>
            </FormInput>
            <FormInput>
              <Label>Intersect Layer Name</Label>
              <EntryMiddle>
                <BootstrapInput
                  placeholder=""
                  defaultValue={intersectLayerName}
                  onChange={handleChangeIntersectLayerName}
                  fullWidth
                />
              </EntryMiddle>
            </FormInput>
            <Button variant="contained" color="primary" fullWidth size="small">
              Process Intersect
            </Button>
          </div>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}

const FormInput = styled.div`
  margin: 0px;
  display: flex;
`;

const Label = styled.div`
  width: 150px;
`;
const Entry = styled.div`
  flex-grow: 1;
  display: flex;
`;

const EntryMiddle = styled.div`
  flex-grow: 1;
  padding-right: 10px;
`;
