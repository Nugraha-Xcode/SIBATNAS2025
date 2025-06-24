import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Card,
  Grid,
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
} from "@mui/material";

import { format, parseISO } from "date-fns";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import SyncIcon from "@mui/icons-material/Sync";
import MapIcon from "@mui/icons-material/MapTwoTone";

import { retrieveByEksternalUser } from "src/redux/actions/dataPublikasi";
import { recordPublikasiDownload } from "src/redux/actions/visitor";
import environment from "src/config/environment";

function UserTab() {
  const theme = useTheme();

  const datas = useSelector((state) => state.data_publikasi);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveByEksternalUser(currentUser.uuid));
  }, [dispatch, currentUser.uuid]);

  const handleUnduh = (data) => {
    // Track download sebelum redirect
    dispatch(recordPublikasiDownload(data, currentUser));

    // Log download untuk debugging
    console.log('Download tracked (Eksternal):', {
      dataId: data.id,
      uuid: data.uuid,
      userUuid: currentUser.uuid,
      tematik: data.tematik?.name,
      kategori: data.dataPemeriksaan?.kategori,
      userType: 'eksternal'
    });

    // Redirect ke download URL
    window.location.href = "publikasi/unduh/" + data.uuid;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>IG Tematik</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Waktu Pemeriksaan</TableCell>
                    <TableCell>Waktu Publikasi</TableCell>
                    <TableCell>Geoserver</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.length === 0 ? (
                    <TableRow key={0}>
                      <TableCell colSpan={7}>Data tidak ditemukan</TableCell>
                    </TableRow>
                  ) : null}
                  {datas &&
                    datas.map((data) => (
                      <TableRow key={data.id} hover>
                        <TableCell>{data.tematik?.name}</TableCell>

                        <TableCell>{data.deskripsi}</TableCell>
                        <TableCell>
                          {data.dataPemeriksaan?.dataPerbaikanProdusen.length >
                            0
                            ? data.dataPemeriksaan?.dataPerbaikanProdusen[0]
                              .kategori
                            : data.dataPemeriksaan?.kategori}
                        </TableCell>

                        <TableCell>
                          {format(
                            parseISO(data.createdAt),
                            "dd MMMM, yyyy - h:mm:ss a"
                          )}
                        </TableCell>
                        <TableCell>
                          {data.waktuPublish
                            ? format(
                              parseISO(data.waktuPublish),
                              "dd MMMM, yyyy - h:mm:ss a"
                            )
                            : ""}
                        </TableCell>
                        <TableCell align="center">
                          {data.waktuPublish ? (
                            data.urlGeoserver != null ? (
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
                            ) : (
                              <SyncIcon />
                            )
                          ) : (
                            ""
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {data.urlGeoserver == null ? (
                            ""
                          ) : (
                            <Tooltip
                              placement="top"
                              title="Unduh Data Publikasi"
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
                                onClick={() => handleUnduh(data)}
                              >
                                <DownloadTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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

export default UserTab;