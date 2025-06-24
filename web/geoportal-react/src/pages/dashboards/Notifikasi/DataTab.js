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
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import SearchIcon from '@mui/icons-material/Search';

import environment from "src/config/environment";
import { NavLink } from "react-router-dom";
import { retrieveAll, retrieveAllUser, retrieveAllUserPaginated, updateReadStatus } from "src/redux/actions/notifikasi";
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const initialConfig = {
    data: null,
    title: "Tambah Data Produsen Baru",
    mode: "add",
    action: "Submit",
    description: "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);

  const datas = useSelector((state) => state.notifikasi);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Fetch data with pagination and search
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(
        retrieveAllUserPaginated(currentUser.uuid, {
          page,
          size: rowsPerPage,
          keyword,
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, rowsPerPage, keyword, currentUser]);

  // Load data on component mount or when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search handler
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setKeyword(value);
    setPage(0); // Reset to first page when searching
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleClickBaca = (data) => {
    if (!data.sudahBaca) {
      dispatch(updateReadStatus(data.uuid))
        .then(() => {
          console.log("Notification marked as read");
          fetchData(); // Refresh the list after marking as read
        })
        .catch((e) => {
          console.log(e);
        });
    }
    
    setConfig({
      data: data,
      title: "Baca Notifikasi",
      mode: "view",
      action: "Oke",
      description: "Notifikasi pesan untuk Anda.",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Search Input */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <TextField
                placeholder="Cari berdasarkan subjek atau pesan..."
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
            </Box>

            {/* Table Container with Loading */}
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
              
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>Waktu Kirim</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.records?.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>Data tidak ditemukan</TableCell>
                    </TableRow>
                  ) : null}
                  {datas.records?.map((data) => (
                    <TableRow key={data.uuid} hover>
                      <TableCell>
                        {format(
                          parseISO(data.waktuKirim),
                          "dd MMMM, yyyy - h:mm:ss a"
                        )}
                      </TableCell>
                      <TableCell>{data.subjek}</TableCell>
                      <TableCell>
                        <Tooltip
                          placement="top"
                          title={data.sudahBaca ? "Sudah Dibaca" : "Belum Dibaca"}
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
                            onClick={() => handleClickBaca(data)}
                          >
                            {data.sudahBaca ? 
                              <MarkEmailReadIcon fontSize="small" /> : 
                              <MarkunreadIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
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
          <DataDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
