import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  Avatar,
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
  TextField,
  useTheme,
  styled,
  CardContent,
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import MapIcon from "@mui/icons-material/MapTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import PublicTwoToneIcon from "@mui/icons-material/PublicTwoTone";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import UnpublishedIcon from "@mui/icons-material/Unpublished";

import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";
import {
  retrieveByProdusen,
  retrieveByProdusenAdmin,
  cariIGT,
} from "src/redux/actions/dataPublikasi";
import UserDialog from "./DataDialog";
import EditDialog from "./EditDialog";

import environment from "src/config/environment";
import { unduh } from "src/redux/actions/dataEksternal";
import swal from "sweetalert";

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function UserTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [cari, setCari] = useState("");

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const initialConfig = {
    data: null,
    produsen: null,
    title: "Tambah Tematik Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan Tematik baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const [configEdit, setConfigEdit] = useState(initialConfig);
  const datas = useSelector((state) => state.data_publikasi);

  const { user: currentUser } = useSelector((state) => state.auth);
  //const produsens = useSelector((state) => state.produsen);
  const kategoris = useSelector((state) => state.kategoriTematik);

  const [listKategori, setListKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(
    "Pilih Kategori Bidang IGT"
  );
  const [listProdusen, setListProdusen] = useState([]);
  const [selectedProdusen, setSelectedProdusen] = useState(
    "Pilih Produsen Data Geospasial"
  );
  const [produsen, setProdusen] = useState();

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCari(value);
  };

  const handleClickPublish = (data) => {
    setConfig({
      data: data,
      title:
        "Process Publish Data " +
        data.tematik?.name +
        " (" +
        data.deskripsi +
        ")",
      mode: "edit",
      action: "Process",
      description: "Silahkan klik untuk melakukan proses publikasi data",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title:
        "Hapus Publish Data " +
        data.tematik?.name +
        " (" +
        data.deskripsi +
        ") ?",
      mode: "delete",
      action: "Delete",
      description: "Silahkan klik untuk melakukan proses delete data",
    });
    setOpen(true);
  };
  const handleEdit = (data) => {
    setConfigEdit({
      data: data,
      title:
        "Deactivate Data Publikasi " +
        data.tematik?.name +
        " (" +
        data.deskripsi +
        ")",
      mode: "edit",
      action: "Deactivate",
      description: "Silahkan klik untuk melakukan deactivate data",
    });
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleUnduh = (data) => {
    if (
      currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA")
    ) {
      dispatch(retrieveByProdusenAdmin("0"));
    } else {
      dispatch(retrieveByProdusen("0"));
    }
    window.location.href = "publikasi/unduh/" + data.uuid;
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pencarian = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(cariIGT(cari))
      .then((response) => {
        console.log(response);
        setLoading(false);
        setIsOpen(true);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        //console.log(e);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3} sx={{ alignItems: "center" }}>
              <Grid item lg={4} md={6} xs={8}>
                <TextField
                  helperText=""
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Cari IGT"
                  name="name"
                  value={cari}
                  onChange={handleInputChange}
                  autoComplete="name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={2}>
                <Button onClick={pencarian} variant="contained">
                  Cari
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell align="center">Kategori</TableCell>
                    {currentUser.roles.includes("ROLE_PRODUSEN") ? (
                      <TableCell align="center">Dokumen QA</TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell align="center">Klasifikasi Data</TableCell>
                    <TableCell align="center">Status Data</TableCell>
                    <TableCell>Waktu Pemeriksaan</TableCell>
                    <TableCell>Waktu Publikasi</TableCell>
                    <TableCell>Geoserver</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {!isOpen
                          ? "Ketikkan kata kunci untuk melakukan pencarian"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    Array.isArray(datas) &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.tematik?.name}</TableCell>
                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell align="center">
                          {data.dataPemeriksaan?.dataPerbaikanProdusen.length >
                          0
                            ? data.dataPemeriksaan?.dataPerbaikanProdusen[
                                data.dataPemeriksaan?.dataPerbaikanProdusen
                                  .length - 1
                              ].kategori
                            : data.dataPemeriksaan?.kategori}
                        </TableCell>
                        {currentUser.roles.includes("ROLE_PRODUSEN") ? (
                          <TableCell align="center">
                            <Tooltip
                              placement="top"
                              title="Unduh Dokumen"
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
                                component={RouterLink}
                                to={
                                  data.dataPemeriksaan?.dataPerbaikanProdusen
                                    .length > 0
                                    ? environment.api +
                                      "/data-perbaikan-produsen/unduhQA/" +
                                      data.dataPemeriksaan
                                        ?.dataPerbaikanProdusen[
                                        data.dataPemeriksaan
                                          ?.dataPerbaikanProdusen.length - 1
                                      ].uuid
                                    : environment.api +
                                      "/data-pemeriksaan/unduhFile/" +
                                      data.dataPemeriksaan?.uuid
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
                          {data.tematik?.is_series ? "Series" : "Tidak Series"}
                        </TableCell>

                        <TableCell align="center">
                          {data.is_active ? "Aktif" : "Tidak Aktif"}
                        </TableCell>
                        <TableCell>
                          {format(
                            parseISO(data.createdAt),
                            "dd MMMM, yyyy - h:mm:ss a"
                          )}
                        </TableCell>
                        <TableCell>
                          {data.waktuPublish
                            ? format(
                                parseISO(data.waktuPublish),
                                "dd MMMM, yyyy - h:mm:ss a"
                              )
                            : ""}
                        </TableCell>
                        <TableCell align="center">
                          {data.waktuPublish ? (
                            data.urlGeoserver != null ? (
                              <Tooltip title="View Geoserver" arrow>
                                <IconButton
                                  sx={{
                                    "&:hover": {
                                      background: theme.colors.primary.lighter,
                                    },
                                    color: theme.palette.primary.main,
                                  }}
                                  color="inherit"
                                  size="small"
                                  component={RouterLink}
                                  to={data.urlGeoserver.replace(
                                    environment.geoserverLocal,
                                    environment.api + "/"
                                  )}
                                  target="_blank"
                                >
                                  <MapIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <SyncIcon />
                            )
                          ) : (
                            ""
                          )}
                        </TableCell>
                        {/*
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
                            //onClick={() => handleClickDelete(data)}
                          >
                            <DownloadTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      */}
                        <TableCell align="right">
                          {/*
                          <Tooltip title="Edit Kategori" arrow>
                            <IconButton
                              sx={{
                                "&:hover": {
                                  background: theme.colors.primary.lighter,
                                },
                                color: theme.palette.primary.main,
                              }}
                              color="inherit"
                              size="small"
                              onClick={() => handleClickEdit(kategori)}
                            >
                              <EditTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                            */}

                          {data.urlGeoserver == null || !data.is_active ? (
                            ""
                          ) : (
                            <Tooltip
                              placement="top"
                              title="Unduh Data Publikasi"
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
                                //component={RouterLink}
                                //to={"unduh/" + data.uuid}
                                onClick={() => handleUnduh(data)}
                              >
                                <DownloadTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {!data.is_published &&
                          (currentUser.roles.includes("ROLE_ADMIN") ||
                            currentUser.roles.includes("ROLE_WALIDATA")) ? (
                            <Tooltip placement="top" title="Publish Data" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleClickPublish(data)}
                              >
                                <PublicTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          {data.is_published &&
                          data.is_active &&
                          (currentUser.roles.includes("ROLE_ADMIN") ||
                            currentUser.roles.includes("ROLE_WALIDATA")) ? (
                            <Tooltip
                              placement="top"
                              title="Deactivate Data"
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
                                onClick={() => handleEdit(data)}
                              >
                                <UnpublishedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          {data.is_published &&
                          currentUser.roles.includes("ROLE_ADMIN") ? (
                            <Tooltip
                              placement="top"
                              title="Delete Data Publikasi"
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
                                onClick={() => handleClickDelete(data)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/*
            <Box p={2}>
              <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
            */}
          </CardContent>

          <UserDialog open={open} onClose={handleClose} config={config} />
          <EditDialog
            open={openEdit}
            onClose={handleCloseEdit}
            config={configEdit}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;
