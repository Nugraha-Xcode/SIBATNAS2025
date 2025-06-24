import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';

import { retrieve } from "src/redux/actions/kategoriTematik";
import { retrieveProdusenKategori } from "src/redux/actions/produsen";
import { retrieveTematikProdusen } from "src/redux/actions/tematik";
import UserDialog from "./DaftarDialog";

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
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const initialConfig = {
    data: null,
    produsen: null,
    title: "Tambah Tematik Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan Tematik baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.tematik);
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
  
  // Memoized function to perform client-side filtering and pagination
  const filterData = useCallback(() => {
    setLoading(true);
    
    // Filter the data based on the search keyword
    let result = [...datas];
    
    if (keyword) {
      // Case-insensitive search on multiple fields
      result = result.filter(item => 
        item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.produsen?.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.uuid?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // Store the filtered results
    setFilteredData(result);
    setLoading(false);
  }, [datas, keyword]);

  // Effect to trigger filtering when data or search term changes
  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    setLoading(true);
    dispatch(retrieve()).finally(() => {
      setLoading(false);
    });
    dispatch(retrieveProdusenKategori("0")).finally(() => {
      setLoading(false);
    });
    dispatch(retrieveTematikProdusen("0")).finally(() => {
      setLoading(false);
    });

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

  // Get paginated data
  const getPaginatedData = () => {
    // If no data or not array, return empty array
    if (!filteredData || !Array.isArray(filteredData)) {
      return [];
    }
    
    // Calculate the start and end index for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // Return the sliced data for the current page
    return filteredData.slice(startIndex, endIndex);
  };

  const handleKategoriChange = (e) => {
    let value = null;
    value = e.target.value;

    if (value !== "Pilih Kategori Bidang IGT") {
      setSelectedKategori(value);
      var a = kategoris.filter(function (el) {
        return el.name == value;
      });

      setLoading(true);
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
          dispatch(retrieveTematikProdusen("0")).finally(() => {
            setLoading(false);
          });
          
          // Reset search and pagination when changing kategori
          setKeyword("");
          setPage(0);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    } else {
      setSelectedKategori(value);
      setLoading(true);
      dispatch(retrieveProdusenKategori("0")).finally(() => {
        setLoading(false);
      });
      var list = [];
      list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
      setListProdusen(list);
      setProdusen(null);
      setConfig({ ...config, ["produsen"]: null });
      dispatch(retrieveTematikProdusen("0")).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when clearing kategori
      setKeyword("");
      setPage(0);
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

      setConfig({ ...config, ["produsen"]: a[0] });
      setProdusen(a[0]);
      setLoading(true);
      dispatch(retrieveTematikProdusen(a[0].uuid)).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when changing produsen
      setKeyword("");
      setPage(0);
    } else {
      setSelectedProdusen(value);
      setConfig({ ...config, ["produsen"]: null });
      setProdusen(null);
      setLoading(true);
      dispatch(retrieveTematikProdusen("0")).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when clearing produsen
      setKeyword("");
      setPage(0);
    }
  };

  // Debounced search handler
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
      // This will trigger the useEffect via filterData dependency
      filterData();
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  const handleClickAdd = () => {
    setConfig({
      data: null,
      produsen: produsen,
      title: "Tambah IGT Baru",
      mode: "add",
      action: "Submit",
      description: "Silahkan isi form berikut untuk menambahkan IGT baru.",
    });
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: "Edit IGT",
      mode: "edit",
      action: "Save",
      description: "Silahkan edit form berikut untuk mengupdate IGT.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete IGT",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus IGT?",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Refresh data after dialog closes
    if (produsen) {
      setLoading(true);
      dispatch(retrieveTematikProdusen(produsen.uuid)).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(true);
      dispatch(retrieveTematikProdusen("0")).finally(() => {
        setLoading(false);
      });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    if (produsen) {
      dispatch(retrieveTematikProdusen(produsen.uuid)).finally(() => {
        setLoading(false);
      });
    } else {
      dispatch(retrieveTematikProdusen("0")).finally(() => {
        setLoading(false);
      });
    }
  };

  // Get the current page data
  const currentPageData = getPaginatedData();

  function generate(arr) {
    if (arr) {
      var results = [];
      arr.forEach(function (item) {
        results.push(item["username"].toString());
      });
      return results.join(", ");
    }
  }

  function generateName(arr) {
    if (arr) {
      var a = arr.filter(function (el) {
        return el.name == selectedProdusen;
      });
      if (a.length > 0) return a[0].name;
    }
  }

  function generateAkronim(arr) {
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
                label="Kategori"
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
                placeholder="Cari IGT berdasarkan nama, produsen..."
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
                          // The filterData will be triggered via useEffect
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

              <Box>
                {currentUser.roles.includes("ROLE_ADMIN") &&
                selectedProdusen != "Pilih Produsen Data Geospasial" ? (
                  <Tooltip placement="top" title="Create IGT" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create IGT
                    </Button>
                  </Tooltip>
                ) : (
                  ""
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Divider />
            
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
                    <TableCell>Nama IGT</TableCell>
                    <TableCell>Nama Produsen DG</TableCell>
                    <TableCell>Klasifikasi Data</TableCell>
                    {currentUser.roles.includes("ROLE_ADMIN") ? (
                      <TableCell align="right">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && currentPageData.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={currentUser.roles.includes("ROLE_ADMIN") ? 4 : 3} align="center">
                        {selectedProdusen === "Pilih Produsen Data Geospasial"
                          ? "Filter belum dipilih"
                          : keyword 
                            ? `Tidak ada data yang cocok dengan pencarian "${keyword}"`
                            : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((lokasi) => (
                      <TableRow key={lokasi.uuid} hover>
                        <TableCell>{lokasi.name}</TableCell>
                        <TableCell>{lokasi.produsen.name}</TableCell>
                        <TableCell>
                          {lokasi.is_series ? "Series" : "Tidak Series"}
                        </TableCell>
                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <Tooltip title="Edit IGT" arrow>
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

                            <Tooltip placement="top" title="Delete IGT" arrow>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredData.length}
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
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserTab;