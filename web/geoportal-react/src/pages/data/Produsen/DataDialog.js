import { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  retrieve,
  retrieveAllUser,
  retrieveTematikProdusen,
} from "src/redux/actions/tematik";
import { create, update, remove } from "src/redux/actions/dataProdusen";

import PropTypes from "prop-types";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Grid,
  Slide,
  Select,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Divider,
  Tooltip
} from "@mui/material";
import swal from "sweetalert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function KategoriDialog(props) {
  const { onClose, open, config } = props;
  const { user: currentUser } = useSelector((state) => state.auth);
  const tematiks = useSelector((state) => state.tematik);

  const initialState = {
    deskripsi: "",
    user: currentUser,
    tematik: tematiks[0],
  };
  const [data, setData] = useState(initialState);
  const [selectedIgt, setSelectedIgt] = useState(tematiks[0]?.name);

  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState();
  const [selectedMetadataFiles, setSelectedMetadataFiles] = useState();
  const [selectedDataSpasialFiles, setSelectedDataSpasialFiles] = useState();

  const [documentName, setDocumentName] = useState();
  const [metadataName, setMetadataName] = useState();
  const [dataSpasialName, setDataSpasialName] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [fileErrors, setFileErrors] = useState({
    document: "",
    metadata: "",
    dataSpasial: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      //dispatch(retrieveTematikProdusen(config?.produsen?.uuid));
      dispatch(retrieve());
    } else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
      dispatch(retrieveAllUser(currentUser.uuid));
    }
  }, []);

  // Handler input box file upload 
useEffect(() => {
  if (open) {
    // Reset input file elements
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = "";
    });
  }
}, [open]);

  // Validate file based on type and size
  const validateFile = (file, type) => {
    // Reset previous error
    setFileErrors((prev) => ({ ...prev, [type]: "" }));

    // Check file exists
    if (!file) {
      return true;
    }

    let allowedTypes, maxSize, errorMessage;

    // Set restrictions based on file type
    switch (type) {
      case "document":
        allowedTypes = process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES.split(",");
        maxSize = process.env.REACT_APP_MAX_DOCUMENT_SIZE * 1024 * 1024; // Convert MB to bytes
        errorMessage = `Dokumen harus berupa ${allowedTypes.join(
          ", "
        )} dan maks ${process.env.REACT_APP_MAX_DOCUMENT_SIZE} MB`;
        break;
      case "metadata":
        allowedTypes = [".xml"];
        maxSize = process.env.REACT_APP_MAX_METADATA_SIZE * 1024 * 1024;
        errorMessage = `Metadata harus berupa .xml dan maks ${process.env.REACT_APP_MAX_METADATA_SIZE} MB`;
        break;
      case "dataSpasial":
        allowedTypes = [".zip"];
        maxSize = process.env.REACT_APP_MAX_SPASIAL_SIZE * 1024 * 1024;
        errorMessage = `Data Spasial harus berupa .zip dan maks ${process.env.REACT_APP_MAX_SPASIAL_SIZE} MB`;
        break;
      default:
        return false;
    }

    // Check file extension
    const fileExtension = "." + file?.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setFileErrors((prev) => ({ ...prev, [type]: errorMessage }));
      return false;
    }

    // Check file size
    if (file?.size > maxSize) {
      setFileErrors((prev) => ({ ...prev, [type]: errorMessage }));
      return false;
    }

    return true;
  };

  const selectDocumentFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, "document")) {
      setSelectedDocumentFiles(e.target.files);
      setDocumentName(file?.name);
    }
  };

  const selectMetadataFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, "metadata")) {
      setSelectedMetadataFiles(e.target.files);
      setMetadataName(file?.name);
    }
  };

  const selectDataSpasialFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, "dataSpasial")) {
      setSelectedDataSpasialFiles(e.target.files);
      setDataSpasialName(file?.name);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleIGTChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedIgt(value);
    var a = tematiks.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["tematik"]: a[0] });
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
    setSelectedIgt(tematiks[0]?.name);
  };


  useEffect(() => {
    if (config) {
      //console.log(config.produsen);
      dispatch(retrieveAllUser(currentUser.uuid));

      if (config.data) {
        setData(config.data);
      } else {
        setData(initialState);
      }
    }
  }, [config]);

  console.log("tematiks", tematiks[0]);

  useEffect(() => {
    if (tematiks.length > 0) {
      setSelectedIgt(tematiks[0]?.name);
      setData((prevData) => ({
        ...prevData,
        tematik: tematiks[0],
      }));
    }
  }, [tematiks]);

  function isValidated() {
    return (
      data.deskripsi.length > 0 &&
      selectedDocumentFiles &&
      selectedMetadataFiles &&
      selectedDataSpasialFiles &&
      !fileErrors.document &&
      !fileErrors.metadata &&
      !fileErrors.dataSpasial
    );
  }

  const save = (e) => {
    e.preventDefault();
    const { deskripsi, user, tematik } = data;
    //console.log("data", data);

    if (isValidated()) {
      let documentFile = selectedDocumentFiles[0];
      let metadataFile = selectedMetadataFiles[0];
      let dataSpasialFile = selectedDataSpasialFiles[0];
      setIsLoading(true);

      dispatch(
        create(
          deskripsi,
          user,
          tematik,
          documentFile,
          metadataFile,
          dataSpasialFile
        )
      )
        .then((data) => {
          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          handleClose();
          setIsLoading(false);
        })
        .catch((e) => {
          swal("Error", e.response.data.message, "error", {
            buttons: false,
            timer: 2000,
          });
          console.log(e);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);

      swal("Error", "Cek isian formulir!", "error", {
        buttons: false,
        timer: 2000,
      });
    }
  };

  const updateContent = () => {
    setIsLoading(true);
    dispatch(update(data.uuid, data))
      .then((response) => {
        swal("Success", "Data berhasil diperbarui!", "success", {
          buttons: false,
          timer: 2000,
        });

        onClose();
        setIsLoading(false);
      })
      .catch((e) => {
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
        setIsLoading(false);
      });
  };

  const removeData = () => {
    setIsLoading(true);
    dispatch(remove(data.uuid))
      .then(() => {
        swal("Success", "Data berhasil dihapus!", "success", {
          buttons: false,
          timer: 2000,
        });
        handleClose();
        setIsLoading(false);
      })
      .catch((e) => {
        swal("Error", e.response.data.message, "error", {
          buttons: false,
          timer: 2000,
        });
        console.log(e);
        setIsLoading(false);
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
          id="deskripsi"
          label="User"
          name="deskripsi"
          value={currentUser.username}
          autoComplete="deskripsi"
          autoFocus
          disabled
        />

        <FormControl
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          disabled={config.mode == "delete"}
        >
          <InputLabel>Pilih IGT</InputLabel>
          <Select
            value={selectedIgt ?? ""}
            onChange={handleIGTChange}
            label="IGT"
            key="igt"
            autoWidth
          >
            {tematiks.map((data) => (
              <MenuItem key={data.uuid} value={data.name}>
                {data.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          helperText=""
          margin="normal"
          required
          fullWidth
          id="deskripsi"
          label="Deskripsi"
          name="deskripsi"
          value={data.deskripsi}
          onChange={handleInputChange}
          autoComplete="deskripsi"
          autoFocus
          disabled={config.mode == "delete"}
        />
        {config.mode == "delete" ? (
          ""
        ) : (
          <>
            {/* Note for Document Upload */}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Maksimal ukuran: {process.env.REACT_APP_MAX_DOCUMENT_SIZE} MB. Tipe file
              yang diperbolehkan: {process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES}
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
                  <input
                    type="file"
                    hidden
                    onChange={selectDocumentFile}
                    accept={process.env.REACT_APP_ALLOWED_DOCUMENT_TYPES}
                  />
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
              Maksimal ukuran: {process.env.REACT_APP_MAX_METADATA_SIZE} MB. Tipe file
              yang diperbolehkan: {process.env.REACT_APP_ALLOWED_METADATA_TYPES}
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
                  <input
                    type="file"
                    hidden
                    onChange={selectMetadataFile}
                    accept={process.env.REACT_APP_ALLOWED_METADATA_TYPES}
                  />
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
              Maksimal ukuran: {process.env.REACT_APP_MAX_SPASIAL_SIZE} MB. Tipe file yang
              diperbolehkan: {process.env.REACT_APP_ALLOWED_SPASIAL_TYPES}
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
                  <input
                    type="file"
                    hidden
                    onChange={selectDataSpasialFile}
                    accept={process.env.REACT_APP_ALLOWED_SPASIAL_TYPES}
                  />
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "add" ? (
          isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={save} variant="contained">
              {config.action}
            </Button>
          )
        ) : config.mode == "edit" ? (
          isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={updateContent}
              variant="contained"
              disabled={isLoading}
            >
              {config.action}
            </Button>
          )
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <Button onClick={removeData} variant="contained" disabled={isLoading}>
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
