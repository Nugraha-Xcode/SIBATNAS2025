import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Grid,
  Divider,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableContainer,
  useTheme,
  styled,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import { retrieve } from "src/redux/actions/keywords";

import DaftarDialog from "./DaftarDialog";

function KeywordsTab() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
  const label = "Keywords";

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan  ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.keywords);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Memoized function to perform client-side filtering and pagination
  const filterData = useCallback(() => {
    setLoading(true);
    
    // Filter the data based on the search keyword
    let result = [...datas];
    
    if (keyword) {
      // Case-insensitive search on the name property
      result = result.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase())
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

  // Initial data load
  useEffect(() => {
    setLoading(true);
    dispatch(retrieve()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

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
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: `Edit  ${label}`,
      mode: "edit",
      action: "Save",
      description: `Silahkan edit form berikut untuk mengupdate ${label}.`,
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: `Delete ${label}`,
      mode: "delete",
      action: "Delete",
      description: `Anda yakin akan menghapus ${label}?`,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Refresh data after dialog is closed
    setLoading(true);
    dispatch(retrieve()).finally(() => {
      setLoading(false);
    });
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
    dispatch(retrieve()).finally(() => {
      setLoading(false);
    });
  };

  // Get the current page data
  const currentPageData = getPaginatedData();

  return (
    <Grid container spacing={3}>
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
                placeholder={`Cari ${label}...`}
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
                {currentUser.roles.includes("ROLE_ADMIN") && (
                  <Tooltip placement="top" title={`Create ${label}`} arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create {label}
                    </Button>
                  </Tooltip>
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
                    <TableCell>Nama {label}</TableCell>
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
                      <TableCell colSpan={currentUser.roles.includes("ROLE_ADMIN") ? 2 : 1} align="center">
                        {keyword 
                          ? `Tidak ada data yang cocok dengan pencarian "${keyword}"`
                          : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((data) => (
                      <TableRow key={data.uuid} hover>
                        <TableCell>{data.name}</TableCell>
                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <Tooltip title={`Edit ${label}`} arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleClickEdit(data)}
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              placement="top"
                              title={`Delete ${label}`}
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

export default KeywordsTab;