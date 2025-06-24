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
import { retrieve } from "src/redux/actions/bpkhtl";
import {
  retrieveAllBPKHTL,
  retrieveAllBPKHTLProdusenUser,
  retrieveAllBPKHTLUser,
} from "src/redux/actions/dataBPKHTL";
import environment from "src/config/environment";

import DataDialog from "./DataDialog";

function KategoriTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const label = "Toponimi";
  const initialConfig = {
    data: null,
    option: null,
    title: `Tambah Data ${label} baru`,
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.data_bpkhtl);
  const { user: currentUser } = useSelector((state) => state.auth);
  const options = useSelector((state) => state.bpkhtl);

  const [listOption, setListOption] = useState([]);
  const pilih = `Pilih ${label}`;
  const [selectedOption, setSelectedOption] = useState(pilih);
  const [option, setOption] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    /*if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieveAllData());
    } else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
      dispatch(retrieveAllData()); // per igt milik produsen
    } else {
      //dispatch(retrieveAllBPKHTL(currentUser.uuid));
      dispatch(retrieveAllUser(currentUser.uuid));
    }*/

    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveAllBPKHTL("0"));
    } else if (currentUser.roles.includes("ROLE_BPKHTL")) {
      dispatch(retrieveAllBPKHTLUser(currentUser.uuid));
    } else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
      dispatch(retrieveAllBPKHTLProdusenUser(currentUser.uuid));
    }
  }, []);

  useEffect(() => {
    if (options.length > 0) {
      var list = [];
      list.push({ uuid: "0", name: pilih });
      options.map((data) => {
        list.push(data);
      });
      setListOption(list);
      setOption(options[0]);
      setConfig({ ...config, ["option"]: options[0] });
    }
  }, [options]);

  const handleOptionChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== pilih) {
      setSelectedOption(value);
      var a = options.filter(function (el) {
        return el.name == value;
      });

      //setData({ ...data, ["province"]: a[0] });
      setConfig({ ...config, ["option"]: a[0] });
      setOption(a[0]);
      dispatch(retrieveAllBPKHTL(a[0].uuid));
    } else {
      setSelectedOption(value);
      setConfig({ ...config, ["option"]: null });
      setOption(null);
      dispatch(retrieveAllBPKHTL("0"));
    }
  };
  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: `Edit Data ${label} baru`,
      mode: "edit",
      action: "Save",
      description: `Silahkan edit form berikut untuk mengupdate Data ${label}`,
    });
    setOpen(true);
  };

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
                <InputLabel>{label}</InputLabel>
                <Select
                  value={selectedOption ?? ""}
                  onChange={handleOptionChange}
                  label={label}
                  autoWidth
                >
                  {listOption.length > 0 ? (
                    listOption.map((o) => (
                      <MenuItem key={o.uuid} value={o.name}>
                        {o.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={0} value={label}>
                      {label}
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
              currentUser.roles.includes("ROLE_KONTRIBUTOR") ? (
                <Grid item>
                  <Tooltip placement="top" title={`Tambah Data ${label}`} arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      {`Tambah Data ${label}`}
                    </Button>
                  </Tooltip>
                  {/*
                  &&
              selectedOption != "Pilih Role"
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
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Waktu Upload</TableCell>
                    <TableCell align="center">Keterangan Referensi</TableCell>
                    <TableCell align="center">File</TableCell>
                    {currentUser.roles.includes("ROLE_ADMIN") ||
                    currentUser.roles.includes("ROLE_BPKHTL") ? (
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
                          ? selectedOption == pilih
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
                        <TableCell>{data.deskripsi}</TableCell>
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
                                "/data-bpkhtl/unduhReferensi/" +
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
                                "/data-bpkhtl/unduhFile/" +
                                data.uuid
                              }
                              //onClick={() => handleClickDelete(data)}
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
                          currentUser.roles.includes("ROLE_BPKHTL") ? (
                            <Tooltip
                              placement="top"
                              title={`Delete Data ${label}`}
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
