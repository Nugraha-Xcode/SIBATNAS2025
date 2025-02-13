import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Typography,
  styled,
} from "@mui/material";
//import styled from "styled-components";
import { useState } from "react";
import {
  GetApp,
  Language,
  ListAlt,
  MoreVert,
  ZoomIn,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import Metadata from "./Metadata";

export default function Data({
  setBrowseData,
  setImportData,
  mapLayer,
  deleteDataset,
  handleVisible,
  setZoomToMap,
}) {
  const [checked, setChecked] = useState([0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setId] = useState(null);
  const [urlWMS, setUrlWMS] = useState(null);

  const [showMetadata, setShowMetadata] = useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    //setRow(row);
    setId(row.id);
    setUrlWMS(row.url);
    //console.log(row)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLinkWMS = () => {
    if (urlWMS) {
      window.open(urlWMS);
      setAnchorEl(null);
    }
  };
  const handleSetZoomMap = () => {
    setZoomToMap(id);
    setAnchorEl(null);
  };

  const handleSetMetadata = () => {
    setShowMetadata(true);
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const idpop = open ? "simple-popover" : undefined;

  function getListLayers() {
    if (mapLayer !== "undefined") {
      if (mapLayer.length > 0) {
        return mapLayer.map((row, index) => {
          //console.log(row)
          //console.log(row.id.includes('uploader'))
          //onChange={(e) => props.setLayerVisible(row.id)}

          const labelId = `checkbox-list-label-${index}`;
          return (
            <ListItem
              key={index}
              role={undefined}
              dense
              button
              style={{ padding: "0px" }}
            >
              <ListItemIcon style={{ minWidth: "16px" }}>
                <Checkbox
                  edge="start"
                  checked={row.visible}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                  onClick={() => handleVisible(row.id)}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${row.title}`}
                style={{ fontSize: "10px", maxWidth: "185px" }}
              />
              <ListItemSecondaryAction style={{ right: "0px" }}>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => deleteDataset(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => handleClick(e, row)}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        });
      } else {
        return (
          <TitleDataContent>
            Belum ditambahkan layer. Jelajah atau impor terlebih dahulu.
          </TitleDataContent>
        );
      }
    }
  }

  function handleCloseMetadata(e) {
    setShowMetadata(e);
  }

  return (
    <Container>
      <Divider />
      <TopButton>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ padding: "5px 15px", borderRadius: "20px" }}
          onClick={() => setBrowseData(true)}
        >
          Jelajah
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ padding: "5px 15px", borderRadius: "20px" }}
          onClick={() => setImportData(true)}
        >
          Impor
        </Button>
      </TopButton>
      <Divider />
      <DataContent>
        <p style={{ margin: "0px" }}>
          <b>Daftar Layer [{mapLayer.length}] </b>
        </p>
        <List>
          {getListLayers()}

          {/*
            [0, 1, 2, 3].map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
          */}
        </List>
        <Popover
          id={idpop}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {
            //<Typography>The content of the Popover. {identifier}</Typography>
            id && (
              <List component="nav" aria-label="main mailbox folders">
                <ListItem
                  button
                  style={{ paddingTop: "0px", paddingBottom: "0px" }}
                  onClick={() => handleSetZoomMap()}
                >
                  <ListItemIcon style={{ minWidth: "40px" }}>
                    <ZoomIn />
                  </ListItemIcon>
                  <ListItemText primary="Perbesar ke" />
                </ListItem>
                {!id.includes("uploader") && (
                  <ListItem
                    button
                    style={{ paddingTop: "0px", paddingBottom: "0px" }}
                    onClick={() => handleSetMetadata()}
                  >
                    <ListItemIcon style={{ minWidth: "40px" }}>
                      <ListAlt />
                    </ListItemIcon>
                    <ListItemText primary="Lihat Metadata" />
                  </ListItem>
                )}
                {!id.includes("uploader") && (
                  <ListItem
                    button
                    style={{ paddingTop: "0px", paddingBottom: "0px" }}
                    onClick={() => handleLinkWMS()}
                  >
                    <ListItemIcon style={{ minWidth: "40px" }}>
                      <Language />
                    </ListItemIcon>
                    <ListItemText primary="Url Web Service" />
                  </ListItem>
                )}
              </List>
            )
          }
        </Popover>
      </DataContent>
      <Metadata
        open={showMetadata}
        id={id}
        handleCloseMetadata={(e) => handleCloseMetadata(e)}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopButton = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-evenly;
`;

const DataContent = styled.div`
  padding: 15px;
  max-height: 68vh;
  overflow-y: auto;
  overflow-x: hidden;
`;
const TitleDataContent = styled.h5`
  margin: 0px;
  color: #888;
`;
