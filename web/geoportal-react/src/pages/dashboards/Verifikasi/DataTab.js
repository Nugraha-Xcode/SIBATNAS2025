import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  Avatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from "@mui/material";

import swal from "sweetalert";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import CheckIcon from "@mui/icons-material/Check";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import environment from "src/config/environment";
import { NavLink } from "react-router-dom";
import { retrieveAll, retrieveAllUser } from "src/redux/actions/aktifitasUnduh";
import DataDialog from "./DataDialog";
import { check } from "src/redux/actions/verify";
const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function KategoriTab() {
  const theme = useTheme();

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [isOri, setIsOri] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialConfig = {
    data: null,
    title: "Tambah Data Produsen Baru",
    mode: "add",
    action: "Submit",
    description:
      "Silahkan isi form berikut untuk menambahkan Data Produsen baru.",
  };
  const [config, setConfig] = useState(initialConfig);
  const [documentName, setDocumentName] = useState();
  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState();
  const datas = useSelector((state) => state.aktifitas_unduh);
  const { user: currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser.roles.includes("ROLE_ADMIN")) {
      //dispatch(retrieveAll());
      dispatch(retrieveAllUser(currentUser.uuid));
    } else {
      dispatch(retrieveAllUser(currentUser.uuid));
    }
  }, []);

  const handleClickAdd = () => {
    setConfig(initialConfig);
    setOpen(true);
  };

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

  const verify = () => {
    // setOpen(true);
    setIsLoading(true);

    let documentFile = selectedDocumentFiles[0];
    dispatch(check(documentFile))
      .then((response) => {
        console.log(response);
        if (response.status == "Success") {
          setOpen(true);
          setIsOri(true);
          setMessage(response.message);
        } else {
          setOpen(true);
          setIsOri(false);
          setMessage(response.message);
        }
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Unggah Unduhan Zip SHP</Typography>
            <Box
              className="mb25"
              display="flex"
              alignItems="center"
              width="60%"
            >
              {documentName ? <Box mr={1}>{documentName}</Box> : ""}
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ marginRight: "1rem" }}
                >
                  Upload Zip SHP
                  <input type="file" hidden onChange={selectDocumentFile} />
                </Button>
              </Box>
              <Box>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button onClick={verify} variant="contained">
                    Verifikasi Data
                  </Button>
                )}
              </Box>
            </Box>

            {open && (
              <Box width="60%" sx={{ marginTop: "20px" }}>
                <Alert severity={isOri ? "success" : "error"}>{message}</Alert>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default KategoriTab;
