import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { retrieve } from "src/redux/actions/statusPemeriksaan";
import {
  create,
  update,
  remove,
  periksa,
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
  //const statuses = useSelector((state) => state.statusPemeriksaan);
  const kategoris = [
    {
      id: 1,
      nilai: "A",
      keterangan:
        "Nilai Kualitas Data 100 dan Metadata Lengkap, berarti IGT dapat disebarluaskan",
      status: "Sudah Diperiksa - Siap Publikasi",
    },
    {
      id: 2,
      nilai: "B",
      keterangan:
        "Nilai Kualitas Data 90-99 dan Metadata Lengkap, berarti IGT dapat disebarluaskan dengan Catatan",
      status: "Sudah Diperiksa - Siap Publikasi",
    },
    {
      id: 3,
      nilai: "C",
      keterangan:
        "Nilai Kualitas Data 100 dan Metadata Tidak Lengkap, berarti IGT belum dapat disebarluaskan dan perlu perbaikan Metadata",
      status: "Sudah Diperiksa - Perlu Perbaikan",
    },
    {
      id: 4,
      nilai: "D",
      keterangan:
        "Nilai Kualitas Data 90-99 dan Metadata Tidak Lengkap, berarti IGT belum dapat disebarluaskan, perlu perbaikan Kualitas Data (opsional) dan perbaikan Metadata",
      status: "Sudah Diperiksa - Perlu Perbaikan",
    },
    {
      id: 5,
      nilai: "E",
      keterangan:
        "Nilai Kualitas Data < 90 dan Metadata Lengkap, berarti IGT belum dapat disebarluaskan dan perlu perbaikan Kualitas Data",
      status: "Sudah Diperiksa - Perlu Perbaikan",
    },
    {
      id: 6,
      nilai: "F",
      keterangan:
        "Nilai Kualitas Data < 90 dan Metadata Tidak Lengkap, berarti IGT belum dapat disebarluaskan, dan perlu Perbaikan Kualitas Data dan Metadata",
      status: "Sudah Diperiksa - Perlu Perbaikan",
    },
  ];

  const initialState = {
    user: currentUser,
    kategori: kategoris[0],
  };
  const [data, setData] = useState(initialState);
  //const [selectedStatus, setSelectedStatus] = useState(statuses[0]?.name);
  const [selectedKategori, setSelectedKategori] = useState(kategoris[0]?.nilai);

  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState();

  const [documentName, setDocumentName] = useState();

  const [currentFile, setCurrentFile] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [submitted, setSubmitted] = useState(false);


  const [fileErrors, setFileErrors] = useState({
    document: "",
  });


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieve());
    //setSelectedStatus(statuses[0]?.name);
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
        allowedTypes = environment.ALLOWED_DOCUMENT_TYPES.split(',');
        maxSize = environment.MAX_DOCUMENT_SIZE * 1024 * 1024; // Convert MB to bytes
        errorMessage = `Dokumen harus berupa ${allowedTypes.join(', ')} dan maks ${environment.MAX_DOCUMENT_SIZE} MB`;
        break;
      // case 'metadata':
      //   allowedTypes = ['.xml'];
      //   maxSize = environment.MAX_METADATA_SIZE * 1024 * 1024;
      //   errorMessage = `Metadata harus berupa .xml dan maks ${environment.MAX_METADATA_SIZE} MB`;
      //   break;
      // case 'dataSpasial':
      //   allowedTypes = ['.zip'];
      //   maxSize = environment.MAX_SPASIAL_SIZE * 1024 * 1024;
      //   errorMessage = `Data Spasial harus berupa .zip dan maks ${environment.MAX_SPASIAL_SIZE} MB`;
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


  const selectDocumentFile = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (validateFile(file, 'document')) {
      setSelectedDocumentFiles(e.target.files);
      setDocumentName(file.name);
    }
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
  };

  /*
  const handleIGTChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedStatus(value);
    var a = statuses.filter(function (el) {
      return el.name == value;
    });

    setData({ ...data, ["status"]: a[0] });
  };
*/
  const handleKategoriChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setSelectedKategori(value);
    var a = kategoris.filter(function (el) {
      return el.nilai == value;
    });
    console.log(a);

    setData({ ...data, ["kategori"]: a[0] });
  };

  const handleClose = () => {
    onClose();
        // Reset file errors when closing
        setFileErrors({
          document: "",
        });
    
        // Reset form data to initial state
        setData(initialState);
      
        // Reset file-related states
        setSelectedDocumentFiles(undefined);
        setDocumentName(undefined);
  };

  useEffect(() => {
    if (config) {
      //console.log(config);
      if (config.data) {
        //console.log(data);
        setData({
          user: currentUser,
          kategori: kategoris[0],
          uuid: config.data.uuid,
          dataPerbaikanProdusen: config.data,
        });
        //setData({ ...data, {["uuid"]: config.data.uuid, ["dataProdusen"]: config.data.dataProdusen} });
        //setData(config.data);
        //console.log(config.data);

        // setSelectedStatus(config.data.statusPemeriksaan.name);
      } else {
        setData(initialState);
      }
    }
  }, [config]);
  function isValidated() {
    //console.log(user);
    return (selectedDocumentFiles &&
      !fileErrors.document);
  }

  const save = (e) => {
    e.preventDefault();
    console.log(data);
    const { user, kategori, dataPerbaikanProdusen, uuid } = data;
    //console.log(data);

    if (isValidated()) {
      //console.log(currentUser);
      setIsLoading(true);

      let kat = kategori;
      let us = user;

      if (kategori == null) {
        kat = kategoris[0];
      }
      if (user == null) {
        us = currentUser;
      }
      let documentFile = selectedDocumentFiles[0];

      dispatch(periksa(us, kat, dataPerbaikanProdusen, uuid, documentFile))
        .then((data) => {
          console.log(data);
          //setSubmitted(true);

          swal("Success", "Data berhasil disimpan!", "success", {
            buttons: false,
            timer: 2000,
          });
          onClose();
          setIsLoading(false);

          setSelectedDocumentFiles();
          setDocumentName("");

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
        {/*
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <InputLabel>Pilih Status Pemeriksaan</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleIGTChange}
            label="Status Pemeriksaan"
            key="status"
            autoWidth
          >
            {statuses.map((data) => (
              <MenuItem key={data.uuid} value={data.name}>
                {data.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={selectedKategori}
            onChange={handleKategoriChange}
            label="Kategori"
            key="kategori"
            autoWidth
          >
            {kategoris.map((data) => (
              <MenuItem key={data.id} value={data.nilai}>
                {data.nilai} - {data.keterangan}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
      Maksimal ukuran: {environment.MAX_DOCUMENT_SIZE} MB. Tipe file yang diperbolehkan: {environment.ALLOWED_DOCUMENT_TYPES}
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
          Upload Dokumen Referensi
          <input type="file" hidden onChange={selectDocumentFile} accept={environment.ALLOWED_DOCUMENT_TYPES} />
        </Button>
      </Box>
      {documentName ? <Box mr={1}>{documentName}</Box> : ""}
    </Box>
    {fileErrors.document && (
      <Typography color="error" variant="body2">
        {fileErrors.document}
      </Typography>
    )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        {config.mode == "periksa" ? (
          isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={save} variant="contained">
              {config.action}
            </Button>
          )
        ) : config.mode == "edit" ? (
          <Button onClick={updateContent} variant="contained">
            {config.action}
          </Button>
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
