import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Avatar,
  Switch,
  CardHeader,
  MenuItem,
  Select,
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

import { retrieveByProdusen } from "src/redux/actions/dataPublikasi";
import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";

import DataDialog from "./DataDialog";

import environment from "src/config/environment";
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

function KategoriTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const initialConfig = {
    data: null,
    title: "Tambah Data Produsen Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.data_publikasi) || [];
  const { user: currentUser } = useSelector((state) => state.auth);
  const kategoriTematiks = useSelector((state) => state.kategoriTematik);
  const produsens = useSelector((state) => state.produsen);
  //const tematiks = useSelector((state) => state.tematik);

  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedProdusen, setSelectedProdusen] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
    //dispatch(retrieveByKategori(kategoriTematiks[0]?.uuid));

    //dispatch(retrieveAllData());
  }, []);

  useEffect(() => {
    if (kategoriTematiks.length > 0) {
      //console.log(kategoriTematiks);
      //console.log(kategoriTematiks[0].name);
      //var a = kategoriTematiks.filter(function (el) {
      //  return el.name == kategoriTematiks[0].name;
      //});
      setSelectedKategori(kategoriTematiks[0].name);
      dispatch(retrieveProdusenKategori(kategoriTematiks[0].uuid));
    }
  }, [kategoriTematiks]);

  useEffect(() => {
    if (produsens.length > 0) {
      console.log(produsens[0].name);
      console.log(selectedProdusen);
      setSelectedProdusen(produsens[0].name);
      //if (selectedProdusen != produsens[0].name) {
      //  setSelectedProdusen(produsens[0].name);
      // }
      //var b = produsens.filter(function (el) {
      //  return el.name == produsens[0].name;
      //});
      dispatch(retrieveByProdusen(produsens[0]?.uuid));
    }
  }, [produsens]);

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleKategoriChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }
    console.log(value);
    setSelectedKategori(value);
    var a = kategoriTematiks.filter(function (el) {
      return el.name == value;
    });
    dispatch(retrieveProdusenKategori(a[0].uuid));
    setSelectedProdusen("");
    //console.log(a[0].name);
    //setData({ ...data, ["kategoriTematik"]: a[0] });
  };

  const handleProdusenChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }
    console.log(value);
    setSelectedProdusen(value);
    var a = produsens.filter(function (el) {
      return el.name == value;
    });
    setSelectedProdusen(a[0].name);
    dispatch(retrieveByProdusen(a[0]?.uuid));
    //setSelectedProdusen(value);
    //console.log(a[0].name);
    //setData({ ...data, ["kategoriTematik"]: a[0] });
  };

  const handleClickPublish = (data) => {
    setConfig({
      data: data,
      title: "Process Publish Data",
      mode: "edit",
      action: "Process",
      description: "Silahkan klik untuk melakukan proses publikasi data",
    });
    setOpen(true);
  };
  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: "Edit Data Produsen",
      mode: "edit",
      action: "Save",
      description: "Silahkan edit form berikut untuk mengupdate Kategori.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete Kategori",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus Kategori?",
    });
    setOpen(true);
  };

  const handleClickPeriksa = (data) => {
    setConfig({
      data: data,
      title: "Periksa Data Produsen (" + data.dataProdusen.deskripsi + ")",
      mode: "periksa",
      action: "Save",
      description:
        "Silahkan isi form berikut untuk mengupdate status Data Produsen.",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel>Kategori Tematik</InputLabel>
              <Select
                value={selectedKategori}
                onChange={handleKategoriChange}
                label="Kategori Tematik"
                autoWidth
              >
                {kategoriTematiks.map((kategoriTematik) => (
                  <MenuItem
                    key={kategoriTematik.uuid}
                    value={kategoriTematik.name}
                  >
                    {kategoriTematik.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel>Produsen Data Geospasial</InputLabel>
              <Select
                value={selectedProdusen}
                onChange={handleProdusenChange}
                label="Produsen Data Geospasial"
                autoWidth
              >
                {produsens.map((prod) => (
                  <MenuItem key={prod.uuid} value={prod.name}>
                    {prod.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TableContainer>
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Kategori</TableCell>

                    <TableCell>Waktu Pemeriksaan</TableCell>
                    <TableCell>Waktu Publikasi</TableCell>
                    <TableCell>Geoserver</TableCell>

                    {/*
                    <TableCell align="center">Keterangan Referensi</TableCell>
                    <TableCell align="center">Metadata</TableCell>
                    <TableCell align="center">File</TableCell>
                    
                    <TableCell align="center">Status</TableCell>
                    */}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>
                          {data.dataPemeriksaan.dataProdusen?.tematik?.name}
                        </TableCell>

                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell>{data.dataPemeriksaan.kategori}</TableCell>

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
                            data.dataPemeriksaan.dataProdusen?.urlGeoserver !=
                            null ? (
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
                                  to={data.dataPemeriksaan.dataProdusen.urlGeoserver.replace(
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

                          {data.dataPemeriksaan.dataProdusen?.urlGeoserver ==
                          null ? (
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
                                component={RouterLink}
                                to={"unduh/" + data.uuid}
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
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <DataDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
