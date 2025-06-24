import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { create, update, remove } from "src/redux/actions/produsen-user";
import { retrieve } from "src/redux/actions/produsen";
import { retrieveUserProdusen } from "src/redux/actions/user";

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
  const produsens = useSelector((state) => state.produsen);
  const users = useSelector((state) => state.user);

  const initialDataState = {
    produsen: produsens[0],
    user: users[0],
  };
  const [data, setData] = useState(initialDataState);
  const [selectedProdusen, setSelectedProdusen] = useState(produsens[0]?.name);
  const [selectedUser, setSelectedUser] = useState(users[0]?.username);

  const [loading, setLoading] = useState(false);
  //const kategoriOptions = [];
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
      dispatch(retrieveUserProdusen());
    }
  }, []);

// Untuk handleUserChange
const handleUserChange = (e) => {
  let value = null;

  if (e.target.value !== "all") {
    value = e.target.value;
  }

  setSelectedUser(value);
  const selectedUserObj = users.find((user) => user.username === value);
  
  // Gunakan fungsi updater untuk memastikan menggunakan state terbaru
  setData(prevData => ({ 
    ...prevData, 
    user: selectedUserObj 
  }));
};

// Perbaikan serupa untuk handleProdusenChange
const handleProdusenChange = (e) => {
  let value = null;

  if (e.target.value !== "all") {
    value = e.target.value;
  }

  setSelectedProdusen(value);
  const selectedProdusenObj = produsens.find((produsen) => produsen.name === value);
  
  setData(prevData => ({ 
    ...prevData, 
    produsen: selectedProdusenObj 
  }));
};

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (config) {
      if (config.data) {
        const updatedData = {...config.data};
        
        // Jika produsen tidak ada, ambil dari config atau dari produsens
        if (!updatedData.produsen) {
          if (config.produsen) {
            updatedData.produsen = config.produsen;
          } else if (updatedData.produsens && updatedData.produsens.length > 0) {
            updatedData.produsen = updatedData.produsens[0];
          } else if (produsens && produsens.length > 0) {
            updatedData.produsen = produsens[0];
          }
        }
        
        // Pastikan user juga ada
        if (!updatedData.user && updatedData.uuid) {
          updatedData.user = {
            uuid: updatedData.uuid,
            username: updatedData.username
          };
        }
        
        setData(updatedData);
        setSelectedUser(updatedData.user?.username || updatedData.username);
        setSelectedProdusen(updatedData.produsen?.name);
      } else {
        // Inisialisasi dengan produsen dari config dan user default
        const produsenObj = config.produsen || produsens[0];
        const userObj = users[0];
        
        setData({
          produsen: produsenObj,
          user: userObj
        });
        
        setSelectedProdusen(produsenObj?.name);
        setSelectedUser(userObj?.username);
      }
    }
  }, [config, produsens, users]);

  const save = (e) => {
    e.preventDefault();
    const { produsen, user } = data;
    setLoading(true);
    dispatch(create(produsen, user))
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
    
    // Buat salinan data untuk dikirim
    let dataToRemove = {...data};
    
    // Jika produsen undefined, tetapi produsens ada dan memiliki minimal 1 item
    if (!dataToRemove.produsen && dataToRemove.produsens && dataToRemove.produsens.length > 0) {
      // Gunakan produsen dari config jika tersedia, atau produsen pertama dari array produsens
      dataToRemove.produsen = config.produsen || dataToRemove.produsens[0];
    }
    
    // Pastikan user juga ada
    if (!dataToRemove.user && dataToRemove.uuid) {
      dataToRemove.user = {
        uuid: dataToRemove.uuid,
        username: dataToRemove.username
      };
    }
    
    //console.log("Data final untuk penghapusan:", dataToRemove);
    
    // Pastikan data sekarang lengkap
    if (!dataToRemove.produsen || !dataToRemove.produsen.uuid || !dataToRemove.user || !dataToRemove.user.uuid) {
      console.error("Data masih tidak lengkap:", dataToRemove);
      setLoading(false);
      swal("Error", "Data tidak lengkap untuk penghapusan", "error", {
        buttons: false,
        timer: 2000,
      });
      return;
    }
    
    dispatch(remove(dataToRemove))
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
        swal("Error", e.response?.data?.message || "Terjadi kesalahan", "error", {
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
            <InputLabel>Produsen</InputLabel>
            <Select
              value={selectedProdusen ?? ""}
              onChange={handleProdusenChange}
              label="Produsen"
              key="bpkhtl"
              autoWidth
            >
              {produsens.map((data) => (
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
