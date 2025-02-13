import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, update, remove } from "src/redux/actions/eksternal-province";
import {
  create as createRegion,
  update as updateRegion,
  remove as removeRegion,
} from "src/redux/actions/eksternal-region";
import { retrieve } from "src/redux/actions/eksternal";
import { retrieve as retrieveProvinsi } from "src/redux/actions/provinsi";
import { retrieveRegionProvinsi } from "src/redux/actions/region";

import PropTypes from "prop-types";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormControl,
  InputLabel,
  Grid,
  Link,
  MenuItem,
  Slide,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import swal from "sweetalert";
import { blue, green } from "@mui/material/colors";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const { onClose, open, config } = props;
  const { user: currentUser } = useSelector((state) => state.auth);
  const eksternals = useSelector((state) => state.eksternal);
  const provinsis = useSelector((state) => state.provinsi);
  const regions = useSelector((state) => state.region);

  const initialDataState = {
    eksternal: eksternals[0],
    province: provinsis[0],
    region: regions[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedEksternal, setSelectedEksternal] = useState(
    eksternals[0]?.name
  );
  const [selectedProvinsi, setSelectedProvinsi] = useState(provinsis[0]?.name);
  const [listRegion, setListRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]?.name);

  const [loading, setLoading] = useState(false);
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveProvinsi());
      dispatch(retrieveRegionProvinsi("0"));
    }
  }, []);

  const handleEksternalChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedEksternal(value);
    var a = eksternals.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["eksternal"]: a[0] });
  };

  const handleProvinsiChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedProvinsi(value);
    var a = provinsis.filter(function (el) {
      return el.name == value;
    });

    dispatch(retrieveRegionProvinsi(a[0].uuid))
      .then((datas) => {
        var list = [];
        //list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
        datas.map((data) => {
          list.push(data);
        });
        setListRegion(list);
        setData({
          eksternal: config.eksternal,
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

    setData({ ...data, ["region"]: a[0] });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        setSelectedEksternal(config.eksternal?.name);
        setSelectedProvinsi(config.data.name);
        setSelectedRegion(config.data.name);

        var a = eksternals.filter(function (el) {
          return el.name == config.eksternal?.name;
        });
        //setSelectedBpkhtl(config.data.bpkhtls[0]?.name);

        var b = provinsis.filter(function (el) {
          return el.name == config.data.name;
        });
        setData({
          eksternal: a[0],
          province: b[0],
          region: { uuid: config.data.uuid, name: config.data.name },
        });
        console.log(data);
        /*dispatch(retrieveRegionProvinsi(b[0]?.uuid))
          .then((datas) => {
            var list = [];
            //list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
            datas.map((data) => {
              list.push(data);
            });
            setListRegion(list);
            setData({
              eksternal: a[0],
              province: b[0],
              region: list[0],
            });
            setSelectedRegion(list[0]?.name);
          })
          .catch((e) => {
            console.log(e);
          });
          */
        //setData({ ...data, ["province"]: a[0] });
      } else {
        setData(initialDataState);
        setSelectedEksternal(config.eksternal?.name);
        // setData({ ...data, ["eksternal"]: config.eksternal });
        setSelectedProvinsi(provinsis[0]?.name);
        //console.log(provinsis);
        //setData({ eksternal: config.eksternal, province: provinsis[0] });
        dispatch(retrieveRegionProvinsi(provinsis[0]?.uuid))
          .then((datas) => {
            var list = [];
            //list.push({ uuid: "0", name: "Pilih Produsen Data Geospasial" });
            datas.map((data) => {
              list.push(data);
            });
            setListRegion(list);
            setData({
              eksternal: config.eksternal,
              province: provinsis[0],
              region: list[0],
            });
            setSelectedRegion(list[0]?.name);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [config]);

  const save = (e) => {
    e.preventDefault();
    if (
      config.eksternal?.kategoriEksternal?.cakupanWilayah?.name != "Provinsi"
    ) {
      const { eksternal, region } = data;
      //console.log(data);

      setLoading(true);
      dispatch(createRegion(eksternal, region))
        .then((data) => {
          //console.log(data);
          //setSubmitted(true);
          setLoading(false);
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();

          //console.log(data);
        })
        .catch((e) => {
          setLoading(true);
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          console.log(e);
        });
    } else {
      const { eksternal, province } = data;
      //console.log(data);

      setLoading(true);
      dispatch(create(eksternal, province))
        .then((data) => {
          //console.log(data);
          //setSubmitted(true);
          setLoading(false);
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();

          //console.log(data);
        })
        .catch((e) => {
          setLoading(true);
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          console.log(e);
        });
    }
  };

  const updateContent = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(update(data.uuid, data))
      .then((response) => {
        console.log(response);
        setLoading(false);
        swal("Success", "Data berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });

        onClose();
      })
      .catch((e) => {
        setLoading(false);
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const removeData = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(data);

    if (
      config.eksternal?.kategoriEksternal?.cakupanWilayah?.name != "Provinsi"
    ) {
      dispatch(removeRegion(data))
        .then(() => {
          setLoading(false);
          swal("Success", "Data berhasil dihapus!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
        })
        .catch((e) => {
          setLoading(false);
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          console.log(e);
        });
    } else {
      dispatch(remove(data))
        .then(() => {
          setLoading(false);
          swal("Success", "Data berhasil dihapus!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
        })
        .catch((e) => {
          setLoading(false);
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          console.log(e);
        });
    }
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      scroll="paper"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>{config.title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{config.description}</DialogContentText>

        {currentUser.roles.includes("ROLE_ADMIN") ? (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={true}
          >
            <InputLabel>Eksternal</InputLabel>
            <Select
              value={selectedEksternal ?? ""}
              onChange={handleEksternalChange}
              label="Eksternal"
              key="eksternal"
              autoWidth
            >
              {eksternals.map((data) => (
                <MenuItem key={data.uuid} value={data.name}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
        <DialogContentText>
          Cakupan Wilayah:
          {config.eksternal?.kategoriEksternal?.cakupanWilayah?.name}
        </DialogContentText>

        {config.mode == "delete" ? (
          <DialogContentText>Wilayah: {config.data.name}</DialogContentText>
        ) : (
          ""
        )}
        {currentUser.roles.includes("ROLE_ADMIN") && config.mode == "add" ? (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={config.mode == "delete"}
          >
            <InputLabel>Provinsi</InputLabel>
            <Select
              value={selectedProvinsi ?? ""}
              onChange={handleProvinsiChange}
              label="Provinsi"
              autoWidth
            >
              {provinsis.map((lokasi) => (
                <MenuItem key={lokasi.uuid} value={lokasi.name}>
                  {lokasi.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}

        {currentUser.roles.includes("ROLE_ADMIN") &&
        config.eksternal?.kategoriEksternal?.cakupanWilayah?.name !=
          "Provinsi" &&
        config.mode != "delete" ? (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={config.mode == "delete"}
          >
            <InputLabel>Kabupaten/Kota</InputLabel>
            <Select
              value={selectedRegion ?? ""}
              onChange={handleRegionChange}
              label="Kabupaten/Kota"
              autoWidth
            >
              {listRegion.map((lokasi) => (
                <MenuItem key={lokasi.uuid} value={lokasi.name}>
                  {lokasi.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
      </DialogContent>
      <DialogActions>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ mr: "10px" }}
          >
            Cancel
          </Button>
          {config.mode == "add" ? (
            <Button onClick={save} variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: blue[500],
                    position: "absolute",
                    top: "50%",
                    left: "40%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              ) : (
                config.action
              )}
            </Button>
          ) : config.mode == "edit" ? (
            <Button
              onClick={updateContent}
              variant="contained"
              disabled={loading}
            >
              {config.action}
            </Button>
          ) : (
            <Button onClick={removeData} variant="contained" disabled={loading}>
              {config.action}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

KategoriDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default KategoriDialog;
