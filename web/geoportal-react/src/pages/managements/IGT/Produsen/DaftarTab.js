import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  FormControl,
  InputLabel,
  ListItemAvatar,
  Avatar,
  Switch,
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
import { NavLink as RouterLink } from "react-router-dom";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import AutoModeTwoToneIcon from "@mui/icons-material/AutoModeTwoTone";

import { format, subHours, subWeeks, subDays } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import MapIcon from "@mui/icons-material/MapTwoTone";

import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";

import DaftarDialog from "./DaftarDialog";

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

function LokasiTab() {
  const theme = useTheme();
  const kategoris = useSelector((state) => state.kategoriTematik);

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [listKategori, setListKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(
    "Pilih Kategori Bidang IGT"
  );
  const initialConfig = {
    data: null,
    kategori: null,
    title: "Tambah Produsen Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.produsen);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [kategori, setKategori] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
    //dispatch(retrieve);
    dispatch(retrieveProdusenKategori("0"));
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
      setKategori(kategoris[0]);
      setConfig({ ...config, ["kategori"]: kategoris[0] });
      //setSelectedProvinsi(provinsis[0].name);
      //setData({ ...data, ["province"]: provinsis[0] });
      //dispatch(retrieveRegionProvinsi(provinsis[0].uuid));

      //dispatch(retrieveByKategori(kategoriTematiks[0].uuid));
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

      setConfig({ ...config, ["kategori"]: a[0] });
      setKategori(a[0]);
      dispatch(retrieveProdusenKategori(a[0].uuid));
    } else {
      setSelectedKategori(value);
      setConfig({ ...config, ["kategori"]: null });
      setKategori(null);
      dispatch(retrieveProdusenKategori("0"));
    }
  };

  const handleClickAdd = () => {
    setConfig({
      data: null,
      kategori: kategori,
      title: "Tambah Produsen Baru",
      mode: "add",
      action: "Submit",
      description: "Silahkan isi form berikut untuk menambahkan Produsen baru.",
    });
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: "Edit Produsen",
      mode: "edit",
      action: "Save",
      description: "Silahkan edit form berikut untuk mengupdate Produsen.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete Produsen",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus Lokasi?",
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
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Filter Kategori Tematik
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              {currentUser.roles.includes("ROLE_ADMIN") &&
              selectedKategori != "Pilih Kategori Bidang IGT" ? (
                <Grid item>
                  <Tooltip placement="top" title="Create Produsen" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create Produsen
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Akronim</TableCell>
                    <TableCell>Kategori Tematik</TableCell>

                    {currentUser.roles.includes("ROLE_ADMIN") ? (
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
                        {selectedKategori == "Pilih Kategori Bidang IGT"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((lokasi) => (
                      <TableRow key={lokasi.uuid} hover>
                        <TableCell>{lokasi.name}</TableCell>
                        <TableCell>{lokasi.akronim}</TableCell>
                        <TableCell>{lokasi.kategoriTematik?.name}</TableCell>

                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <Tooltip title="Edit Produsen" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleClickEdit(lokasi)}
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              placement="top"
                              title="Delete Produsen"
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
                                onClick={() => handleClickDelete(lokasi)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        ) : (
                          ""
                        )}
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
          <DaftarDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default LokasiTab;
