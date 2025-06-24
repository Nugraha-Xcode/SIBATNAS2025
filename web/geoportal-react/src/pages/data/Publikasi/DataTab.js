import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  InputAdornment,
  CircularProgress,
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
import PublicOffIcon from '@mui/icons-material/PublicOff';
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import SearchIcon from '@mui/icons-material/Search';

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

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

  //console.log("datas", datas);

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
  const [produsen, setProdusen] = useState(null);

  const dispatch = useDispatch();

  // Fetch data with pagination and search
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Safe access to produsen UUID and currentUser
      const produsenUuid = produsen?.uuid !== "0" ? produsen?.uuid : "0";
      const userUuid = currentUser?.uuid || "";
      
      console.log('Fetching data with parameters:', {
        userUuid,
        page,
        rowsPerPage,
        keyword,
        produsenUuid
      });
  
      let result;
      if (
        currentUser?.roles?.includes("ROLE_ADMIN") ||
        currentUser?.roles?.includes("ROLE_WALIDATA")
      ) {
        // For admin/walidata, use selected produsen UUID
        result = await dispatch(
          retrieveByProdusenAdmin(produsenUuid, {
            page,
            size: rowsPerPage,
            keyword,
          })
        );
      } else {
        // For other roles
        result = await dispatch(
          retrieveByProdusen(produsenUuid, {
            page,
            size: rowsPerPage,
            keyword,
          })
        );
      }
      
      if (result) {
        console.log('Fetch successful. Records count:', result.records?.length || 0);
      } else {
        console.warn('Fetch completed but no result returned');
      }
      
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, rowsPerPage, keyword, currentUser, produsen]);

  // Load data on component mount or when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initial data load and filter options
  useEffect(() => {
    dispatch(retrieve());
    dispatch(retrieveProdusenKategori("0"));
    
    var list = [];
    list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
    setListProdusen(list);
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
      // Find the selected kategori object
      const selectedKategoriObj = kategoris.find(el => el.name === value);
      
      if (!selectedKategoriObj) {
        console.error("Selected kategori not found in list");
        return;
      }
      
      setSelectedKategori(value);
      
      // Clear existing data while loading
      setLoading(true);
      
      // Reset search and pagination
      setKeyword("");
      setPage(0);

      dispatch(retrieveProdusenKategori(selectedKategoriObj.uuid))
        .then((datas) => {
          var list = [];
          list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
          
          if (datas && Array.isArray(datas)) {
            datas.forEach((data) => {
              list.push(data);
            });
          }
          
          setListProdusen(list);
          
          // Clear produsen selection
          setProdusen(null);
          setConfig(prevConfig => ({ ...prevConfig, produsen: null }));
          setSelectedProdusen("Pilih Produsen Data Geospasial");
          
          // Clear the data display until a produsen is selected
          dispatch({
            type: "RETRIEVE_DATA_PUBLIKASI_SUCCESS",
            payload: { records: [], totalItems: 0, totalPages: 0, currentPage: 0 }
          });
          
          setLoading(false);
        })
        .catch((e) => {
          console.error("Error fetching produsen for kategori:", e);
          setLoading(false);
        });
    } else {
      // Clear kategori selection
      setSelectedKategori(value);
      
      // Reset search and pagination
      setKeyword("");
      setPage(0);
      
      // Clear existing data while loading
      setLoading(true);
      
      dispatch(retrieveProdusenKategori("0"))
        .then(() => {
          var list = [];
          list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
          setListProdusen(list);
          setProdusen(null);
          setConfig(prevConfig => ({ ...prevConfig, produsen: null }));
          setSelectedProdusen("Pilih Produsen Data Geospasial");
          
          // Clear the data display
          dispatch({
            type: "RETRIEVE_DATA_PUBLIKASI_SUCCESS",
            payload: { records: [], totalItems: 0, totalPages: 0, currentPage: 0 }
          });
          
          setLoading(false);
        })
        .catch((e) => {
          console.error("Error clearing produsen list:", e);
          setLoading(false);
        });
    }
  };

  const handleProdusenChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Produsen Data Geospasial") {
      // Find the selected produsen object
      const selectedProdusenObj = listProdusen.find(el => el.name === value);
      
      if (!selectedProdusenObj) {
        console.error("Selected produsen not found in list");
        return;
      }
      
      // Update state in a single batch to prevent race conditions
      setSelectedProdusen(value);
      setConfig(prevConfig => ({ ...prevConfig, produsen: selectedProdusenObj }));
      
      // Important: set produsen first, then fetch data directly
      // This ensures we're using the correct produsen UUID
      setProdusen(selectedProdusenObj);
      
      // Reset pagination and search when changing filters
      setKeyword("");
      setPage(0);
      
      console.log("Selected produsen:", selectedProdusenObj);
      
      // Directly fetch data with the new produsen UUID
      if (
        currentUser?.roles?.includes("ROLE_ADMIN") ||
        currentUser?.roles?.includes("ROLE_WALIDATA")
      ) {
        dispatch(
          retrieveByProdusenAdmin(selectedProdusenObj.uuid, {
            page: 0,
            size: rowsPerPage,
            keyword: "",
          })
        ).then(result => {
          console.log("Fetched data for produsen:", result);
        }).catch(error => {
          console.error("Error fetching data for produsen:", error);
        });
      } else {
        dispatch(
          retrieveByProdusen(selectedProdusenObj.uuid, {
            page: 0,
            size: rowsPerPage,
            keyword: "",
          })
        ).then(result => {
          console.log("Fetched data for produsen:", result);
        }).catch(error => {
          console.error("Error fetching data for produsen:", error);
        });
      }
      
    } else {
      // Clear produsen selection
      setSelectedProdusen(value);
      setConfig(prevConfig => ({ ...prevConfig, produsen: null }));
      setProdusen(null);
      
      // Reset pagination and search when clearing filters
      setKeyword("");
      setPage(0);
      
      // Directly fetch data with default UUID "0"
      if (
        currentUser?.roles?.includes("ROLE_ADMIN") ||
        currentUser?.roles?.includes("ROLE_WALIDATA")
      ) {
        dispatch(
          retrieveByProdusenAdmin("0", {
            page: 0,
            size: rowsPerPage,
            keyword: "",
          })
        ).then(result => {
          console.log("Fetched data with cleared filters:", result);
        }).catch(error => {
          console.error("Error fetching data with cleared filters:", error);
        });
      } else {
        dispatch(
          retrieveByProdusen("0", {
            page: 0,
            size: rowsPerPage,
            keyword: "",
          })
        ).then(result => {
          console.log("Fetched data with cleared filters:", result);
        }).catch(error => {
          console.error("Error fetching data with cleared filters:", error);
        });
      }
    }
  };

  // Search handler with debounce
  const handleSearchChange = (event) => {
    const value = event.target.value;
    
    // Update the search keyword state
    setKeyword(value);
    
    // Reset to first page when searching
    setPage(0);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to trigger the search
    const timeoutId = setTimeout(() => {
      // Log the search parameters for debugging
      console.log("Searching with:", {
        keyword: value,
        page: 0,
        size: rowsPerPage,
        produsenUuid: produsen?.uuid || "0"
      });
      
      // Determine which API to call based on user role
      if (
        currentUser?.roles?.includes("ROLE_ADMIN") ||
        currentUser?.roles?.includes("ROLE_WALIDATA")
      ) {
        const produsenUuid = produsen?.uuid !== "0" ? produsen?.uuid : "0";
        
        dispatch(
          retrieveByProdusenAdmin(produsenUuid, {
            page: 0,
            size: rowsPerPage,
            keyword: value,
          })
        );
      } else {
        const produsenUuid = produsen?.uuid !== "0" ? produsen?.uuid : "0";
        
        dispatch(
          retrieveByProdusen(produsenUuid, {
            page: 0,
            size: rowsPerPage,
            keyword: value,
          })
        );
      }
    }, 300);
    
    setSearchTimeout(timeoutId);
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

  const handleClickUnpublish = (data) => {
    setConfig({
      data: data,
      title:
        "Process Unpublish Data " +
        data.tematik?.name +
        " (" +
        data.deskripsi +
        ")",
      mode: "unpublish",
      action: "Unpublish",
      description: "Silahkan klik untuk melakukan proses unpublikasi data",
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
    // Refresh data after closing dialog
    fetchData();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    // Refresh data after closing dialog
    fetchData();
  };

  const handleUnduh = (data) => {
    window.location.href = "publikasi/unduh/" + data.uuid;
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchData will be triggered by useEffect due to page dependency
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
    // fetchData will be triggered by useEffect due to rowsPerPage dependency
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchData();
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
            {/* Search and Action Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <TextField
                placeholder="Cari berdasarkan deskripsi atau nama tematik..."
                variant="outlined"
                size="small"
                value={keyword}
                onChange={handleSearchChange}
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: keyword && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          // Clear the search field
                          setKeyword("");
                          setPage(0);
                          
                          // Explicitly fetch data with empty keyword
                          const produsenUuid = produsen?.uuid !== "0" ? produsen?.uuid : "0";
                          
                          if (
                            currentUser?.roles?.includes("ROLE_ADMIN") ||
                            currentUser?.roles?.includes("ROLE_WALIDATA")
                          ) {
                            dispatch(
                              retrieveByProdusenAdmin(produsenUuid, {
                                page: 0,
                                size: rowsPerPage,
                                keyword: "",
                              })
                            );
                          } else {
                            dispatch(
                              retrieveByProdusen(produsenUuid, {
                                page: 0,
                                size: rowsPerPage,
                                keyword: "",
                              })
                            );
                          }
                        }}
                        edge="end"
                        size="small"
                      >
                        <Typography variant="caption">×</Typography>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </Box>

            {/* Table Container with Loading */}
            <TableContainer sx={{ position: 'relative', minHeight: 200 }}>
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
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
                  {!loading && (!datas.records || datas.records.length === 0) ? (
                    <TableRow key={0}>
                      <TableCell colSpan={10} align="center">
                        {selectedProdusen === "Pilih Produsen Data Geospasial" && !keyword
                          ? "Silakan pilih filter terlebih dahulu"
                          : keyword 
                            ? `Tidak ada data yang cocok dengan pencarian "${keyword}"`
                            : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    datas.records && datas.records.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.tematik?.name}</TableCell>
                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell align="center">
                          {data.dataPemeriksaan?.dataPerbaikanProdusen?.length > 0
                            ? data.dataPemeriksaan?.dataPerbaikanProdusen[
                                data.dataPemeriksaan?.dataPerbaikanProdusen.length - 1
                              ].kategori
                            : data.dataPemeriksaan?.kategori}
                        </TableCell>
                        {currentUser.roles.includes("ROLE_PRODUSEN") ? (
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
                                  data.dataPemeriksaan?.dataPerbaikanProdusen.length > 0
                                    ? environment.api +
                                      "/data-perbaikan-produsen/unduhQA/" +
                                      data.dataPemeriksaan?.dataPerbaikanProdusen[
                                        data.dataPemeriksaan?.dataPerbaikanProdusen.length - 1
                                      ].uuid
                                    : environment.api +
                                      "/data-pemeriksaan/unduhFile/" +
                                      data.dataPemeriksaan?.uuid
                                }
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
                        <TableCell align="right">
                          {data.urlGeoserver == null || !data.is_active ? (
                            ""
                          ) : (
                            <Tooltip placement="top" title="Unduh Data Publikasi" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
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
                          
                          {data.is_published &&
                          data.is_active &&
                          (currentUser.roles.includes("ROLE_ADMIN") ||
                            currentUser.roles.includes("ROLE_WALIDATA")) ? (
                            <Tooltip placement="top" title="Unpublish Data" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleClickUnpublish(data)}
                              >
                                <PublicOffIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          
                          {(currentUser.roles.includes("ROLE_ADMIN")) ? (
                            <Tooltip placement="top" title="Delete Data Publikasi" arrow>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              component="div"
              count={datas.totalItems || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
              labelRowsPerPage="Baris per halaman:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
              }
            />
          </CardContent>

          <UserDialog open={open} onClose={handleClose} config={config} />
          <EditDialog open={openEdit} onClose={handleCloseEdit} config={configEdit} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;