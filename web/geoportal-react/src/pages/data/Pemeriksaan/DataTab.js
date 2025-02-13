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
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";
//import { retrieveAllProdusen } from "src/redux/actions/dataProdusen";
import {
  retrieveAllProdusen,
  retrieveAllProdusenUser,
} from "src/redux/actions/dataPemeriksaan";
import DataDialog from "./DataDialog";
import PerbaikanDataDialog from "./PerbaikanDataDialog";
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
  const [openPerbaikan, setOpenPerbaikan] = useState(false);
  const [openPerbaikanData, setOpenPerbaikanData] = useState(false);

  const initialConfig = {
    data: null,
    produsen: null,
    title: "Tambah Data Produsen Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };

  const initialConfigPerbaikanData = {
    data: null,
    title: "Perbaikan Data Produsen",
  };
  const [config, setConfig] = useState(initialConfig);

  const [configPerbaikanData, setConfigPerbaikanData] = useState(
    initialConfigPerbaikanData
  );

  const datas = useSelector((state) => state.data_pemeriksaan);
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
    if (
      currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA")
    ) {
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

  const handleClickPerbaikanData = (data) => {
    console.log(data);
    setConfigPerbaikanData({
      data: data,
      title:
        "Perbaikan Data Produsen " +
        data.dataProdusen.tematik.name +
        " (" +
        data.dataProdusen.deskripsi +
        ")",
    });
    setOpenPerbaikanData(true);
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

  const handleClosePerbaikanData = () => {
    setOpenPerbaikanData(false);
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
      {currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA") ? (
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
            <TableContainer>
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
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
                    currentUser.roles.includes("ROLE_WALIDATA") ||
                    currentUser.roles.includes("ROLE_PRODUSEN") ? (
                      <TableCell align="center">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {currentUser.roles.includes("ROLE_ADMIN") ||
                        currentUser.roles.includes("ROLE_WALIDATA")
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
                        <TableCell>
                          {data.dataProdusen?.tematik?.name}
                        </TableCell>
                        <TableCell>{data.dataProdusen?.deskripsi}</TableCell>

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
                                data.dataProdusen.uuid
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
                                "/data-produsen/unduhMetadata/" +
                                data.dataProdusen.uuid
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
                                "/data-produsen/unduhFile/" +
                                data.dataProdusen.uuid
                              }
                              //onClick={() => handleClickDelete(data)}
                            >
                              <DownloadTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{data.statusPemeriksaan.name}</TableCell>
                        <TableCell align="center">
                          {(currentUser.roles.includes("ROLE_ADMIN") ||
                            currentUser.roles.includes("ROLE_WALIDATA") ||
                            currentUser.roles.includes("ROLE_PRODUSEN")) &&
                          data.statusPemeriksaan.id > 1 ? (
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
                                  "/data-pemeriksaan/unduhFile/" +
                                  data.uuid
                                }
                                //onClick={() => handleClickDelete(data)}
                              >
                                <DownloadTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {/*
                          
                          {data.statusPemeriksaan.id == 2 &&
                          currentUser.roles.includes("ROLE_PRODUSEN") ? (
                            <Tooltip
                              placement="top"
                              title="Upload Perbaikan"
                              arrow
                            >
                              <Button
                                sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                                variant="outlined"
                                startIcon={<EditTwoToneIcon fontSize="small" />}
                                onClick={() => handleClickPerbaikan(data)}
                              >
                                Upload Perbaikan
                              </Button>
                            </Tooltip>
                          ) : (
                            ""
                          )}
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
                          {data.statusPemeriksaan.id == 1 ? (
                            currentUser.roles.includes("ROLE_ADMIN") ||
                            currentUser.roles.includes("ROLE_WALIDATA") ? (
                              <Tooltip
                                placement="top"
                                title="Periksa Data Produsen"
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
                            ) : (
                              ""
                            )
                          ) : data.statusPemeriksaan.id == 2 ? (
                            <Tooltip
                              placement="top"
                              title="Lihat Data Perbaikan"
                              arrow
                            >
                              <Button
                                sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                                variant="outlined"
                                onClick={() => handleClickPerbaikanData(data)}
                              >
                                Data Perbaikan
                              </Button>
                            </Tooltip>
                          ) : (
                            "OK"
                          )}
                          {/*currentUser.roles.includes("ROLE_ADMIN") ||
                          currentUser.roles.includes("ROLE_WALIDATA") ? (
                            <Tooltip
                              placement="top"
                              title="Periksa Data Produsen"
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
                            
                          ) : (
                            ""
                          )*/}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <DataDialog open={open} onClose={handleClose} config={config} />
          <PerbaikanDataDialog
            open={openPerbaikanData}
            onClose={handleClosePerbaikanData}
            config={configPerbaikanData}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
