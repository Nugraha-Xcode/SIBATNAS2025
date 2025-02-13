import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updatePassword } from "src/redux/actions/auth";

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PasswordDialog(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const { onClose, open, config } = props;
  const initialDataState = {
    passwordOld: "",
    passwordNew: "",
    passwordRepeat: "",
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

  const updateContent = () => {
    dispatch(updatePassword(currentUser.uuid, data))
      .then((response) => {
        swal("Success", "Password berhasil diperbarui!", "success", {
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

        <TextField
          type="password"
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordOld"
          label="Password Lama"
          name="passwordOld"
          value={data.passwordOld}
          onChange={handleInputChange}
          autoComplete="passwordOld"
          autoFocus
        />
        <TextField
          type="password"
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordNew"
          label="Password Baru"
          name="passwordNew"
          value={data.passwordNew}
          onChange={handleInputChange}
          autoComplete="passwordNew"
          autoFocus
        />
        <TextField
          type="password"
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordRepeat"
          label="Ulangi Password Baru"
          name="passwordRepeat"
          value={data.passwordRepeat}
          onChange={handleInputChange}
          autoComplete="passwordRepeat"
          autoFocus
        />
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

PasswordDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default PasswordDialog;
