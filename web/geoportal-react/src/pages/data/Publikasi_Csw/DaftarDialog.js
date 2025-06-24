import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  retrievePublik,
  create,
  remove,
  update,
} from "src/redux/actions/publikasi_csw";

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
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import swal from "sweetalert";
import { blue } from "@mui/material/colors";

import environment from "src/config/environment";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Publikasi_cswDialog(props) {
  const { onClose, open, config } = props;
  const initialDataState = {
    nama_publikasi_csw: "",
  };

  const [data, setData] = useState(initialDataState);
  const [metadataName, setMetadataName] = useState();
  const [selectedMetadataFiles, setSelectedMetadataFiles] = useState();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    onClose();

    // Reset file errors when closing
    setFileErrors({
      metadata: "",
    });
  
    // Reset form data to initial state
    setData(initialDataState);
  
    // Reset file-related states
    setSelectedMetadataFiles(undefined);
    setMetadataName(undefined);
  };

  
  const [fileErrors, setFileErrors] = useState({
    metadata: "",
  });

  useEffect(() => {
    if (config) {
      if (config.data) {
        setData(config.data);
      } else {
        setData(initialDataState);
      }
    }
  }, [config]);

  
    // Validate file based on type and size
    const validateFile = (file, type) => {
      // Reset previous error
      setFileErrors(prev => ({ ...prev, [type]: "" }));
  
      // Check file exists
      if (!file) {
        return true;
      }
  
      let allowedTypes, maxSize, errorMessage;
  
      // Set restrictions based on file type
      switch (type) {
        // case 'document':
        //   allowedTypes = process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES.split(',');
        //   maxSize = process.env.REACT_APP_MAX_DOCUMENT_SIZE * 1024 * 1024; // Convert MB to bytes
        //   errorMessage = `Dokumen harus berupa ${allowedTypes.join(', ')} dan maks ${process.env.REACT_APP_MAX_DOCUMENT_SIZE} MB`;
        //   break;
        case 'metadata':
          allowedTypes = ['.xml'];
          maxSize = process.env.REACT_APP_MAX_METADATA_SIZE * 1024 * 1024;
          errorMessage = `Metadata harus berupa .xml dan maks ${process.env.REACT_APP_MAX_METADATA_SIZE} MB`;
          break;
        // case 'dataSpasial':
        //   allowedTypes = ['.zip'];
        //   maxSize = process.env.REACT_APP_MAX_SPASIAL_SIZE * 1024 * 1024;
        //   errorMessage = `Data Spasial harus berupa .zip dan maks ${process.env.REACT_APP_MAX_SPASIAL_SIZE} MB`;
        //   break;
        default:
          return false;
      }
  
      // Check file extension
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
        return false;
      }
  
      // Check file size
      if (file.size > maxSize) {
        setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
        return false;
      }
  
      return true;
    };

  function isValidated() {
    //console.log(user);
    return (selectedMetadataFiles && !fileErrors.metadata
    );
  }

  const selectMetadataFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, 'metadata')) {
      setSelectedMetadataFiles(e.target.files);
      setMetadataName(file.name);
    }
  };

  const save = (e) => {
    e.preventDefault();
    const { uuid } = data;

    if (isValidated()) {
      setLoading(true);
      let metadataFile = selectedMetadataFiles[0];

      dispatch(create(uuid, metadataFile))
        .then((data) => {
          console.log(data);
          setLoading(false);
          swal("Success", "Metadata berhasil dipublish!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
          setData(initialDataState);

          dispatch(retrievePublik());
        })
        .catch((e) => {
          setLoading(false);
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 7000,
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

    dispatch(remove(data.uuid))
      .then(() => {
        setLoading(false);

        swal("Success", "Data berhasil dihapus!", "success", {
          buttons: false,
          timer: 2000,
        });
        onClose();
      })
      .catch((e) => {
        setLoading(true);

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
                  {config.mode == "delete" ? (
            ""
          ) : (
            <>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Maksimal ukuran: {process.env.REACT_APP_MAX_METADATA_SIZE} MB. Tipe file yang diperbolehkan: {process.env.REACT_APP_ALLOWED_METADATA_TYPES}
            </Typography>
            <Box
              className="mb25"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ marginRight: "1rem" }}
                >
                  Upload Metadata (.xml)
                  <input type="file" hidden onChange={selectMetadataFile} accept={process.env.REACT_APP_ALLOWED_METADATA_TYPES} />
                </Button>
              </Box>
              {metadataName ? <Box mr={1}>{metadataName}</Box> : null}
            </Box>
            </>
          )}
            {fileErrors.metadata && (
              <Typography color="error" variant="body2">
                {fileErrors.metadata}
              </Typography>
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

Publikasi_cswDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
};

export default Publikasi_cswDialog;
