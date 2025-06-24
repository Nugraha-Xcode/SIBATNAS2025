import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { create, remove, update } from "src/redux/actions/unsur";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
  TextField,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import swal from "sweetalert";
import { blue } from "@mui/material/colors";
import { importUnsur } from "src/redux/actions/unsur";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UnsurDialog(props) {
  const { onClose, open } = props;
  const initialDataState = {
    nama_unsur: "",
  };
  const [data, setData] = useState(initialDataState);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState();
  const [progress, setProgress] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    onClose();
  };

  function isValidated() {
    //console.log(user);
    return selectedFiles;
  }

  const selectFile = (e) => {
    if (!e.target.files) {
      return;
    }
    setSelectedFiles(e.target.files);
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
  };

  const importExcel = (e) => {
    e.preventDefault();
    if (isValidated()) {
      setLoading(true);
      let currentFile = selectedFiles[0];
      //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
      dispatch(
        importUnsur(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
      )
        .then((data) => {
          //setSubmitted(true);
          swal("Success", "Lokasi berhasil ditambahkan!", "success", {
            buttons: false,
            timer: 2000,
          });
          setLoading(false);
          onClose();
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
          swal("Error", e.message, "error", {
            buttons: false,
            timer: 2000,
          });
        });
    } else {
      setLoading(false);

      swal("Error", "Cek isian formulir!", "error", {
        buttons: false,
        timer: 2000,
      });
    }
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
      <DialogTitle>Upload File Excel</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Pastikan kolom pada file excel sudah sesuai.
        </DialogContentText>
        {currentFile && (
          <Box className="mb25" display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${progress}%`}</Typography>
            </Box>
          </Box>
        )}
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFileIcon />}
          sx={{ marginRight: "1rem" }}
        >
          Upload Excel (*)
          <input type="file" hidden onChange={selectFile} />
        </Button>
        {selectedFiles ? selectedFiles[0].name : ""}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>

        <Button onClick={importExcel} variant="contained">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UnsurDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default UnsurDialog;
