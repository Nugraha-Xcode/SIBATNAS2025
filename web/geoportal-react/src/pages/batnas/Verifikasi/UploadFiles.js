import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import uploadFilesService from "src/services/upload-files.service";

const UploadFiles = () => {
  const [filename, setFilename] = useState("");
  const [selectedFiles, setSelectedFiles] = useState();
  const [currentFile, setCurrentFile] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [fileInfos, setFileInfos] = useState([]);

  const selectFile = (e) => {
    if (!e.target.files) {
      return;
    }
    setSelectedFiles(e.target.files);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    //const file = e.target.files[0];
    //const { name } = file;
    //setFilename(name);
  };

  useEffect(() => {
    // dispatch(retrieveLokasi());
    uploadFilesService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  const upload = () => {
    let currentFile = selectedFiles[0];

    setProgress(0);
    setCurrentFile(currentFile);

    uploadFilesService
      .upload(currentFile, (event) => {
        setProgress(Math.round((100 * event.loaded) / event.total));
      })
      .then((response) => {
        setMessage(response.data.message);
        setIsError(false);
        return uploadFilesService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch((e) => {
        setProgress(0);
        //console.log(e);
        setMessage(e.response.data.message);
        setCurrentFile();
        setIsError(true);
      });

    setSelectedFiles();
  };

  return (
    <Box>
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
        Upload Image
        <input type="file" hidden onChange={selectFile} />
      </Button>

      <Button
        className="btn-upload"
        color="primary"
        variant="contained"
        component="span"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </Button>
      {previewImage && (
        <div>
          <img className="preview my20" src={previewImage} alt="" />
        </div>
      )}
      <Typography
        variant="subtitle2"
        className={`upload-message ${isError ? "error" : ""}`}
      >
        {message}
      </Typography>
      <Typography variant="h6" className="list-header">
        List of Files
      </Typography>
      <List>
        {fileInfos &&
          fileInfos.map((file, index) => (
            <ListItem divider key={index}>
              <img
                src={file.url}
                alt={file.name}
                height="80px"
                className="mr20"
              />

              <ListItemText>
                <a href={file.url}>{file.name}</a>
              </ListItemText>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default UploadFiles;
