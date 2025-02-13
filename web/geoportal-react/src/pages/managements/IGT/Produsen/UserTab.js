import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import RefreshIcon from "@mui/icons-material/Refresh";
import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";
import { retrieveProdusenUser } from "src/redux/actions/produsen-user";
import UserDialog from "./UserDialog";

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
  const initialConfig = {
    data: null,
    produsen: null,
    title: "Tambah User Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan User baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.produsen_user);
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
    dispatch(retrieveProdusenUser("0"));

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
          dispatch(retrieveProdusenUser("0"));
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
      dispatch(retrieveProdusenUser("0"));
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
      dispatch(retrieveProdusenUser(a[0].uuid));
    } else {
      setSelectedProdusen(value);
      setConfig({ ...config, ["produsen"]: null });
      setProdusen(null);
      dispatch(retrieveProdusenUser("0"));
    }
  };

  const handleClickAdd = () => {
    setConfig({
      data: null,
      produsen: produsen,
      title: "Tambah User Baru",
      mode: "add",
      action: "Submit",
      description: "Silahkan isi form berikut untuk menambahkan User baru.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete User",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus User?",
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
  function generate(arr) {
    //console.log(arr);
    if (arr) {
      //console.log(arr);
      var results = [];
      arr.forEach(function (item) {
        results.push(item["username"].toString());
      });
      return results.join(", ");
    }
  }

  function generateName(arr) {
    //console.log(arr);
    if (arr) {
      var a = arr.filter(function (el) {
        return el.name == selectedProdusen;
      });
      if (a.length > 0) return a[0].name;
    }
  }
  function generateAkronim(arr) {
    //console.log(arr);
    if (arr) {
      var a = arr.filter(function (el) {
        return el.name == selectedProdusen;
      });
      if (a.length > 0) return a[0].akronim;
    }
  }
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
            <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              {currentUser.roles.includes("ROLE_ADMIN") &&
              selectedProdusen != "Pilih Produsen Data Geospasial" ? (
                <Grid item>
                  <Tooltip placement="top" title="Create User" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create User
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
                    <TableCell>User</TableCell>
                    <TableCell>Nama Produsen DG</TableCell>
                    <TableCell>Akronim</TableCell>

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
                        {selectedProdusen == "Pilih Produsen Data Geospasial"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((lokasi) => (
                      <TableRow key={lokasi.uuid} hover>
                        <TableCell>{lokasi.username}</TableCell>
                        <TableCell>{generateName(lokasi.produsens)}</TableCell>
                        <TableCell>
                          {generateAkronim(lokasi.produsens)}
                        </TableCell>

                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            {/*   
                            <Tooltip title="Edit Wilayah" arrow>
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
                              */}
                            <Tooltip
                              placement="top"
                              title="Delete Wilayah"
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

          <UserDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;
