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
import { Helmet } from "react-helmet-async";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { retrieveBerita, createBerita, updateBerita, deleteBerita } from "src/redux/actions/berita";
import BeritaDialog from "./BeritaDialog";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PageHeader from "./PageHeader";

function BeritaTab() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const label = "Berita";

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan ${label} baru.`,
  };
  const [config, setConfig] = useState(initialConfig);

  const berita = useSelector((state) => state.berita || []);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(retrieveBerita());
      } catch (error) {
        console.error("Error fetching berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

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
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container justifyContent="end" alignItems="center" sx={{ mb: 2 }}>
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
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <CircularProgress />
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Judul Berita</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Tanggal</TableCell>
                        {currentUser?.roles?.includes("ROLE_ADMIN") && (
                          <TableCell align="right">Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {berita.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Data tidak ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        berita.map((item) => (
                          <TableRow key={item.uuid} hover>
                            <TableCell>{item.judul}</TableCell>
                            <TableCell>{item.kategori}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            {currentUser?.roles?.includes("ROLE_ADMIN") && (
                              <TableCell align="right">
                                <Tooltip title={`Edit ${label}`} arrow>
                                  <IconButton
                                    sx={{
                                      "&:hover": { background: theme.colors.primary.lighter },
                                      color: theme.palette.primary.main,
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() => handleClickEdit(item)}
                                  >
                                    <EditTwoToneIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip placement="top" title={`Delete ${label}`} arrow>
                                  <IconButton
                                    sx={{
                                      "&:hover": { background: theme.colors.error.lighter },
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
              )}
            </CardContent>
            <BeritaDialog open={open} onClose={handleClose} config={config} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default BeritaTab;