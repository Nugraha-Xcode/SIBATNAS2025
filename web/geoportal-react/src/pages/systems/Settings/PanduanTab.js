import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Grid,
  Divider,
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
  CircularProgress,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

import {
  retrievePanduan,
  createPanduan,
  updatePanduan,
  deletePanduan,
} from "src/redux/actions/panduan";

import PanduanDialog from "./PanduanDialog";

function PanduanTab() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const label = "Panduan";

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);

  const panduan = useSelector((state) => state.panduan || []);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  // const panduan = useSelector((state) => state.panduan?.panduan || []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       await dispatch(retrievePanduan());
  //     } catch (error) {
  //       console.error("Error fetching panduan:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

    useEffect(() => {
      dispatch(retrievePanduan());
    }, []);

    console.log("Panduan data:", panduan);

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const handleClickEdit = (data) => {
    setConfig({
      data: data,
      title: `Edit ${label}`,
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
              {currentUser?.roles?.includes("ROLE_ADMIN") && (
                <Grid item>
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
                </Grid>
              )}
            </Grid>
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Judul Panduan</TableCell>
                    <TableCell>Urutan</TableCell>
                    <TableCell>Status</TableCell>
                    {currentUser?.roles?.includes("ROLE_ADMIN") && (
                      <TableCell align="right">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {panduan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Data tidak ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    panduan.map((item) => (
                      <TableRow key={item.uuid} hover>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>{item.is_active ? "Aktif" : "Tidak Aktif"}</TableCell>
                        {currentUser?.roles?.includes("ROLE_ADMIN") && (
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
                                onClick={() => handleClickEdit(item)}
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
                                onClick={() => handleClickDelete(item)}
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
          </CardContent>
          <PanduanDialog open={open} onClose={handleClose} config={config} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default PanduanTab;