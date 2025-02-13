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
  useTheme,
  styled,
  CardContent,
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";

import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";
import {
  retrieveAllProdusen,
  retrieveAllProdusenUser,
} from "src/redux/actions/dataProdusen";
import environment from "src/config/environment";

import DataDialog from "./DataDialog";

function KategoriTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const label = "Produsen";
  const initialConfig = {
    data: null,
    produsen: null,
    title: `Tambah Data ${label} baru`,
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.data_produsen);
  const { user: currentUser } = useSelector((state) => state.auth);
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

  useEffect(() => {
    //dispatch(retrieveAllData());
    //if (currentUser.roles.includes("ROLE_ADMIN")) {
    //  dispatch(retrieveAllData());
    //} else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
    //  dispatch(retrieveAllLocation(currentUser.uuid)); // per igt milik produsen
    //}
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveProdusenKategori("0"));
      dispatch(retrieveAllProdusen("0"));
      var list = [];
      list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
      setListProdusen(list);
    } else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
      dispatch(retrieveAllProdusenUser(currentUser.uuid));
    }
  }, []);

  useEffect(() => {
    if (kategoris.length > 0) {
      var list = [];
      list.push({ uuid: "0", name: "Pilih Kategori Bidang IGT" });
      kategoris.map((provinsi) => {
        list.push(provinsi);
      });
      setListKategori(list);
    }
  }, [kategoris]);

  const handleKategoriChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Kategori Bidang IGT") {
      setSelectedKategori(value);
      var a = kategoris.filter(function (el) {
        return el.name == value;
      });

      dispatch(retrieveProdusenKategori(a[0].uuid))
        .then((datas) => {
          var list = [];
          list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
          datas.map((data) => {
            list.push(data);
          });
          setListProdusen(list);
          setProdusen(list[1]);
          setConfig({ ...config, ["produsen"]: list[1] });
          setSelectedProdusen(list[0].name);
          dispatch(retrieveAllProdusen("0"));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setSelectedKategori(value);
      dispatch(retrieveProdusenKategori("0"));
      var list = [];
      list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
      setListProdusen(list);
      setProdusen(null);
      setConfig({ ...config, ["produsen"]: null });
      dispatch(retrieveAllProdusen("0"));
    }
  };

  const handleProdusenChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Produsen Data Geospasial") {
      setSelectedProdusen(value);
      var a = listProdusen.filter(function (el) {
        return el.name == value;
      });

      //setData({ ...data, ["province"]: a[0] });
      setConfig({ ...config, ["produsen"]: a[0] });
      setProdusen(a[0]);
      dispatch(retrieveAllProdusen(a[0].uuid));
    } else {
      setSelectedProdusen(value);
      setConfig({ ...config, ["produsen"]: null });
      setProdusen(null);
      dispatch(retrieveAllProdusen("0"));
    }
  };

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };
  /*
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

  const unduhRef = (data) => {
    dispatch(unduhReferensi(data))
      .then(() => {
        console.log("sukses unduh referensi");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unduhMeta = (uuid) => {
    dispatch(unduhMetadata(uuid))
      .then(() => {
        console.log("sukses unduh metadata");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unduhData = (uuid) => {
    dispatch(unduhFile(uuid))
      .then(() => {
        console.log("sukses unduh file");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  */
  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: `Delete Data ${label}`,
      mode: "delete",
      action: "Delete",
      description: `Anda yakin akan menghapus Data ${label}?`,
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
      {currentUser.roles.includes("ROLE_ADMIN") ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Filter
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={selectedKategori ?? ""}
                  onChange={handleKategoriChange}
                  label="Provinsi"
                  autoWidth
                >
                  {listKategori.length > 0 ? (
                    listKategori.map((provinsi) => (
                      <MenuItem key={provinsi.uuid} value={provinsi.name}>
                        {provinsi.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={0} value={"Pilih Kategori Bidang IGT"}>
                      {"Pilih Kategori Bidang IGT"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel>Produsen</InputLabel>
                <Select
                  value={selectedProdusen ?? ""}
                  onChange={handleProdusenChange}
                  label="Produsen"
                  autoWidth
                >
                  {listProdusen.length > 0 ? (
                    listProdusen.map((eksternal) => (
                      <MenuItem key={eksternal.uuid} value={eksternal.name}>
                        {eksternal.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={0} value={"Pilih Produsen Data Geospasial"}>
                      {"Pilih Produsen Data Geospasial"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              {currentUser.roles.includes("ROLE_ADMIN") ||
              currentUser.roles.includes("ROLE_PRODUSEN") ? (
                <Grid item>
                  <Tooltip placement="top" title="Tambah Data Produsen" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Tambah Data Produsen
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
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Klasifikasi Data</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Produsen DG</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Waktu Upload</TableCell>
                    <TableCell>Keterangan Referensi</TableCell>
                    <TableCell>Metadata</TableCell>
                    <TableCell>File</TableCell>
                    {currentUser.roles.includes("ROLE_ADMIN") ||
                    currentUser.roles.includes("ROLE_PRODUSEN") ? (
                      <TableCell align="right">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {currentUser.roles.includes("ROLE_ADMIN")
                          ? selectedProdusen == "Pilih Produsen Data Geospasial"
                            ? "Filter belum dipilih"
                            : "Data tidak ditemukan"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.tematik?.name}</TableCell>
                        <TableCell>
                          {data.tematik?.is_series ? "Series" : "Tidak Series"}
                        </TableCell>

                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell>{data.tematik?.produsen.name}</TableCell>
                        <TableCell>{data.user?.username}</TableCell>

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
                                "/data-produsen/unduhReferensi/" +
                                data.uuid
                              }
                              //onClick={() => unduhRef(data)}
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
                                "/data-produsen/unduhMetadata/" +
                                data.uuid
                              }
                              // onClick={() => unduhMeta(data.uuid)}
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
                                "/data-produsen/unduhFile/" +
                                data.uuid
                              }
                              //onClick={() => unduhData(data.uuid)}
                            >
                              <DownloadTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
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
                          {currentUser.roles.includes("ROLE_ADMIN") ||
                          currentUser.roles.includes("ROLE_PRODUSEN") ? (
                            <Tooltip
                              placement="top"
                              title="Delete Data Produsen"
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
          </CardContent>
          <DataDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
