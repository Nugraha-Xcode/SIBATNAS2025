import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, remove, update } from "src/redux/actions/produsen";
import { retrieve } from "src/redux/actions/kategoriTematik";
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
  const [loading, setLoading] = useState(false);
  const kategoriTematiks = useSelector((state) => state.kategoriTematik);
  const initialDataState = {
    name: "",
    akronim: "",
    kategoriTematik: kategoriTematiks[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedKategori, setSelectedKategori] = useState(
    kategoriTematiks[0]?.name
  );
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setData(initialDataState);
    }
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleKategoriChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedKategori(value);
    var a = kategoriTematiks.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["kategoriTematik"]: a[0] });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        setSelectedKategori(config.data.kategoriTematik?.name);
      } else {
        setData(initialDataState);
        setSelectedKategori(config.kategori?.name);
        setData({ ...data, ["kategoriTematik"]: config.kategori });
      }
    }
  }, [config]);

  function isValidated() {
    //console.log(user);
    return data.name.length > 0 && data.akronim.length > 0;
  }

  const save = (e) => {
    e.preventDefault();
    const { name, akronim, kategoriTematik } = data;
    if (isValidated()) {
      setLoading(true);
      dispatch(create(name, akronim, kategoriTematik))
        .then((data) => {
          //console.log(data);
          //setSubmitted(true);
          setLoading(false);

          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
          setData(initialDataState);
          //console.log(data);
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
      setLoading(false);

      swal("Error", "Cek isian formulir!", "error", {
        buttons: false,
        timer: 2000,
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
    dispatch(remove(data.uuid))
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
        <FormControl
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          disabled={config.mode != "edit"}
        >
          <InputLabel>Kategori Tematik</InputLabel>
          <Select
            value={selectedKategori ?? ""}
            onChange={handleKategoriChange}
            label="Kategori Tematik"
            autoWidth
          >
            {kategoriTematiks.map((kategoriTematik) => (
              <MenuItem key={kategoriTematik.uuid} value={kategoriTematik.name}>
                {kategoriTematik.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={data.name}
          onChange={handleInputChange}
          autoComplete="name"
          autoFocus
          disabled={config.mode == "delete"}
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="akronim"
          label="Akronim"
          name="akronim"
          value={data.akronim}
          onChange={handleInputChange}
          autoComplete="akronim"
          autoFocus
          disabled={config.mode == "delete"}
        />
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
