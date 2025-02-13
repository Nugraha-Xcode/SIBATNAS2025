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
import SyncIcon from "@mui/icons-material/Sync";
import MapIcon from "@mui/icons-material/MapTwoTone";

import RefreshIcon from "@mui/icons-material/Refresh";
import { retrieve, retrieveBPKHTL } from "src/redux/actions/eksternal";
import {
  retrieveAllEksternal,
  retrieveAllEksternalUser,
} from "src/redux/actions/dataEksternal";
import environment from "src/config/environment";

import DataDialog from "./DataDialog";
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
  const label = "Eksternal";
  const initialConfig = {
    data: null,
    title: `Tambah Data ${label} baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan Data ${label} baru`,
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.data_eksternal);
  const { user: currentUser } = useSelector((state) => state.auth);
  const options = useSelector((state) => state.eksternal);
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
      //dispatch(retrieveAllEksternal(currentUser.uuid));
      dispatch(retrieveAllUser(currentUser.uuid));
    }*/

    if (currentUser.roles.includes("ROLE_EKSTERNAL")) {
      dispatch(retrieveAllEksternalUser(currentUser.uuid));
    } else if (currentUser.roles.includes("ROLE_BPKHTL")) {
      dispatch(retrieveBPKHTL(currentUser.uuid));
      dispatch(retrieveAllEksternal("0"));
    } else {
      dispatch(retrieve());
      dispatch(retrieveAllEksternal("0"));
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
      dispatch(retrieveAllEksternal(a[0].uuid));
    } else {
      setSelectedOption(value);
      setConfig({ ...config, ["option"]: null });
      setOption(null);
      dispatch(retrieveAllEksternal("0"));
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
      {!currentUser.roles.includes("ROLE_EKSTERNAL") ? (
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
              currentUser.roles.includes("ROLE_EKSTERNAL") ? (
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
                    {currentUser.roles.includes("ROLE_ADMIN") ||
                    currentUser.roles.includes("ROLE_EKSTERNAL") ? (
                      <TableCell align="center">File</TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell align="center">Geoserver</TableCell>
                    <TableCell align="center">Actions</TableCell>
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
                    Array.isArray(datas) &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.igtEksternal.name}</TableCell>
                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell>{data.user.username}</TableCell>

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
                                "/data-eksternal/unduhReferensi/" +
                                data.uuid
                              }
                              //onClick={() => handleClickDelete(data)}
                            >
                              <DownloadTwoToneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                        {currentUser.roles.includes("ROLE_ADMIN") ||
                        currentUser.roles.includes("ROLE_EKSTERNAL") ? (
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
                                  "/data-eksternal/unduhFile/" +
                                  data.uuid
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
                          {data.urlGeoserver != null ? (
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
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {currentUser.roles.includes("ROLE_ADMIN") ||
                          (currentUser.roles.includes("ROLE_EKSTERNAL") &&
                            currentUser.username == data.user.username) ? (
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
                          {!currentUser.roles.includes("ROLE_EKSTERNAL") ? (
                            data.urlGeoserver == null ? (
                              ""
                            ) : (
                              <Tooltip
                                placement="top"
                                title="Unduh Data Eksternal"
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
                            )
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
