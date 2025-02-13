import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, remove, update } from "src/redux/actions/tematik";
import { retrieve } from "src/redux/actions/produsen";
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
  Switch,
  CircularProgress,
} from "@mui/material";

import swal from "sweetalert";
import { blue, green } from "@mui/material/colors";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserDialog(props) {
  const { onClose, open, config } = props;

  const { user: currentUser } = useSelector((state) => state.auth);
  const produsens = useSelector((state) => state.produsen);

  const initialDataState = {
    name: "",
    is_series: false,
    produsen: produsens[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedProdusen, setSelectedProdusen] = useState(produsens[0]?.name);

  const [loading, setLoading] = useState(false);
  //const kategoriOptions = [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      setSelectedProdusen(produsens[0]?.name);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const handleChange = (event) => {
    setData({ ...data, ["is_series"]: event.target.checked });
  };

  const handleProdusenChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedProdusen(value);
    var a = produsens.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["produsen"]: a[0] });
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
      if (config.data) {
        //console.log(config.user);
        setData(config.data);
        setSelectedProdusen(config.data.produsen.name);
      } else {
        setData(initialDataState);
        setSelectedProdusen(config.produsen?.name);
      }
    }
  }, [config]);

  function isValidated() {
    //console.log(user);
    return data.name.length > 0;
  }

  const save = (e) => {
    e.preventDefault();
    const { name, produsen, is_series } = data;
    if (isValidated()) {
      setLoading(true);
      dispatch(create(name, produsen, is_series))
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
        // console.log(response);

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
          <InputLabel>Produsen</InputLabel>
          <Select
            value={selectedProdusen ?? ""}
            onChange={handleProdusenChange}
            label="Produsen"
            autoWidth
          >
            {produsens.map((role) => (
              <MenuItem key={role.uuid} value={role.name}>
                {role.name}
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
        <FormControlLabel
          disabled={config.mode == "delete"}
          control={
            <Switch
              checked={data.is_series}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="is Series?"
          labelPlacement="start"
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

UserDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default UserDialog;
