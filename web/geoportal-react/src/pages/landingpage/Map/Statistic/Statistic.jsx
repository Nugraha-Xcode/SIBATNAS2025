import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import Draggable from "react-draggable";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from "@material-ui/core/styles";

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

export default function Statistic({
  open,
  handleCloseStatistic,
  visibleStatistic,
  setVisibleStatistic,
}) {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [idCountry, setIdCountry] = useState(1);
  const [joinLayerName, setJoinLayerName] = useState("Join_Layer");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleCloseBackDrop = () => {
    setOpenBackdrop(false);
  };

  const handleProcess = () => {
    setOpenBackdrop(true);
    setTimeout(function () {
      setOpenBackdrop(false);
      setVisibleStatistic(true);
    }, 7000);
  };

  const handleDelete = () => {
    setVisibleStatistic(false);
  };

  const handleClose = () => {
    handleCloseStatistic(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeSelect = (event) => {
    setIdCountry(event.target.value);
  };

  const handleChangeJoinLayerName = (event) => {
    setJoinLayerName(event.target.value);
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
          <span>Statistic</span>
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
            <Tab label="Join Table" {...a11yProps(0)} />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <FormControl
            fullWidth
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              minHeight: "45vh",
            }}
          >
            <FormInput>
              <Label>Statistik Data</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idCountry}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    Akses pada layanan air minum
                  </MenuItem>
                </TextField>
              </Entry>
              {
                //Entry
                /*
                                <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                        >
                                            Add Data
                                        </Button>
                                        */
              }
            </FormInput>

            <FormInput>
              <Label>Field JOIN Table</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idCountry}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    kode_provinsi
                  </MenuItem>
                </TextField>
              </Entry>
            </FormInput>
            <FormInput>
              <Label>Field Data Statistic</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idCountry}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    data_2019
                  </MenuItem>
                </TextField>
              </Entry>
            </FormInput>
            <FormInput>
              <Label>Classes (Equal Interval)</Label>
              <Entry>
                <TextField
                  id="outlined-select-currency"
                  select
                  value={idCountry}
                  onChange={handleChangeSelect}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem key={1} value={1}>
                    5
                  </MenuItem>
                </TextField>
              </Entry>
            </FormInput>

            <FormInput>
              <Label>Join Layer Name</Label>
              <Entry>
                {
                  //<BootstrapInput placeholder="" defaultValue={joinLayerName} onChange={handleChangeJoinLayerName} fullWidth />
                }
                <TextField
                  id="join-layer-name"
                  variant="outlined"
                  defaultValue={joinLayerName}
                  onChange={handleChangeJoinLayerName}
                  size="small"
                  fullWidth
                />
              </Entry>
            </FormInput>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="small"
              onClick={handleProcess}
            >
              Process Join Table
            </Button>
            {visibleStatistic && (
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
          </FormControl>
          <Backdrop className={classes.backdrop} open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
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
