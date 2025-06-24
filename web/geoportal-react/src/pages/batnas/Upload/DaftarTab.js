import React, { useState, useEffect } from "react";
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
  TableContainer,
  useTheme,
  styled,
  CardContent,
  TablePagination,
  Pagination,
  Stack,
  Box,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import PublishIcon from "@mui/icons-material/Publish";

import RefreshIcon from "@mui/icons-material/Refresh";
import { retrieve } from "src/redux/actions/unsur";

import DaftarDialog from "./DaftarDialog";
import ImportDialog from "./ImportDialog";

function UnsurTab() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const label = "Upload SHP";
  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan  ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);

  const { user: currentUser } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  const ListUpload = [
    {
      id: 1,
      date_ubah: "Mon, 21 Mar 2022 10:39:27 GMT",
      instansi: "BIG",
      judul_layer: "Morowali",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 2,
      date_ubah: "Mon, 21 Mar 2022 07:10:40 GMT",
      instansi: "BIG",
      judul_layer: "Medan",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 3,
      date_ubah: "Wed, 20 Sep 2023 14:00:37 GMT",
      instansi: "ESDM",
      judul_layer: "Perairan Tanjung Ular",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 4,
      date_ubah: "Tue, 30 Nov 2021 12:28:27 GMT",
      instansi: "BIG",
      judul_layer: "Belawan",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 5,
      date_ubah: "Wed, 11 Jan 2023 14:18:32 GMT",
      instansi: "BIG",
      judul_layer: "LKI Utara Papua",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 4,
      date_ubah: "Tue, 30 Nov 2021 12:28:27 GMT",
      instansi: "BIG",
      judul_layer: "Belawan",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
    {
      id: 5,
      date_ubah: "Wed, 11 Jan 2023 14:18:32 GMT",
      instansi: "BIG",
      judul_layer: "LKI Utara Papua",
      espg: "4326",
      aktif: "aktif",
      status_shapefile: "Selesai",
    },
  ];

  const [datas, setDatas] = useState(ListUpload); // Data utama
  const [paginatedData, setPaginatedData] = useState(datas); // Inisialisasi dengan data utama

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = paginatedData.slice(indexOfFirstData, indexOfLastData);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleClickAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Grid item>
                <Tooltip placement="top" title={`Create ${label}`} arrow>
                  <Button
                    sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                    variant="outlined"
                    startIcon={<AddTwoToneIcon fontSize="small" />}
                    onClick={handleClickAdd}
                  >
                    Tambah {label}
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

            <Divider />
            <TableContainer>
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tanggal Ubah</TableCell>
                    <TableCell>Instansi</TableCell>
                    <TableCell>Judul Layer</TableCell>
                    <TableCell>EPSG</TableCell>
                    <TableCell>Aktif</TableCell>
                    <TableCell>Status Sapefile</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>Data tidak ditemukan</TableCell>
                    </TableRow>
                  ) : null}
                  {currentData &&
                    currentData.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.date_ubah}</TableCell>
                        <TableCell>{data.instansi}</TableCell>
                        <TableCell>{data.judul_layer}</TableCell>
                        <TableCell>{data.espg}</TableCell>
                        <TableCell>{data.aktif}</TableCell>
                        <TableCell>{data.status_shapefile}</TableCell>
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
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(paginatedData.length / dataPerPage)} // jumlah halaman
                  page={currentPage} // halaman saat ini
                  onChange={handleChangePage} // event handler saat halaman diubah
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default UnsurTab;
