import { forwardRef, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";

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

  const removeData = () => {
    onClose();
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
        <Typography variant="h6" component="h6" gutterBottom>
          {config.data?.subjek}
        </Typography>
        <DialogContentText>
          Waktu kirim :
          {config.data?.waktuKirim
            ? format(
                parseISO(config.data.waktuKirim),
                "dd MMMM, yyyy - h:mm:ss a"
              )
            : ""}
        </DialogContentText>
        <Typography variant="subtitle2">Isi Notifikasi:</Typography>
        <DialogContentText>{config.data?.pesan}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>

        <Button onClick={removeData} variant="contained" disabled={isLoading}>
          {config.action}
        </Button>
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
