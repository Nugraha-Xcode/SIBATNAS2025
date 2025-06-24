import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { publish, remove, unpublish } from "src/redux/actions/dataPublikasi";

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
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        setData(config.data);
        // Set isPublic state from the data if it exists
        setIsPublic(config.data.is_public || false);
        //console.log(config.data);
        // setSelectedStatus(config.data.statusPemeriksaan.name);
      }
      setProcessingMessage(config.description);
    }
  }, [config]);
  
  const updateContent = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProcessingMessage("Memproses publikasi data...");
    dispatch(publish(data.uuid, currentUser, isPublic))
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        swal("Success", "Data berhasil dipublish!", "success", {
          buttons: false,
          timer: 2000,
        });

        onClose();
      })
      .catch((e) => {
        setIsLoading(false);
        setProcessingMessage(config.description);
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const unpublishData = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProcessingMessage("Memproses unpublish data...");
    dispatch(unpublish(data.uuid, currentUser))
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        swal("Success", "Data berhasil diunpublish!", "success", {
          buttons: false,
          timer: 2000,
        });
        onClose();
      })
      .catch((e) => {
        setIsLoading(false);
        setProcessingMessage(config.description);
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
      });
  };

  const removeData = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProcessingMessage("Menghapus data...");
    dispatch(remove(data.uuid))
      .then(() => {
        setIsLoading(false);
        swal("Success", "Data berhasil dihapus!", "success", {
          buttons: false,
          timer: 2000,
        });
        onClose();
      })
      .catch((e) => {
        setIsLoading(false);
        setProcessingMessage(config.description);
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
        {isLoading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress />
          </Box>
        )}
        <DialogContentText>{processingMessage}</DialogContentText>
        
        {/* Add the dropdown for is_public - only show in edit/publish mode */}
        {config.mode === "edit" && (
          <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Izinkan Publik Unduh Data?
          </Typography>
          <FormControl fullWidth margin="dense">
            <Select
              id="is-public-select"
              value={isPublic}
              onChange={(e) => setIsPublic(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value={true}>Ya, izinkan publik mengunduh data</MenuItem>
              <MenuItem value={false}>Tidak</MenuItem>
            </Select>
          </FormControl>
        </Box>        
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          Cancel
        </Button>
        {config.mode == "edit" ? (
          <Button 
            onClick={updateContent} 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : config.action}
          </Button>
        ) : config.mode === "delete" ? (
          <Button 
            onClick={removeData} 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : config.action}
          </Button>
        ) : (
          <Button 
            onClick={unpublishData} 
            variant="contained" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : config.action}
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