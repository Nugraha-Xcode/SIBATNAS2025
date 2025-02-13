import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "src/redux/actions/user";

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

function ProfileDialog(props) {
  const { user: currentUser } = useSelector((state) => state.auth);

  const { onClose, open, config } = props;
  const initialDataState = {
    email: currentUser.email,
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
    dispatch(updateProfile(currentUser.uuid, data))
      .then((response) => {
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
          id="uuid"
          label="UUID"
          name="uuid"
          value={currentUser.uuid}
          autoComplete="uuid"
          disabled
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          value={currentUser.username}
          autoComplete="username"
          disabled
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          autoComplete="email"
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

ProfileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default ProfileDialog;
