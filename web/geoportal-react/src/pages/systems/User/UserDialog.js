import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  create,
  deleteUser,
  updateUser,
  resetPassword,
} from "src/redux/actions/user";

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

function UserDialog(props) {
  const { onClose, open, config } = props;
  const roles = useSelector((state) => state.role);
  const [loading, setLoading] = useState(false);
  const initialUserState = {
    uuid: null,
    username: "",
    email: "",
    password: "",
    roles: roles[0],
  };

  const [user, setUser] = useState(initialUserState);
  const [selectedRole, setSelectedRole] = useState(roles[0]?.name);

  // const [submitted, setSubmitted] = useState(false);
  //const kategoriOptions = [];
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleRoleChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedRole(value);
    var a = roles.filter(function (el) {
      return el.name == value;
    });

    setUser({ ...user, ["roles"]: a });
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
      if (config.user) {
        //console.log(config.user);
        setUser(config.user);
        setSelectedRole(config.user.roles[0]?.name);
      } else {
        setUser(initialUserState);
        setSelectedRole(config.role?.name);
        setUser({ ...user, ["roles"]: config.role });
      }
    }
  }, [config]);

  function isValidated() {
    //console.log(user);
    return (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    );
  }
  const saveUser = (e) => {
    e.preventDefault();
    const { username, email, password, roles } = user;
    if (isValidated()) {
      setLoading(true);
      dispatch(create(username, email, password, roles))
        .then((data) => {
          //console.log(data);

          //setSubmitted(true);
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          setLoading(false);
          setUser(initialUserState);
          onClose();

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

    dispatch(updateUser(user.uuid, user))
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
  const resetPass = (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(resetPassword(user.uuid))
      .then((response) => {
        console.log(response);
        setLoading(false);

        swal("Success", "Password berhasil direset!", "success", {
          buttons: false,
          timer: 2000,
        });

        onClose();
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);

        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
      });
  };

  const removeUser = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(deleteUser(user.uuid))
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
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole ?? ""}
            onChange={handleRoleChange}
            label="Role"
            autoWidth
          >
            {roles.map((role) =>
              role.name != "admin" ? (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ) : null
            )}
          </Select>
        </FormControl>
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          value={user.username}
          onChange={handleInputChange}
          autoComplete="username"
          autoFocus
          disabled={config.mode == "reset" || config.mode == "delete"}
        />
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          type="email"
          autoComplete="email"
          autoFocus
          disabled={config.mode == "reset" || config.mode == "delete"}
        />
        {config.mode == "add" && (
          <TextField
            helperText=""
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            type="password"
            autoComplete="password"
            autoFocus
          />
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
            <Button onClick={saveUser} variant="contained" disabled={loading}>
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
          ) : config.mode == "reset" ? (
            <Button onClick={resetPass} variant="contained" disabled={loading}>
              {config.action}
            </Button>
          ) : (
            <Button onClick={removeUser} variant="contained" disabled={loading}>
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
