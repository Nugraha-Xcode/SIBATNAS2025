import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { retrieve, retrieveAllUser } from "src/redux/actions/tematik";
import { create, update, remove } from "src/redux/actions/dataProdusen";

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

  const [currentFile, setCurrentFile] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentUser);
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      dispatch(retrieve());
    } else if (currentUser.roles.includes("ROLE_PRODUSEN")) {
      //dispatch(retrieveAllData()); // per igt milik produsen
      dispatch(retrieveAllUser(currentUser.uuid));
    }
  }, []);

  const selectDocumentFile = (e) => {
    if (!e.target.files) {
      return;
    }
    setSelectedDocumentFiles(e.target.files);
    setDocumentName(e.target.files[0].name);
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
  };
  const selectMetadataFile = (e) => {
    if (!e.target.files) {
      return;
    }
    setSelectedMetadataFiles(e.target.files);
    setMetadataName(e.target.files[0].name);
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
  };
  const selectDataSpasialFile = (e) => {
    if (!e.target.files) {
      return;
    }
    setSelectedDataSpasialFiles(e.target.files);
    setDataSpasialName(e.target.files[0].name);
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
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
  };

  useEffect(() => {
    if (config) {
      console.log(config);
      if (config.data) {
        console.log(config.data);
        setData(config.data);
      } else {
        setData(initialState);
      }
    }
  }, [config]);

  const save = () => {
    const { deskripsi, user, tematik } = data;
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
        //console.log(data);

        //setSubmitted(true);
        swal("Success", "Data berhasil disimpan!", "success", {
          buttons: false,
          timer: 2000,
        });
        onClose();
        setIsLoading(false);

        //console.log(data);
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

  const updateContent = () => {
    setIsLoading(true);
    dispatch(update(data.uuid, data))
      .then((response) => {
        console.log(response);
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

        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <InputLabel>Pilih IGT</InputLabel>
          <Select
            value={selectedIgt}
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
        />
        {config.mode == "delete" ? (
          ""
        ) : (
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
                Upload Dokumen Referensi
                <input type="file" hidden onChange={selectDocumentFile} />
              </Button>
            </Box>
            {documentName ? <Box mr={1}>{documentName}</Box> : ""}
          </Box>
        )}
        {config.mode == "delete" ? (
          ""
        ) : (
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
                <input type="file" hidden onChange={selectMetadataFile} />
              </Button>
            </Box>
            {metadataName ? <Box mr={1}>{metadataName}</Box> : ""}
          </Box>
        )}
        {config.mode == "delete" ? (
          ""
        ) : (
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
                Upload Data Spasial (.zip)
                <input type="file" hidden onChange={selectDataSpasialFile} />
              </Button>
            </Box>
            {dataSpasialName ? <Box mr={1}>{dataSpasialName}</Box> : ""}
          </Box>
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
