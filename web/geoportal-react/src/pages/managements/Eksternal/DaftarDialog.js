import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, remove, update } from "src/redux/actions/eksternal";
import { retrieve } from "src/redux/actions/kategoriEksternal";
import { retrieve as retrieveMekanisme } from "src/redux/actions/mekanismeEksternal";
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
  CircularProgress,
} from "@mui/material";

import swal from "sweetalert";
import { blue, green } from "@mui/material/colors";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DaftarDialog(props) {
  const { onClose, open, config } = props;
  const { user: currentUser } = useSelector((state) => state.auth);

  const kategoriEksternals = useSelector((state) => state.kategoriEksternal);
  const mekanismeEksternals = useSelector((state) => state.mekanismeEksternal);
  const initialDataState = {
    name: "",
    akronim: "",
    kategoriEksternal: kategoriEksternals[0],
    mekanismeEksternal: mekanismeEksternals[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedMekanisme, setSelectedMekanisme] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveMekanisme());
      setSelectedKategori(kategoriEksternals[0]?.name);
      setSelectedMekanisme(mekanismeEksternals[0]?.name);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleMekanismeChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedMekanisme(value);
    var a = mekanismeEksternals.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["mekanismeEksternal"]: a[0] });
  };

  const handleKategoriChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedKategori(value);
    var a = kategoriEksternals.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["kategoriEksternal"]: a[0] });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        setSelectedKategori(config.data.kategoriEksternal?.name);
        setSelectedMekanisme(config.data.mekanismeEksternal?.name);
      } else {
        setData(initialDataState);
        setSelectedKategori(kategoriEksternals[0]?.name);
        setSelectedMekanisme(mekanismeEksternals[0]?.name);
      }
    }
  }, [config]);

  function isValidated() {
    //console.log(user);
    return data.name.length > 0 && data.akronim.length > 0;
  }

  const save = (e) => {
    e.preventDefault();

    const { name, akronim, kategoriEksternal, mekanismeEksternal } = data;
    if (isValidated()) {
      setLoading(true);
      dispatch(create(name, akronim, kategoriEksternal, mekanismeEksternal))
        .then((data) => {
          //console.log(data);
          //setSubmitted(true);
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
          setLoading(false);

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
        {currentUser.roles.includes("ROLE_ADMIN") ? (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={config.mode == "delete"}
          >
            <InputLabel>Mekanisme</InputLabel>
            <Select
              value={selectedMekanisme ?? ""}
              onChange={handleMekanismeChange}
              label="Mekanisme"
              autoWidth
            >
              {mekanismeEksternals.map((kategoriTematik) => (
                <MenuItem
                  key={kategoriTematik.uuid}
                  value={kategoriTematik.name}
                >
                  {kategoriTematik.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
        {currentUser.roles.includes("ROLE_ADMIN") ? (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            disabled={config.mode == "delete"}
          >
            <InputLabel>Kategori Eksternal</InputLabel>
            <Select
              value={selectedKategori ?? ""}
              onChange={handleKategoriChange}
              label="Kategori Eksternal"
              autoWidth
            >
              {kategoriEksternals.map((kategoriTematik) => (
                <MenuItem
                  key={kategoriTematik.uuid}
                  value={kategoriTematik.name}
                >
                  {kategoriTematik.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
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

DaftarDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default DaftarDialog;
