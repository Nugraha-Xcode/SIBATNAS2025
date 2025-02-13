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

import { retrieve } from "src/redux/actions/eksternal";
import { retrieveIgtEksternal } from "src/redux/actions/igt-eksternal";

import IgtDialog from "./IgtDialog";

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
    eksternal: null,
    title: "Tambah IGT Unggah Eksternal Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan IGT Unggah Eksternal baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.igtEksternal);
  const { user: currentUser } = useSelector((state) => state.auth);
  const eksternals = useSelector((state) => state.eksternal);
  const [listEksternal, setListEksternal] = useState([]);
  const [selectedEksternal, setSelectedEksternal] = useState("Pilih Eksternal");
  const [eksternal, setEksternal] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
    dispatch(retrieveIgtEksternal("0"));
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
      dispatch(retrieveIgtEksternal(a[0].uuid));
    } else {
      setSelectedEksternal(value);
      setConfig({ ...config, ["eksternal"]: null });
      setEksternal(null);
      dispatch(retrieveIgtEksternal("0"));
    }
  };

  const handleClickAdd = () => {
    setConfig({
      data: null,
      eksternal: eksternal,
      title: "Tambah IGT Unggah Eksternal Baru",
      mode: "add",
      action: "Submit",
      description:
        "Silahkan isi form berikut untuk menambahkan IGT Unggah Eksternal baru.",
    });
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: "Edit IGT Unggah Eksternal",
      mode: "edit",
      action: "Save",
      description:
        "Silahkan edit form berikut untuk mengupdate IGT Unggah Eksternal.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      eksternal: eksternal,
      title: "Delete IGT Unggah Eksternal",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus IGT Unggah Eksternal?",
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
                value={selectedEksternal ?? ""}
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
                  <Tooltip
                    placement="top"
                    title="Create IGT Unggah Eksternal"
                    arrow
                  >
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create IGT Unggah Eksternal
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
                    <TableCell>Nama IGT Unggah</TableCell>
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
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>
                        {selectedEksternal == "Pilih Eksternal"
                          ? "Filter belum dipilih"
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((kategori) => (
                      <TableRow key={kategori.uuid} hover>
                        <TableCell>{kategori.name}</TableCell>
                        <TableCell>{kategori.eksternal?.name}</TableCell>
                        <TableCell>{kategori.eksternal?.akronim}</TableCell>

                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <Tooltip title="Edit IGT Eksternal" arrow>
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
                            <Tooltip
                              placement="top"
                              title="Delete IGT Eksternal"
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
                                onClick={() => handleClickDelete(kategori)}
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
          </CardContent>
          <IgtDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
