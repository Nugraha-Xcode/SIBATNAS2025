import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  InputAdornment,
  CircularProgress,
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
import SearchIcon from '@mui/icons-material/Search';
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [listKategori, setListKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(
    "Pilih Kategori Bidang IGT"
  );
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
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

  // Memoized function to perform client-side filtering and pagination
  const filterData = useCallback(() => {
    setLoading(true);
    
    // Filter the data based on the search keyword
    let result = [...datas];
    
    if (keyword) {
      // Case-insensitive search on multiple fields
      result = result.filter(item => 
        item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.akronim?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.kategoriTematik?.name?.toLowerCase().includes(keyword.toLowerCase())
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
    dispatch(retrieve());
    dispatch(retrieveProdusenKategori("0")).finally(() => {
      setLoading(false);
    });
  }, []);
  
  useEffect(() => {
    if (kategoris.length > 0) {
      var list = [];
      list.push({ uuid: "0", name: "Pilih Kategori Bidang IGT" });
      kategoris.map((provinsi) => {
        list.push(provinsi);
      });
      setListKategori(list);
      setKategori(kategoris[0]);
      setConfig({ ...config, ["kategori"]: kategoris[0] });
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

      setConfig({ ...config, ["kategori"]: a[0] });
      setKategori(a[0]);
      setLoading(true);
      dispatch(retrieveProdusenKategori(a[0].uuid)).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when changing kategori
      setKeyword("");
      setPage(0);
    } else {
      setSelectedKategori(value);
      setConfig({ ...config, ["kategori"]: null });
      setKategori(null);
      setLoading(true);
      dispatch(retrieveProdusenKategori("0")).finally(() => {
        setLoading(false);
      });
      
      // Reset search and pagination when clearing kategori
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
    // Refresh data after dialog closes
    if (kategori) {
      setLoading(true);
      dispatch(retrieveProdusenKategori(kategori.uuid)).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(true);
      dispatch(retrieveProdusenKategori("0")).finally(() => {
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
    if (kategori) {
      dispatch(retrieveProdusenKategori(kategori.uuid)).finally(() => {
        setLoading(false);
      });
    } else {
      dispatch(retrieveProdusenKategori("0")).finally(() => {
        setLoading(false);
      });
    }
  };

  // Get the current page data
  const currentPageData = getPaginatedData();

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
            {/* Search and Action Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <TextField
                placeholder="Cari produsen berdasarkan nama, akronim, atau kategori..."
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
                selectedKategori != "Pilih Kategori Bidang IGT" ? (
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
                  {!loading && currentPageData.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={currentUser.roles.includes("ROLE_ADMIN") ? 4 : 3} align="center">
                        {selectedKategori === "Pilih Kategori Bidang IGT"
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
          <DaftarDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default LokasiTab;