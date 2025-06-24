import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";

import {
  Card,
  Grid,
  Button,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  useTheme,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Box,
  CircularProgress,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import MapIcon from "@mui/icons-material/MapTwoTone";
import SyncIcon from "@mui/icons-material/Sync";
import PublicTwoToneIcon from "@mui/icons-material/PublicTwoTone";

import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { retrieve } from "src/redux/actions/publikasi_csw";
import environment from "src/config/environment";

import DaftarDialog from "./DaftarDialog";
import CSWMetadataEditorDialog from "./CSWMetadataEditorDialog"; 

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function Publikasi_cswTab() {
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
  const label = "Publikasi CSW";

  // State for metadata editor dialog
  const [metadataEditorOpen, setMetadataEditorOpen] = useState(false);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [selectedDataUuid, setSelectedDataUuid] = useState(null);

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan  ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.publikasi_csw);
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
      await dispatch(retrieve({
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

  const handleClickPublish = (data) => {
    // open the metadata editor
    const uuid = data?.uuid;
    //console.log("UUID:", uuid);
    //console.log("datalengkap:", data);
    const url = environment.api + "publikasi_csw/unduhMetadata/" + 
      (data.dataPemeriksaan?.dataPerbaikanProdusen?.[0]?.uuid ?? 
       data.dataPemeriksaan?.dataProdusen?.uuid);
    
    setMetadataUrl(url);
    setSelectedDataUuid(uuid);
    setMetadataEditorOpen(true);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle metadata editor opening
  const handleOpenMetadataEditor = (uuid) => {
    const url = environment.api + "publikasi_csw/unduhMetadata/" + uuid;
    const dataUuid = datas.find(data => 
      data.dataPemeriksaan?.dataPerbaikanProdusen?.[0]?.uuid === uuid || 
      data.dataPemeriksaan?.dataProdusen?.uuid === uuid
    )?.dataPemeriksaan?.dataProdusen?.uuid;
    
    setMetadataUrl(url);
    setSelectedDataUuid(dataUuid);
    setMetadataEditorOpen(true);
  };

  // Function to close metadata editor dialog
  const handleCloseMetadataEditor = () => {
    setMetadataEditorOpen(false);
    setMetadataUrl("");
    setSelectedDataUuid(null);
    // Refresh data setelah dialog ditutup
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  // Pastikan datas memiliki struktur yang benar
  const records = Array.isArray(datas) ? datas : (datas?.records || []);
  const totalItems = datas?.totalItems || 0;

  // Fix cols count for table
  const colsCount = currentUser?.roles?.includes("ROLE_PRODUSEN") ? 9 : 8;

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
                placeholder="Cari berdasarkan tematik atau deskripsi..."
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
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell align="center">Kategori</TableCell>
                    {currentUser?.roles?.includes("ROLE_PRODUSEN") && (
                      <TableCell align="center">Dokumen QA</TableCell>
                    )}
                    <TableCell align="center">Klasifikasi Data</TableCell>
                    <TableCell align="center">Status CSW</TableCell>
                    <TableCell align="center">URL Geoserver</TableCell>
                    <TableCell align="center">Identifier</TableCell>

                    {(currentUser?.roles?.includes("ROLE_ADMIN") ||
                    currentUser?.roles?.includes("ROLE_WALIDATA")) && (
                      <TableCell align="right">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={colsCount} align="center">
                        {loading ? "Memuat data..." : "Data tidak ditemukan"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((data) => (
                      <TableRow key={data.uuid} hover>
                        <TableCell>
                          {data.dataPemeriksaan?.dataProdusen?.tematik?.name}
                        </TableCell>
                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell align="center">
                          {data.dataPemeriksaan?.dataPerbaikanProdusen?.length >
                          0
                            ? data.dataPemeriksaan?.dataPerbaikanProdusen[
                                data.dataPemeriksaan?.dataPerbaikanProdusen
                                  .length - 1
                              ].kategori
                            : data.dataPemeriksaan?.kategori}
                        </TableCell>
                        <TableCell align="center">
                          {data.dataPemeriksaan?.dataProdusen?.tematik
                            ?.is_series
                            ? "Series"
                            : "Tidak Series"}
                        </TableCell>

                        <TableCell align="center">
                          {data.identifier ? "Terpublish" : "Belum Publish"}
                        </TableCell>
                        <TableCell align="center">
                          {data.waktuPublish ? (
                            data.urlGeoserver != null ? (
                              <>
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
                                <Typography
                                  variant="caption"
                                  sx={{ display: 'block', mt: 0.5, wordBreak: 'break-all', textTransform: 'none' }}
                                >
                                  {data.urlGeoserver.replace(
                                    environment.geoserverLocal,
                                    environment.api + "/"
                                  )}
                                </Typography>
                              </>
                            ) : (
                              <SyncIcon />
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell>{data.identifier || "-"}</TableCell>

                        {(currentUser?.roles?.includes("ROLE_ADMIN") ||
                        currentUser?.roles?.includes("ROLE_WALIDATA")) && (
                          <TableCell align="center">
                            {!data.identifier ? (
                              <Tooltip placement="top" title="Publish CSW" arrow>
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
                              "-"
                            )}
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
          <DaftarDialog open={open} onClose={handleClose} config={config} />
          {/* Updated CSWMetadataEditorDialog component with dataUuid prop */}
          <CSWMetadataEditorDialog
            open={metadataEditorOpen}
            onClose={handleCloseMetadataEditor} // Gunakan handler yang memiliki fetchData
            metadataUrl={metadataUrl}
            dataUuid={selectedDataUuid}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default Publikasi_cswTab;