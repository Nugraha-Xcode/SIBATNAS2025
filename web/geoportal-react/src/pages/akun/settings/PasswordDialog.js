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
  InputAdornment,
  IconButton,
} from "@mui/material";

import swal from "sweetalert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  // Track password visibility for each field separately
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  
  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    onClose();
    // Reset form data and visibility states when closing the dialog
    setData(initialDataState);
    setShowPasswordOld(false);
    setShowPasswordNew(false);
    setShowPasswordRepeat(false);
  };

  // Toggle handlers for each password field
  const togglePasswordOldVisibility = () => {
    setShowPasswordOld(!showPasswordOld);
  };

  const togglePasswordNewVisibility = () => {
    setShowPasswordNew(!showPasswordNew);
  };

  const togglePasswordRepeatVisibility = () => {
    setShowPasswordRepeat(!showPasswordRepeat);
  };

  const updateContent = () => {
    dispatch(updatePassword(currentUser.uuid, data))
      .then((response) => {
        swal("Success", "Password berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });

        // Reset form data before closing
        setData(initialDataState);
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
          type={showPasswordOld ? "text" : "password"}
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordOld"
          label="Password Lama"
          name="passwordOld"
          value={data.passwordOld}
          onChange={handleInputChange}
          autoComplete="current-password"
          autoFocus
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordOldVisibility}
                  edge="end"
                >
                  {showPasswordOld ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type={showPasswordNew ? "text" : "password"}
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordNew"
          label="Password Baru"
          name="passwordNew"
          value={data.passwordNew}
          onChange={handleInputChange}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordNewVisibility}
                  edge="end"
                >
                  {showPasswordNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type={showPasswordRepeat ? "text" : "password"}
          helperText=""
          margin="normal"
          required
          fullWidth
          id="passwordRepeat"
          label="Ulangi Password Baru"
          name="passwordRepeat"
          value={data.passwordRepeat}
          onChange={handleInputChange}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordRepeatVisibility}
                  edge="end"
                >
                  {showPasswordRepeat ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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