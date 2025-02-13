import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
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
import { retrieve } from "src/redux/actions/eksternal";
import { retrieveEksternalProvince } from "src/redux/actions/eksternal-province";
import { retrieveEksternalRegion } from "src/redux/actions/eksternal-region";

import WilayahDialog from "./WilayahDialog";

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

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const initialConfig = {
    data: null,
    eksternal: null,
    title: "Tambah Wilayah Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan Lokasi baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.eksternal_province);
  const datas2 = useSelector((state) => state.eksternal_region);

  const { user: currentUser } = useSelector((state) => state.auth);
  const eksternals = useSelector((state) => state.eksternal);
  const [listEksternal, setListEksternal] = useState([]);
  const [selectedEksternal, setSelectedEksternal] = useState("Pilih Eksternal");
  const [eksternal, setEksternal] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
    dispatch(retrieveEksternalProvince("0"));
  }, []);

  useEffect(() => {
    if (eksternals.length > 0) {
      //console.log(kategoriTematiks);
      //console.log(kategoriTematiks[0].name);
      //var a = kategoriTematiks.filter(function (el) {
      //  return el.name == kategoriTematiks[0].name;
      //});
      var list = [];
      list.push({ uuid: "0", name: "Pilih Eksternal" });
      eksternals.map((data) => {
        list.push(data);
      });
      setListEksternal(list);
      setEksternal(eksternals[0]);
      setConfig({ ...config, ["eksternal"]: eksternals[0] });
      //setSelectedProvinsi(provinsis[0].name);
      //setData({ ...data, ["province"]: provinsis[0] });
      //dispatch(retrieveRegionProvinsi(provinsis[0].uuid));

      //dispatch(retrieveByKategori(kategoriTematiks[0].uuid));
    }
  }, [eksternals]);

  const handleEksternalChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Eksternal") {
      setSelectedEksternal(value);
      var a = eksternals.filter(function (el) {
        return el.name == value;
      });

      //setData({ ...data, ["province"]: a[0] });
      setConfig({ ...config, ["eksternal"]: a[0] });
      setEksternal(a[0]);
      //console.log(a[0]);
      if (a[0].kategoriEksternal.cakupanWilayah.name == "Provinsi") {
        dispatch(retrieveEksternalProvince(a[0].uuid));
        dispatch(retrieveEksternalRegion("0"));
      } else {
        dispatch(retrieveEksternalProvince("0"));
        dispatch(retrieveEksternalRegion(a[0].uuid));
      }
    } else {
      setSelectedEksternal(value);
      setConfig({ ...config, ["eksternal"]: null });
      setEksternal(null);
      dispatch(retrieveEksternalProvince("0"));
    }
  };

  const handleClickAdd = () => {
    setConfig({
      data: null,
      eksternal: eksternal,
      title: "Tambah Wilayah Baru",
      mode: "add",
      action: "Submit",
      description: "Silahkan isi form berikut untuk menambahkan Wilayah baru.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      eksternal: eksternal,
      title: "Delete Wilayah",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus Wilayah?",
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
        results.push(item["name"].toString());
      });
      return results.join(", ");
    }
  }

  function generateName(arr) {
    //console.log(arr);
    if (arr) {
      var a = arr.filter(function (el) {
        return el.name == selectedEksternal;
      });
      if (a.length > 0) return a[0].name;
    }
  }

  function generateAkronim(arr) {
    if (arr) {
      var a = arr.filter(function (el) {
        return el.name == selectedEksternal;
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
              Filter Eksternal
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel>Eksternal</InputLabel>
              <Select
                value={selectedEksternal}
                onChange={handleEksternalChange}
                label="Eksternal"
                autoWidth
              >
                {listEksternal.length > 0 ? (
                  listEksternal.map((eksternal) => (
                    <MenuItem key={eksternal.uuid} value={eksternal.name}>
                      {eksternal.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={0} value={"Pilih Eksternal"}>
                    {"Pilih Eksternal"}
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
              selectedEksternal != "Pilih Eksternal" ? (
                <Grid item>
                  <Tooltip placement="top" title="Create Wilayah" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create Wilayah
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
                    <TableCell>Wilayah</TableCell>
                    <TableCell>Nama Eksternal</TableCell>
                    <TableCell>Akronim</TableCell>
                    {currentUser.roles.includes("ROLE_ADMIN") ? (
                      <TableCell align="right">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length == 0 &&
                  eksternal?.kategoriEksternal?.cakupanWilayah.name ==
                    "Provinsi" ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {selectedEksternal == "Pilih Eksternal"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((lokasi) => (
                      <TableRow key={lokasi.uuid} hover>
                        <TableCell>{lokasi.name}</TableCell>
                        <TableCell>{generateName(lokasi.eksternals)}</TableCell>
                        <TableCell>
                          {generateAkronim(lokasi.eksternals)}
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
                  {datas2.length == 0 &&
                  eksternal?.kategoriEksternal?.cakupanWilayah.name !=
                    "Provinsi" ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {selectedEksternal == "Pilih Eksternal"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas2 &&
                    datas2.map((lokasi) => (
                      <TableRow key={lokasi.uuid} hover>
                        <TableCell>{lokasi.name}</TableCell>
                        <TableCell>{generateName(lokasi.eksternals)}</TableCell>
                        <TableCell>
                          {generateAkronim(lokasi.eksternals)}
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
          <WilayahDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default LokasiTab;
