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
} from "src/redux/actions/dataPublikasi";
import UserDialog from "./DataDialog";
import EditDialog from "./EditDialog";

import environment from "src/config/environment";
import { unduh } from "src/redux/actions/dataEksternal";

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

  useEffect(() => {
    dispatch(retrieve());
    dispatch(retrieveProdusenKategori("0"));
    if (
      currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA")
    ) {
      dispatch(retrieveByProdusenAdmin("0"));
    } else {
      dispatch(retrieveByProdusen("0"));
    }
    var list = [];
    list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
    setListProdusen(list);
  }, []);
  /*
  useEffect(() => {
    if (produsens.length > 0) {
      //console.log(kategoriTematiks);
      //console.log(kategoriTematiks[0].name);
      //var a = kategoriTematiks.filter(function (el) {
      //  return el.name == kategoriTematiks[0].name;
      //});
      var list = [];
      list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
      produsens.map((data) => {
        list.push(data);
      });
      setListProdusen(list);
      setProdusen(produsens[0]);
      setConfig({ ...config, ["produsen"]: produsens[0] });
      //setSelectedProvinsi(provinsis[0].name);
      //setData({ ...data, ["province"]: provinsis[0] });
      //dispatch(retrieveRegionProvinsi(provinsis[0].uuid));

      //dispatch(retrieveByKategori(kategoriTematiks[0].uuid));
    }
  }, [produsens]);
  */
  useEffect(() => {
    if (kategoris.length > 0) {
      //console.log(kategoriTematiks);
      //console.log(kategoriTematiks[0].name);
      //var a = kategoriTematiks.filter(function (el) {
      //  return el.name == kategoriTematiks[0].name;
      //});
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
          if (
            currentUser.roles.includes("ROLE_ADMIN") ||
            currentUser.roles.includes("ROLE_WALIDATA")
          ) {
            dispatch(retrieveByProdusenAdmin("0"));
          } else {
            dispatch(retrieveByProdusen("0"));
          }
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

      if (
        currentUser.roles.includes("ROLE_ADMIN") ||
        currentUser.roles.includes("ROLE_WALIDATA")
      ) {
        dispatch(retrieveByProdusenAdmin("0"));
      } else {
        dispatch(retrieveByProdusen("0"));
      }
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
      if (
        currentUser.roles.includes("ROLE_ADMIN") ||
        currentUser.roles.includes("ROLE_WALIDATA")
      ) {
        dispatch(retrieveByProdusenAdmin(a[0].uuid));
      } else {
        dispatch(retrieveByProdusen(a[0].uuid));
      }
    } else {
      setSelectedProdusen(value);
      setConfig({ ...config, ["produsen"]: null });
      setProdusen(null);
      if (
        currentUser.roles.includes("ROLE_ADMIN") ||
        currentUser.roles.includes("ROLE_WALIDATA")
      ) {
        dispatch(retrieveByProdusenAdmin("0"));
      } else {
        dispatch(retrieveByProdusen("0"));
      }
    }
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

  return (
    <Grid container spacing={3}>
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
                        {selectedProdusen == "Pilih Produsen Data Geospasial"
                          ? "Filter belum dipilih"
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
                          {data.dataPemeriksaan?.dataPerbaikanProdusen?.length >
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
                          {/*data.is_published &&
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
                          )*/}
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
