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
import { format, subHours, subWeeks, subDays } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from '@mui/icons-material/Search';
import { retrieve } from "src/redux/actions/kategoriTematik";

import KategoriDialog from "./KategoriDialog";

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  
  const initialConfig = {
    data: null,
    title: "Tambah Kategori Tematik Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Kategori Tematik baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.kategoriTematik);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  
  // Memoized function to perform client-side filtering and pagination
  const filterData = useCallback(() => {
    setLoading(true);
    
    // Filter the data based on the search keyword
    let result = [...datas];
    
    if (keyword && keyword.trim() !== "") {
      // Case-insensitive search on multiple fields
      result = result.filter(item => 
        item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
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
  }, [filterData, keyword]); // Explicitly add keyword as dependency

  useEffect(() => {
    setLoading(true);
    dispatch(retrieve()).finally(() => {
      setLoading(false);
    });
  }, []);

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
  };

  const handleClearSearch = () => {
    // Clear the search field
    setKeyword("");
    setPage(0);
    // The filterData will be triggered via useEffect
  };

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: "Edit Kategori",
      mode: "edit",
      action: "Save",
      description: "Silahkan edit form berikut untuk mengupdate Kategori.",
    });
    setOpen(true);
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete Kategori",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus Kategori?",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Refresh data after dialog closes
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
                placeholder="Cari kategori berdasarkan nama..."
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
                        onClick={handleClearSearch}
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
                {currentUser.roles.includes("ROLE_ADMIN") ? (
                  <Tooltip placement="top" title="Create Kategori" arrow>
                    <Button
                      sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                      variant="outlined"
                      startIcon={<AddTwoToneIcon fontSize="small" />}
                      onClick={handleClickAdd}
                    >
                      Create Kategori Tematik
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
                    <TableCell>Name</TableCell>
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
                            <Tooltip title="Edit Kategori Tematik" arrow>
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
                              title="Delete Kategori Tematik"
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
          <KategoriDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;