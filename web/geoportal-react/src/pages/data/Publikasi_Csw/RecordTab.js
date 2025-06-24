import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  useTheme,
  CardContent,
  TextField,
  InputAdornment,
  TablePagination,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { retrievePublikPaginated } from "src/redux/actions/record";

import DaftarDialog from "./RecordDialog";

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function RecordTab() {
  const theme = useTheme();

  // State untuk pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State untuk search
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  
  // State untuk loading
  const [loading, setLoading] = useState(false);
  
  // State untuk dialog
  const [open, setOpen] = useState(false);
  const label = "Dataset Publikasi";

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan  ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);
  
  const datas = useSelector((state) => state.record);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedKeyword(value);
      setPage(0); // Reset ke halaman pertama saat search
    }, 300),
    []
  );

  // Function untuk fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(retrievePublikPaginated({
        page,
        size: rowsPerPage,
        keyword: debouncedKeyword
      }));
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, rowsPerPage, debouncedKeyword]);

  // Load data saat pertama kali mounting atau saat parameter berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setKeyword(value);
    debouncedSearch(value);
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
      description: `Anda yakin akan menghapus ${data.title}?`,
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

  const handleRefresh = () => {
    fetchData();
  };

  // Pastikan datas memiliki struktur yang benar
  const records = Array.isArray(datas) ? datas : (datas?.records || []);
  const totalItems = datas?.totalItems || 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Search and Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <TextField
                placeholder="Cari berdasarkan identifier atau keyword..."
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
                }}
              />
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  sx={{ mr: 1 }}
                  disabled={loading}
                >
                  Refresh
                </Button>
                {/* {(currentUser?.roles?.includes("ROLE_ADMIN") ||
                  currentUser?.roles?.includes("ROLE_WALIDATA")) && (
                  <Button 
                    variant="contained" 
                    startIcon={<AddTwoToneIcon />}
                    onClick={handleClickAdd}
                  >
                    Tambah {label}
                  </Button>
                )} */}
              </Box>
            </Box>

            {/* Table Container */}
            <TableContainer sx={{ position: 'relative' }}>
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
                    <TableCell>Identifier</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Abstract</TableCell>
                    <TableCell>Date Publication</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Keywords</TableCell>
                    <TableCell>Organizations</TableCell>
                    <TableCell>Links</TableCell>
                    {(currentUser?.roles?.includes("ROLE_ADMIN") ||
                      currentUser?.roles?.includes("ROLE_WALIDATA")) && (
                      <TableCell align="right">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        {loading ? "Memuat data..." : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((data) => (
                      <TableRow key={data.identifier} hover>
                        <TableCell>{data.identifier}</TableCell>
                        <TableCell>{data.title}</TableCell>
                        <TableCell>{data.abstract}</TableCell>
                        <TableCell>{data.date_publication}</TableCell>
                        <TableCell>{data.type}</TableCell>
                        <TableCell>{data.keywords}</TableCell>
                        <TableCell>{data.organization}</TableCell>
                        <TableCell>{data.links}</TableCell>

                        {(currentUser?.roles?.includes("ROLE_ADMIN") ||
                          currentUser?.roles?.includes("ROLE_WALIDATA")) && (
                          <TableCell align="right">
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
              count={totalItems}
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
          <DaftarDialog 
            open={open} 
            onClose={handleClose} 
            config={config}
            onRefresh={fetchData} // Pass fetchData as callback
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default RecordTab;