import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, update, remove } from "src/redux/actions/eksternal-user";
import { retrieve } from "src/redux/actions/eksternal";
import { retrieveUserEksternal } from "src/redux/actions/user";

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
  const { user: currentUser } = useSelector((state) => state.auth);
  const eksternals = useSelector((state) => state.eksternal);
  const users = useSelector((state) => state.user);

  const initialDataState = {
    eksternal: eksternals[0],
    user: users[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedEksternal, setSelectedEksternal] = useState(
    eksternals[0]?.name
  );
  const [selectedUser, setSelectedUser] = useState(users[0]?.username);

  const [loading, setLoading] = useState(false);
  //const kategoriOptions = [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveUserEksternal());
    }
  }, []);
  const handleEksternalChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedEksternal(value);
    var a = eksternals.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["eksternal"]: a[0] });
  };

  const handleUserChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedUser(value);
    var a = users.filter(function (el) {
      return el.username == value;
    });

    setData({ ...data, ["user"]: a[0] });
  };
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        setSelectedUser(config.data.username);
        var a = eksternals.filter(function (el) {
          return el.name == config.eksternal?.name;
        });
        //setSelectedBpkhtl(config.data.bpkhtls[0]?.name);
        setData({ ...data, ["eksternal"]: a[0] });

        var b = users.filter(function (el) {
          return el.username == config.data.username;
        });

        setData({ ...data, ["user"]: b[0] });
      } else {
        setData(initialDataState);
        setSelectedEksternal(config.eksternal?.name);
        setSelectedUser(users[0]?.username);
        setData({ eksternal: config.eksternal, user: users[0] });
      }
    }
  }, [config]);

  const save = (e) => {
    e.preventDefault();
    const { eksternal, user } = data;
    setLoading(true);
    dispatch(create(eksternal, user))
      .then((data) => {
        //console.log(data);
        //setSubmitted(true);
        setLoading(false);
        swal("Success", "Data berhasil disimpan!", "success", {
          buttons: false,
          timer: 2000,
        });
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

    dispatch(remove(data))
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
            disabled={true}
          >
            <InputLabel>Eksternal</InputLabel>
            <Select
              value={selectedEksternal ?? ""}
              onChange={handleEksternalChange}
              label="Eksternal"
              key="eksternal"
              autoWidth
            >
              {eksternals.map((data) => (
                <MenuItem key={data.uuid} value={data.name}>
                  {data.name}
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
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUser ?? ""}
              onChange={handleUserChange}
              label="User"
              autoWidth
            >
              {users.map((lokasi) => (
                <MenuItem key={lokasi.uuid} value={lokasi.username}>
                  {lokasi.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
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
