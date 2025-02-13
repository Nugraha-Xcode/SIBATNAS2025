import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, deleteLokasi, updateLokasi } from "src/redux/actions/lokasi";

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
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";

import swal from "sweetalert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UploadFiles from "./UploadFiles";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function BukuTamuDialog(props) {
  const { onClose, open, config } = props;

  const kategoris = useSelector((state) => state.kategori);

  const initialLokasiState = {
    id: null,
    lokasi_name: "",
    address: "",
    radius: 0,
    latitude: 0,
    longitude: 0,
    kategori: kategoris[0],
  };
  const [lokasi, setLokasi] = useState(initialLokasiState);
  const [selectedKategori, setSelectedKategori] = useState("");

  // const [submitted, setSubmitted] = useState(false);
  //const kategoriOptions = [];
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLokasi({ ...lokasi, [name]: value });
  };

  const handleKategoriChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedKategori(value);
    var a = kategoris.filter(function (el) {
      return el.name == value;
    });

    setLokasi({ ...lokasi, ["kategori"]: a[0] });
    /*
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
    */
  };
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      //console.log(kategoris);
      if (config.lokasi) {
        setLokasi({
          id: config.lokasi.id,
          lokasi_name: config.lokasi.lokasi_name,
          address: config.lokasi.address,
          radius: config.lokasi.radius,
          latitude: config.lokasi.latitude,
          longitude: config.lokasi.longitude,
          kategori: config.lokasi.kategori,
        });
        setSelectedKategori(config.lokasi.kategori.name);
      } else {
        setLokasi(initialLokasiState);
        //setSelectedKategori(kategoris[0].name);
      }
    }
  }, [config]);

  const saveLokasi = () => {
    const { lokasi_name, address, radius, latitude, longitude, kategori } =
      lokasi;

    dispatch(
      create(lokasi_name, address, radius, latitude, longitude, kategori)
    )
      .then((data) => {
        console.log(data);
        /*setLokasi({
          id: data.id,
          lokasi_name: data.lokasi_name,
          address: data.address,
          radius: data.radius,
          latitude: data.latitude,
          longitude: data.longitude,
          kategori: data.kategori,
        });
        */
        //setSubmitted(true);
        onClose();

        //console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newLokasi = () => {
    setLokasi(initialLokasiState);
    //setSubmitted(false);
  };

  const updateContent = () => {
    dispatch(updateLokasi(lokasi.id, lokasi))
      .then((response) => {
        console.log(response);
        onClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeLokasi = () => {
    dispatch(deleteLokasi(lokasi.id))
      .then(() => {
        onClose();
      })
      .catch((e) => {
        console.log(e);
      });
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

        <UploadFiles />
        {/*
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={selectedKategori}
            onChange={handleKategoriChange}
            label="Kategori"
            autoWidth
          >
            {kategoris.map((kategori) => (
              <MenuItem key={kategori.id} value={kategori.name}>
                {kategori.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="lokasi_name"
          label="Location Name"
          name="lokasi_name"
          value={lokasi.lokasi_name}
          onChange={handleInputChange}
          autoComplete="lokasi_name"
          autoFocus
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="address"
          label="Address"
          name="address"
          value={lokasi.address}
          onChange={handleInputChange}
          autoComplete="address"
          autoFocus
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="radius"
          label="Radius"
          name="radius"
          type="number"
          inputProps={{ min: 0 }}
          value={lokasi.radius}
          onChange={handleInputChange}
          autoComplete="radius"
          autoFocus
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="longitude"
          label="Longitude"
          name="longitude"
          value={lokasi.longitude}
          onChange={handleInputChange}
          autoComplete="longitude"
          autoFocus
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="latitude"
          label="Latitude"
          name="latitude"
          value={lokasi.latitude}
          onChange={handleInputChange}
          autoComplete="latitude"
          autoFocus
        />
        */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "add" ? (
          <Button onClick={saveLokasi} variant="contained">
            {config.action}
          </Button>
        ) : config.mode == "edit" ? (
          <Button onClick={updateContent} variant="contained">
            {config.action}
          </Button>
        ) : (
          <Button onClick={removeLokasi} variant="contained">
            {config.action}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

BukuTamuDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default BukuTamuDialog;
