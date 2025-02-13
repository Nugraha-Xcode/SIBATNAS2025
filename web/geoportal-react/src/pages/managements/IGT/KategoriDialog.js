import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, remove, update } from "src/redux/actions/kategoriTematik";

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
  Grid,
  Link,
  Slide,
  TextField,
  Typography,
} from "@mui/material";

import swal from "sweetalert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WarningIcon from "@mui/icons-material/Warning";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const { onClose, open, config } = props;
  const initialDataState = {
    name: "",
  };
  const [data, setData] = useState(initialDataState);
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
      } else {
        setData(initialDataState);
      }
    }
  }, [config]);

  const save = () => {
    const { name } = data;

    dispatch(create(name))
      .then((data) => {
        //console.log(data);
        //setSubmitted(true);
        swal("Success", "Data berhasil disimpan!", "success", {
          buttons: false,
          timer: 2000,
        });
        onClose();

        //console.log(data);
      })
      .catch((e) => {
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const updateContent = () => {
    dispatch(update(data.uuid, data))
      .then((response) => {
        console.log(response);
        swal("Success", "Data berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });

        onClose();
      })
      .catch((e) => {
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const removeData = () => {
    // Show warning confirmation first
    swal({
      title: "Peringatan!",
      text: "Menghapus kategori ini akan menghapus SEMUA data yang terkait dengan kategori tersebut. Apakah Anda yakin ingin melanjutkan?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Batal",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
        confirm: {
          text: "Ya, Hapus",
          value: true,
          visible: true,
          className: "bg-red-600",
          closeModal: true
        }
      },
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        dispatch(remove(data.uuid))
          .then(() => {
            swal("Success", "Data berhasil dihapus!", "success", {
              buttons: false,
              timer: 2000,
            });
            onClose();
          })
          .catch((e) => {
            swal("Error", e.response.data.message, "error", {
              buttons: false,
              timer: 2000,
            });
            console.log(e);
          });
      }
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
        />
        {config.mode === "delete" && (
          <Alert 
            severity="warning"
            icon={<WarningIcon />}
            sx={{ mt: 2, mb: 2 }}
          >
            <Typography variant="body1" component="div">
              Perhatian! Menghapus kategori ini akan:
            </Typography>
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Menghapus semua data yang terkait dengan kategori ini</li>
              <li>Tindakan ini tidak dapat dibatalkan</li>
            </ul>
          </Alert>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "add" ? (
          <Button onClick={save} variant="contained">
            {config.action}
          </Button>
        ) : config.mode == "edit" ? (
          <Button onClick={updateContent} variant="contained">
            {config.action}
          </Button>
        ) : (
          <Button onClick={removeData} variant="contained">
            {config.action}
          </Button>
        )}
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
