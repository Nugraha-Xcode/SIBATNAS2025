import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Typography,
  Card,
  CardActions,
  Grid,
  FormControlLabel,
  FormControl,
  InputLabel,
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
  MenuItem,
  Slide,
  Select,
  useTheme,
  styled,
  CardContent,
} from "@mui/material";

import environment from "src/config/environment";

import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import PublicTwoToneIcon from "@mui/icons-material/PublicTwoTone";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  retrieveByUUID,
  unduh,
  unduhIndonesia,
} from "src/redux/actions/dataEksternal";

//import { retrieveByUserUUID } from "src/redux/actions/eksternal";

import {
  retrieve,
  retrieveEksternalProvince,
} from "src/redux/actions/provinsi";
import { retrieveRegionProvinsi } from "src/redux/actions/region";
import { retrieveBpkhtlProvinceUser } from "src/redux/actions/bpkhtl-province";
import { retrieveEksternalProvinceUser } from "src/redux/actions/eksternal-province";
import { retrieveInternalProvinceUser } from "src/redux/actions/internal-province";
import { retrieveInfoBatas } from "src/redux/actions/setting";

import { retrieveEksternalRegionUser } from "src/redux/actions/eksternal-region";
import { retrieveInternalRegionUser } from "src/redux/actions/internal-region";

import DataDialog from "./DataDialog";

import swal from "sweetalert";

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
  const { user: currentUser } = useSelector((state) => state.auth);

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  //const datas = useSelector((state) => state.data_publikasi);
  const provinsis = useSelector((state) =>
    currentUser.roles.includes("ROLE_ADMIN") ||
    currentUser.roles.includes("ROLE_WALIDATA") ||
    currentUser.roles.includes("ROLE_PRODUSEN")
      ? state.provinsi
      : currentUser.roles.includes("ROLE_BPKHTL")
      ? state.bpkhtl_province
      : currentUser.roles.includes("ROLE_EKSTERNAL")
      ? state.eksternal_province
      : currentUser.roles.includes("ROLE_INTERNAL")
      ? state.internal_province
      : null
  );
  const datas = useSelector((state) => state.data_eksternal);
  const regions = useSelector((state) => state.region);
  const setting = useSelector((state) => state.setting);

  const initialDataState = {
    province: provinsis[0],
    region: regions[0],
  };
  const [data, setData] = useState(initialDataState);

  let { uuid } = useParams();

  const [listProvinsi, setListProvinsi] = useState([]);
  const [listRegion, setListRegion] = useState([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState("Pilih Provinsi");
  const [selectedRegion, setSelectedRegion] = useState(
    "Pilih Seluruh Kabupaten/Kota"
  );

  const [level, setLevel] = useState("provinsi");

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA") ||
      currentUser.roles.includes("ROLE_PRODUSEN")
    ) {
      dispatch(retrieveEksternalProvince(uuid));
    } else if (currentUser.roles.includes("ROLE_BPKHTL")) {
      dispatch(retrieveBpkhtlProvinceUser(currentUser.uuid));
    } else if (currentUser.roles.includes("ROLE_EKSTERNAL")) {
      dispatch(retrieveEksternalProvinceUser(currentUser.uuid));
    } else if (currentUser.roles.includes("ROLE_INTERNAL")) {
      dispatch(retrieveInternalProvinceUser(currentUser.uuid));
    }

    dispatch(retrieveByUUID(uuid));
    dispatch(retrieveInfoBatas());
  }, []);

  useEffect(() => {
    if (provinsis.length > 0) {
      var list = [];
      list.push({ uuid: "0", name: "Pilih Provinsi" });
      provinsis.map((provinsi) => {
        list.push(provinsi);
      });
      setListProvinsi(list);
      //dispatch(retrieveByKategori(kategoriTematiks[0].uuid));
    }
  }, [provinsis]);

  const handleProvinsiChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedProvinsi(value);
    var a = provinsis.filter(function (el) {
      return el.name == value;
    });
    setLevel("provinsi");

    dispatch(retrieveRegionProvinsi(a[0]?.uuid))
      .then((datas) => {
        var list = [];
        list.push({ uuid: "0", name: "Pilih Seluruh Kabupaten/Kota" });
        datas.map((data) => {
          list.push(data);
        });
        setListRegion(list);
        setData({
          province: a[0],
          region: list[0],
        });
        setSelectedRegion(list[0].name);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleRegionChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedRegion(value);
    var a = listRegion.filter(function (el) {
      return el.name == value;
    });
    setLevel("region");
    setData({
      province: null,
      region: a[0],
    });
  };

  const unduhData = () => {
    var uuid_prod = datas?.uuid;
    dispatch(unduh(level, uuid_prod, data, currentUser.uuid))
      .then((response) => {
        console.log(response);
        swal("Success", "Data berhasil diproses!", "success", {
          buttons: false,
          timer: 2000,
        });

        //onClose();
      })
      .catch((e) => {
        swal("Wait", e.response.data.message, "warning", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const unduhDataKabupaten = () => {
    var uuid_prod = datas?.uuid;
    dispatch(
      unduh(
        "region",
        uuid_prod,
        { province: null, region: datas?.igtEksternal?.eksternal?.regions[0] },
        currentUser.uuid
      )
    )
      .then((response) => {
        console.log(response);
        swal("Success", "Data berhasil diproses!", "success", {
          buttons: false,
          timer: 2000,
        });

        //onClose();
      })
      .catch((e) => {
        swal("Wait", e.response.data.message, "warning", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const unduhDataIndonesia = () => {
    var uuid_prod = datas?.uuid;
    dispatch(unduhIndonesia(uuid_prod, currentUser.uuid))
      .then((response) => {
        console.log(response);
        swal("Success", "Data berhasil diproses!", "success", {
          buttons: false,
          timer: 2000,
        });

        //onClose();
      })
      .catch((e) => {
        swal("Wait", e.response.data.message, "warning", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
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
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Preview Map
            </Typography>
            {Array.isArray(datas) ? (
              ""
            ) : (
              <img
                src={datas?.urlGeoserver.replace(
                  environment.geoserverLocal,
                  environment.api + "/"
                )}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Deskripsi Data
            </Typography>
            UUID: {uuid}
            <br />
            IG Tematik: {Array.isArray(datas) ? "" : datas?.igtEksternal.name}
            <br />
            Deskripsi: {datas?.deskripsi}
            <br />
            Waktu Publish:
            {Array.isArray(datas)
              ? ""
              : format(
                  parseISO(datas?.createdAt),
                  " dd MMMM, yyyy - h:mm:ss a"
                )}
            <br />
          </CardContent>
        </Card>
      </Grid>
      {currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA") ||
      currentUser.roles.includes("ROLE_PRODUSEN") ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Unduh Semua Wilayah
              </Typography>
              <Button onClick={unduhDataIndonesia} variant="contained">
                Unduh Data Indonesia
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Alert severity="info" sx={{ fontWeight: "bold" }}>
              {setting?.name}
            </Alert>
          </CardContent>
        </Card>
      </Grid>
      {datas?.igtEksternal?.eksternal?.regions.length > 0 ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Unduh Kabupaten/Kota
              </Typography>
              <Button onClick={unduhDataKabupaten} variant="contained">
                Unduh Data {datas.igtEksternal.eksternal.regions[0].name}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Filter Wilayah
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel>Provinsi</InputLabel>
                <Select
                  value={selectedProvinsi ?? ""}
                  onChange={handleProvinsiChange}
                  label="Provinsi"
                  autoWidth
                >
                  {listProvinsi.length > 0 ? (
                    listProvinsi.map((provinsi) => (
                      <MenuItem key={provinsi.uuid} value={provinsi.name}>
                        {provinsi.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={0} value={"Pilih Provinsi"}>
                      {"Pilih Provinsi"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel>Kabupaten/Kota</InputLabel>
                <Select
                  value={selectedRegion ?? ""}
                  onChange={handleRegionChange}
                  label="Kabupaten/Kota"
                  autoWidth
                >
                  {listRegion.length > 0 ? (
                    listRegion.map((provinsi) => (
                      <MenuItem key={provinsi.uuid} value={provinsi.name}>
                        {provinsi.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem key={0} value={"Pilih Seluruh Kabupaten/Kota"}>
                      {"Pilih Seluruh Kabupaten/Kota"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </CardContent>
            <CardActions sx={{ justifyContent: "end" }}>
              {selectedProvinsi == "Pilih Provinsi" ? (
                ""
              ) : (
                <Button onClick={unduhData} variant="contained">
                  Unduh Data
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}

export default KategoriTab;
