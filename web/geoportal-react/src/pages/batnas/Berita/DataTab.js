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
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";

import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import PublishIcon from "@mui/icons-material/Publish";

import RefreshIcon from "@mui/icons-material/Refresh";
import { retrieve } from "src/redux/actions/unsur";

// import DaftarDialog from "./DaftarDialog";
// import ImportDialog from "./ImportDialog";

function UnsurTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const label = "Berita";

  const ListUpload = [
    {
      id: 1,
      date_input: "20-OCT-2021",
      nama: "Khusus Admin1",
      title: "Demnas",
    },
    {
      id: 2,
      date_input: "20-OCT-2021",
      nama: "Khusus Admin1",
      title:
        "Pemerintah Indonesia Klaim Landas Kontinen Seluas Dua Kali Pulau Jawa di Barat Daya Sumatera",
    },
    {
      id: 3,
      date_input: "13-OCT-2021",
      nama: "Khusus Admin1",
      title:
        "Integrasi Data dan Informasi Geospasial Kelautan Nasional Guna Mendukung MP3EI",
    },
    {
      id: 4,
      date_input: "06-APR-2023",
      nama: "Khusus Admin1",
      title: "Survei Batimetri di Taman Nasional Karimunjawa",
    },
    {
      id: 5,
      date_input: "20-OCT-2021",
      nama: "Khusus Admin1",
      title: "BIG Lakukan Pemetaan di Kawasan Taman Nasional Kepulauan Seribu",
    },
  ];

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan  ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);
  // const datas = useSelector((state) => state.unsur);
  const [datas, setDatas] = useState(ListUpload);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
  }, []);

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleClickImport = () => {
    // setConfig(initialConfig);
    setOpenExcel(true);
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

  const handleCloseExcel = () => {
    setOpenExcel(false);
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
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* <Grid
              container
              justifyContent="end"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Tooltip placement="top" title={`Upload file excel ${label}`} arrow>
                <Button
                  sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                  variant="outlined"
                  startIcon={<PublishIcon fontSize="small" />}
                  onClick={handleClickImport}
                >
                  Import Excel
                </Button>
              </Tooltip>
              {currentUser.roles.includes("ROLE_ADMIN") ? (
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
              ) : (
                ""
              )}
            </Grid> */}

            {/* coba tambah */}

            <Divider />
            <TableContainer>
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date Input</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell> Title</TableCell>

                    {currentUser.roles.includes("ROLE_ADMIN") ? (
                      <TableCell align="right">Actions</TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>Data tidak ditemukan</TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.date_input}</TableCell>
                        <TableCell>{data.nama}</TableCell>
                        <TableCell>{data.title}</TableCell>

                        {currentUser.roles.includes("ROLE_ADMIN") ? (
                          <TableCell align="right">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Tooltip
                                placement="top"
                                title={`Edit ${label}`}
                                arrow
                              >
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
                              <Tooltip
                                placement="top"
                                title={`Preview ${label}`}
                                arrow
                              >
                                <IconButton
                                  sx={{
                                    "&:hover": {
                                      background: theme.colors.error.lighter,
                                    },
                                    color: theme.palette.success.main,
                                  }}
                                  color="inherit"
                                  size="small"
                                  // onClick={() => handleClickDelete(data)}
                                >
                                  <VisibilityTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          {/* <DaftarDialog open={open} onClose={handleClose} config={config} />
          <ImportDialog open={openExcel} onClose={handleCloseExcel} /> */}
        </Card>
      </Grid>
    </Grid>
  );
}

export default UnsurTab;
