import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deactivate } from "src/redux/actions/dataPublikasi";

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
  LinearProgress,
  MenuItem,
  Slide,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import swal from "sweetalert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const { onClose, open, config } = props;
  const { user: currentUser } = useSelector((state) => state.auth);
  //const statuses = useSelector((state) => state.statusPemeriksaan);

  const [data, setData] = useState();
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        console.log(config.data);

        // setSelectedStatus(config.data.statusPemeriksaan.name);
      }
    }
  }, [config]);
  const updateContent = () => {
    dispatch(deactivate(data.uuid, currentUser))
      .then((response) => {
        console.log(response);
        swal("Success", "Data berhasil dipublish!", "success", {
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "edit" ? (
          <Button onClick={updateContent} variant="contained">
            {config.action}
          </Button>
        ) : (
          ""
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
