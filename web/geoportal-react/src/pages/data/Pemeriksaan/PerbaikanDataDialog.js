import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";

import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormControl,
  InputLabel,
  Grid,
  Link,
  LinearProgress,
  MenuItem,
  Slide,
  Select,
  TextField,
  Typography,
  Card,
  ListItem,
  List,
  ListItemText,
  Divider,
  ListItemAvatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  CardContent,
} from "@mui/material";
import swal from "sweetalert";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { retrieveAllPemeriksaanUUID } from "src/redux/actions/dataPerbaikanProdusen";

import DataPeriksaDialog from "./DataPeriksaDialog";
import PerbaikanDialog from "./PerbaikanDialog";

import environment from "src/config/environment";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const theme = useTheme();

  const { onClose, open, config } = props;
  const [openPerbaikan, setOpenPerbaikan] = useState(false);
  const [openPeriksa, setOpenPeriksa] = useState(false);
  const datas = useSelector((state) => state.data_perbaikan_produsen);
  const { user: currentUser } = useSelector((state) => state.auth);
  const tematiks = useSelector((state) => state.tematik);

  const initialState = {
    data: null,
    title: "Upload Data Perbaikan Produsen Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Perbaikan Data Produsen baru.",
  };
  const [data, setData] = useState();

  const initialConfigPerbaikan = {
    data: null,
    title: "Upload Perbaikan Data Produsen",
    mode: "perbaikan",
    action: "Save",
    description: "Silahkan upload ulang Perbaikan Data Produsen.",
  };

  const [state, setState] = useState(initialState);
  const [configPerbaikan, setConfigPerbaikan] = useState(
    initialConfigPerbaikan
  );
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  //useEffect(() => {
  //  dispatch(retrieveAll());
  //}, []);

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        //console.log(config.data);
        //setData(config.data);
        setConfigPerbaikan({ ...configPerbaikan, ["data"]: config.data });
        dispatch(retrieveAllPemeriksaanUUID(config.data.uuid));
      } else {
        setData(initialState);
      }
    }
  }, [config]);
  const handleClose = () => {
    onClose();
  };

  const handleClickPeriksa = (data) => {
    setState({
      data: data,
      title: "Periksa Data Perbaikan Produsen",
      mode: "periksa",
      action: "Save",
      description:
        "Silahkan isi form berikut untuk mengupdate status Data Produsen.",
    });
    setOpenPeriksa(true);
  };
  const handleClickPerbaikan = () => {
    console.log(config);
    setConfigPerbaikan({
      data: null,
      title: "Perbaikan Data Produsen",
      mode: "perbaikan",
      action: "Save",
      description: "Silahkan upload ulang Perbaikan Data Produsen.",
    });
    setOpenPerbaikan(true);
  };

  const handleClosePeriksa = () => {
    setOpenPeriksa(false);
  };
  const handleClosePerbaikan = () => {
    setOpenPerbaikan(false);
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth
      scroll="paper"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>{config.title}</DialogTitle>

      <DialogContent>
        <Grid container justifyContent="end" alignItems="center" sx={{ mb: 2 }}>
          {currentUser.roles.includes("ROLE_ADMIN") ||
          currentUser.roles.includes("ROLE_PRODUSEN") ? (
            <Grid item>
              <Tooltip
                placement="top"
                title="Upload Perbaikan Data Produsen"
                arrow
              >
                <Button
                  sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                  variant="outlined"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                  onClick={handleClickPerbaikan}
                >
                  Upload Perbaikan Data Produsen
                </Button>
              </Tooltip>
              {/*
                <Tooltip title="Reload" arrow>
                  <IconButton>
                    <RefreshIcon color="inherit" sx={{ display: "block" }} />
                  </IconButton>
                </Tooltip>
                */}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
        <Divider />
        <TableContainer>
          <Table width={300}>
            <TableHead>
              <TableRow>
                <TableCell>Waktu Upload</TableCell>
                <TableCell align="center">Keterangan Referensi</TableCell>
                <TableCell align="center">Metadata</TableCell>
                <TableCell align="center">File</TableCell>
                <TableCell align="center">Status</TableCell>
                {currentUser.roles.includes("ROLE_ADMIN") ||
                currentUser.roles.includes("ROLE_WALIDATA") ||
                currentUser.roles.includes("ROLE_PRODUSEN") ? (
                  <TableCell align="center">Dokumen QA</TableCell>
                ) : (
                  ""
                )}
                {currentUser.roles.includes("ROLE_ADMIN") ||
                currentUser.roles.includes("ROLE_WALIDATA") ? (
                  <TableCell align="center">Actions</TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.length == 0 ? (
                <TableRow key={0}>
                  <TableCell colSpan={9}>Data tidak ditemukan</TableCell>
                </TableRow>
              ) : null}
              {datas &&
                datas.map((data) => (
                  <TableRow key={data.id} hover>
                    <TableCell>
                      {format(
                        parseISO(data.createdAt),
                        "dd MMMM, yyyy - h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip placement="top" title="Unduh Dokumen" arrow>
                        <IconButton
                          sx={{
                            "&:hover": {
                              background: theme.colors.error.lighter,
                            },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          component={RouterLink}
                          to={
                            environment.api +
                            "/data-perbaikan-produsen/unduhReferensi/" +
                            data.uuid
                          }
                          //onClick={() => handleClickDelete(data)}
                        >
                          <DownloadTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip placement="top" title="Unduh Metadata" arrow>
                        <IconButton
                          sx={{
                            "&:hover": {
                              background: theme.colors.error.lighter,
                            },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          component={RouterLink}
                          to={
                            environment.api +
                            "/data-perbaikan-produsen/unduhMetadata/" +
                            data.uuid
                          }
                          //onClick={() => handleClickDelete(data)}
                        >
                          <DownloadTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip placement="top" title="Unduh File" arrow>
                        <IconButton
                          sx={{
                            "&:hover": {
                              background: theme.colors.error.lighter,
                            },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          component={RouterLink}
                          to={
                            environment.api +
                            "/data-perbaikan-produsen/unduhFile/" +
                            data.uuid
                          }
                          //onClick={() => handleClickDelete(data)}
                        >
                          <DownloadTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{data.statusPemeriksaan.name}</TableCell>
                    {(currentUser.roles.includes("ROLE_ADMIN") ||
                      currentUser.roles.includes("ROLE_WALIDATA") ||
                      currentUser.roles.includes("ROLE_PRODUSEN")) &&
                    data.statusPemeriksaan.id > 1 ? (
                      <TableCell align="center">
                        <Tooltip placement="top" title="Unduh QA" arrow>
                          <IconButton
                            sx={{
                              "&:hover": {
                                background: theme.colors.error.lighter,
                              },
                              color: theme.palette.error.main,
                            }}
                            color="inherit"
                            size="small"
                            component={RouterLink}
                            to={
                              environment.api +
                              "/data-perbaikan-produsen/unduhQA/" +
                              data.uuid
                            }
                            //onClick={() => handleClickDelete(data)}
                          >
                            <DownloadTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell align="center">
                      {currentUser.roles.includes("ROLE_ADMIN") ||
                      currentUser.roles.includes("ROLE_WALIDATA") ? (
                        data.statusPemeriksaan.id == 1 ? (
                          <Tooltip
                            placement="top"
                            title="Periksa Data Perbaikan Produsen"
                            arrow
                          >
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.error.lighter,
                                },
                                color: theme.palette.error.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickPeriksa(data)}
                            >
                              <FactCheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : data.statusPemeriksaan.id == 2 ? (
                          "Belum OK"
                        ) : (
                          "OK"
                        )
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <DataPeriksaDialog
          open={openPeriksa}
          onClose={handleClosePeriksa}
          config={state}
        />
        <PerbaikanDialog
          open={openPerbaikan}
          onClose={handleClosePerbaikan}
          config={configPerbaikan}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

KategoriDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default KategoriDialog;
