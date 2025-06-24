import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { retrieve } from "src/redux/actions/tematik";
import {
  create,
  update,
  remove,
} from "src/redux/actions/dataPerbaikanProdusen";

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
  CircularProgress,
  Divider,
  Tooltip
} from "@mui/material";
import swal from "sweetalert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import environment from "src/config/environment";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const { onClose, open, config } = props;
  const { user: currentUser } = useSelector((state) => state.auth);
  const tematiks = useSelector((state) => state.tematik);

  const initialState = {
    user: currentUser,
  };
  const [data, setData] = useState(initialState);
  const [dataPemeriksaan, setDataPemeriksaan] = useState();

  const [selectedIgt, setSelectedIgt] = useState(tematiks[0]?.name);

  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState();
  const [selectedMetadataFiles, setSelectedMetadataFiles] = useState();
  const [selectedDataSpasialFiles, setSelectedDataSpasialFiles] = useState();

  const [documentName, setDocumentName] = useState();
  const [metadataName, setMetadataName] = useState();
  const [dataSpasialName, setDataSpasialName] = useState();

  const [currentFile, setCurrentFile] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fileErrors, setFileErrors] = useState({
    document: "",
    metadata: "",
    dataSpasial: "",
  });

  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
  }, []);

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
        case 'document':
          allowedTypes = process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES.split(',');
          maxSize = process.env.REACT_APP_MAX_DOCUMENT_SIZE * 1024 * 1024; // Convert MB to bytes
          errorMessage = `Dokumen harus berupa ${allowedTypes.join(', ')} dan maks ${process.env.REACT_APP_MAX_DOCUMENT_SIZE} MB`;
          break;
        case 'metadata':
          allowedTypes = ['.xml'];
          maxSize = process.env.REACT_APP_MAX_METADATA_SIZE * 1024 * 1024;
          errorMessage = `Metadata harus berupa .xml dan maks ${process.env.REACT_APP_MAX_METADATA_SIZE} MB`;
          break;
        case 'dataSpasial':
          allowedTypes = ['.zip'];
          maxSize = process.env.REACT_APP_MAX_SPASIAL_SIZE * 1024 * 1024;
          errorMessage = `Data Spasial harus berupa .zip dan maks ${process.env.REACT_APP_MAX_SPASIAL_SIZE} MB`;
          break;
        default:
          return false;
      }
  
      // Check file extension
      const fileExtension = '.' + file?.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
        return false;
      }
  
      // Check file size
      if (file?.size > maxSize) {
        setFileErrors(prev => ({ ...prev, [type]: errorMessage }));
        return false;
      }
  
      return true;
    };

  const selectDocumentFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, 'document')) {
      setSelectedDocumentFiles(e.target.files);
      setDocumentName(file?.name);
    }
  };
  const selectMetadataFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, 'metadata')) {
      setSelectedMetadataFiles(e.target.files);
      setMetadataName(file?.name);
    }
  };
  const selectDataSpasialFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, 'dataSpasial')) {
      setSelectedDataSpasialFiles(e.target.files);
      setDataSpasialName(file?.name);
    }
  };

  const handleClose = () => {
    onClose();
        // Reset file errors when closing
        setFileErrors({
          document: "",
          metadata: "",
          dataSpasial: "",
        });
      
        // Reset form data to initial state
        setData(initialState);
      
        // Reset file-related states
        setSelectedDocumentFiles(undefined);
        setSelectedMetadataFiles(undefined);
        setSelectedDataSpasialFiles(undefined);
        setDocumentName(undefined);
        setMetadataName(undefined);
        setDataSpasialName(undefined);
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        console.log(config);
        console.log(config.data);
        setDataPemeriksaan(config.data);
        //setData({ ...data, ["dataPemeriksaan"]: config.data });
        //console.log(data);
        //setData();
      }
    }
  }, [config]);

  function isValidated() {
    //console.log(user);
    return (
      selectedDocumentFiles && selectedMetadataFiles && selectedDataSpasialFiles &&
      !fileErrors.document &&
      !fileErrors.metadata &&
      !fileErrors.dataSpasial
    );
  }
  const save = (e) => {
    e.preventDefault();
    if (isValidated()) {
      const { user } = data;
      let documentFile = selectedDocumentFiles[0];
      let metadataFile = selectedMetadataFiles[0];
      let dataSpasialFile = selectedDataSpasialFiles[0];
      //console.log(data);
      setIsLoading(true);

      dispatch(
        create(
          user,
          dataPemeriksaan,
          documentFile,
          metadataFile,
          dataSpasialFile
        )
      )
        .then((data) => {
          //console.log(data);

          //setSubmitted(true);
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
          setIsLoading(false);

          setSelectedDocumentFiles();
          setDocumentName("");

          setSelectedMetadataFiles();
          setMetadataName("");

          setSelectedDataSpasialFiles();
          setDataSpasialName("");
          //console.log(data);
        })
        .catch((e) => {
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          setIsLoading(false);

          console.log(e);
        });
    } else {
      swal("Error", "Cek isian formulir!", "error", {
        buttons: false,
        timer: 2000,
      });
      setIsLoading(false);
    }
  };

  const updateContent = () => {
    dispatch(update(data.uuid, data))
      .then((response) => {
        console.log(response);
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

  const removeData = () => {
    dispatch(remove(data.uuid))
      .then(() => {
        swal("Success", "Data berhasil dihapus!", "success", {
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

        <>
    {/* Note for Document Upload */}
    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
      Maksimal ukuran: {process.env.REACT_APP_MAX_DOCUMENT_SIZE} MB. Tipe file yang diperbolehkan: {process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES}
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
          Upload Dokumen Referensi&nbsp;
            <Tooltip title="Wajib diisi">
              <Typography component="span" color="error">
                *
              </Typography>
            </Tooltip>
          <input type="file" hidden onChange={selectDocumentFile} accept={process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES} />
        </Button>
      </Box>
      {documentName ? <Box mr={1}>{documentName}</Box> : ""}
    </Box>
    {fileErrors.document && (
      <Typography color="error" variant="body2">
        {fileErrors.document}
      </Typography>
    )}

        {/* Divider after document upload */}
        <Divider sx={{ my: 1 }} />

    {/* Note for Metadata Upload */}
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
          Upload Metadata (.xml)&nbsp;
            <Tooltip title="Wajib diisi">
              <Typography component="span" color="error">
                *
              </Typography>
            </Tooltip>
          <input type="file" hidden onChange={selectMetadataFile} accept={process.env.REACT_APP_ALLOWED_METADATA_TYPES} />
        </Button>
      </Box>
      {metadataName ? <Box mr={1}>{metadataName}</Box> : ""}
    </Box>
    {fileErrors.metadata && (
      <Typography color="error" variant="body2">
        {fileErrors.metadata}
      </Typography>
    )}

    {/* Divider after document upload */}
    <Divider sx={{ my: 1 }} />

    {/* Note for Spatial Data Upload */}
    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
      Maksimal ukuran: {process.env.REACT_APP_MAX_SPASIAL_SIZE} MB. Tipe file yang diperbolehkan: {process.env.REACT_APP_ALLOWED_SPASIAL_TYPES}
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
          Upload Data Spasial (.zip)&nbsp;
            <Tooltip title="Wajib diisi">
              <Typography component="span" color="error">
                *
              </Typography>
            </Tooltip>
          <input type="file" hidden onChange={selectDataSpasialFile} accept={process.env.REACT_APP_ALLOWED_SPASIAL_TYPES} />
        </Button>
      </Box>
      {dataSpasialName ? <Box mr={1}>{dataSpasialName}</Box> : ""}
    </Box>
    {fileErrors.dataSpasial && (
      <Typography color="error" variant="body2">
        {fileErrors.dataSpasial}
      </Typography>
    )}
  </>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "perbaikan" ? (
          isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={save} variant="contained">
              {config.action}
            </Button>
          )
        ) : (
          <Button onClick={removeData} variant="contained">
            {config.action}
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
