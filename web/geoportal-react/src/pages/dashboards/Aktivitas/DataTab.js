import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";

import environment from "src/config/environment";
import { NavLink } from "react-router-dom";
import { retrieveAll, retrieveAllUser } from "src/redux/actions/aktifitasUnduh";
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

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const initialConfig = {
    data: null,
    title: "Tambah Data Produsen Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const datas = useSelector((state) => state.aktifitas_unduh);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      //dispatch(retrieveAll());
      dispatch(retrieveAllUser(currentUser.uuid));
    } else {
      dispatch(retrieveAllUser(currentUser.uuid));
    }
  }, []);

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

  const unduhData = (uuid) => {
    /*
    dispatch(unduhFile(uuid))
      .then(() => {
        console.log("sukses unduh file");
      })
      .catch((e) => {
        console.log(e);
      });
      */
  };

  const handleClickDelete = (data) => {
    setConfig({
      data: data,
      title: "Delete Data Produsen",
      mode: "delete",
      action: "Delete",
      description: "Anda yakin akan menghapus Data Produsen?",
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
            ></Grid>
            <Divider />
            <TableContainer>
              <Table width={300}>
                <TableHead>
                  <TableRow>
                    <TableCell>Waktu Aktivitas</TableCell>
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*
                  <TableRow hover>
                    <TableCell>
                      {format(
                        parseISO("2023-11-14T06:16:36.765Z"),
                        "dd MMMM, yyyy - h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell>Deforestrasi</TableCell>
                    <TableCell>
                      Data Deforestasi 2022 dimutakhirkan pada tahun 2023
                    </TableCell>
                    <TableCell>Provinsi Kalimantan Timur</TableCell>
                    <TableCell>processing</TableCell>
                    <TableCell>
                      <SyncIcon />
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>
                      {format(
                        parseISO("2023-11-14T04:56:36.765Z"),
                        "dd MMMM, yyyy - h:mm:ss a"
                      )}
                    </TableCell>
                    <TableCell>Deforestrasi</TableCell>
                    <TableCell>
                      Data Deforestasi 2022 dimutakhirkan pada tahun 2023
                    </TableCell>
                    <TableCell>Provinsi Kalimantan Barat</TableCell>
                    <TableCell>done</TableCell>
                    <TableCell>
                      <Tooltip placement="top" title="Unduh File" arrow>
                        <IconButton
                          sx={{
                            "&:hover": {
                              background: theme.colors.error.lighter,
                            },
                            color: theme.palette.error.main,
                          }}
                          color="inherit"
                          size="small"
                          component={NavLink}
                          to={
                            environment.baseUrl +
                            "DEFORESTASI_2022_AR_250K_KALIMANTAN_BARAT.zip"
                          }
                          target="_blank"
                          download
                        >
                          <DownloadTwoToneIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  */}
                  {datas.length == 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={9}>Data tidak ditemukan</TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((data) => (
                      <TableRow key={data.uuid} hover>
                        <TableCell>
                          {format(
                            parseISO(data.waktuMulai),
                            "dd MMMM, yyyy - h:mm:ss a"
                          )}
                        </TableCell>
                        <TableCell>
                          {data.dataPublikasi?.tematik?.name}
                          {data.dataEksternal?.igtEksternal?.name}
                        </TableCell>
                        <TableCell>
                          {data.dataPublikasi?.deskripsi}{" "}
                          {data.dataEksternal?.deskripsi}
                        </TableCell>
                        <TableCell>{data.wilayahName}</TableCell>
                        <TableCell>{data.status}</TableCell>
                        <TableCell>{data.keterangan ?? ""}</TableCell>

                        <TableCell>
                          {data.status == "processing" ? (
                            <SyncIcon />
                          ) : data.urlUnduh ? (
                            <Tooltip placement="top" title="Unduh File" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
                                component={NavLink}
                                to={data.urlUnduh}
                                target="_blank"
                                download

                                //onClick={() => unduhData(data.uuid)}
                              >
                                <DownloadTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <DomainVerificationIcon />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
