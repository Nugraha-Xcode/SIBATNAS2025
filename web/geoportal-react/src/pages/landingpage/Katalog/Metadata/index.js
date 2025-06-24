import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  CheckCircle,
  CheckCircleOutlined,
  Close,
  Info,
  StarBorder,
} from "@mui/icons-material";

import environment from "src/config/environment";
import { dateToString } from "src/utils/Helpers";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function Metadata({ open, handleCloseMetadata, id }) {
  const url_list_harvesting = environment.api + "/harvestings/identifier/";
  const [row, setRow] = useState(null);

  const handleClose = () => {
    handleCloseMetadata(false);
  };

  useEffect(() => {
    if (id) {
      const requestOptions = {
        method: "GET",
      };

      fetch(url_list_harvesting + id, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setRow(data?.data);
        });
    }
  }, [id]);

  function viewSubjects(subjects) {
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var list = [];
        s.forEach(function (x) {
          x.keywords.forEach(function (y) {
            list.push(y);
          });
        });
        return list.length ? list.join(", ") : "";
      }
    }
  }

  function viewReferences(subjects) {
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var list = "";
        s.forEach(function (x) {
          if (x.name !== null)
            list +=
              "<br />" +
              x.protocol +
              "<br /><a href='" +
              x.url +
              "' target='_blank' >" +
              x.name +
              "</a><br />";
        });
        return <div dangerouslySetInnerHTML={{ __html: list }} />;
      }
    }
  }

  function viewImage(subjects) {
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var url = "";
        s.forEach(function (x) {
          if (
            x.protocol === "ESRI:ArcGIS:MapServer" ||
            x.protocol === "ESRI:ArcGIS:ImageServer"
          ) {
            url = x.url;
          }
        });
        return <img src={url + "/info/thumbnail"} alt="Map thumbnail" />;
      }
    }
  }

  let dateISO = new Date(row?.publication_date);
  let formatted_datetime = dateToString(dateISO);

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle
        id="draggable-dialog-title"
        sx={{ cursor: "move", padding: "5px 10px", backgroundColor: "#f3f3f3" }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Pratinjau Metadata
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ minHeight: "32vh", padding: "5px" }}>
        <Row>
          <Col3>Identifier</Col3>
          <Col6>{row?.identifier}</Col6>
        </Row>
        <Row>
          <Col3>Judul</Col3>
          <Col6>{row?.title}</Col6>
        </Row>
        <Row>
          <Col3>Abstrak</Col3>
          <Col6 sx={{ maxHeight: "80px", overflowY: "auto" }}>
            {row?.abstract}
          </Col6>
        </Row>
        <Row>
          <Col3>Organisasi</Col3>
          <Col6>{row?.organizations.name}</Col6>
        </Row>
        <Row>
          <Col3>Tipe Data</Col3>
          <Col6>{row?.data_type}</Col6>
        </Row>
        <Row>
          <Col3>Waktu Publikasi</Col3>
          <Col6>{formatted_datetime}</Col6>
        </Row>
        <Row>
          <Col3>Kata kunci</Col3>
          <Col6>{row ? viewSubjects(row?.keywords) : null}</Col6>
        </Row>
        <Row>
          <Col3>Info Distribusi</Col3>
          <Col6>{row ? viewReferences(row?.distributions) : null}</Col6>
        </Row>
        <Row>
          <Col3>Pratinjau Peta</Col3>
          <Col6>{row ? viewImage(row?.distributions) : null}</Col6>
        </Row>
        <Row>
          <Col6>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ padding: "5px 15px", borderRadius: "20px" }}
              onClick={() =>
                window.open(
                  environment.baseUrl +
                    "csw/?request=GetRecordById&service=CSW&version=2.0.2&elementSetName=full&outputSchema=http://www.isotc211.org/2005/gmd&id=" +
                    row?.identifier
                )
              }
            >
              XML Metadata
            </Button>
          </Col6>
        </Row>
      </DialogContent>
    </Dialog>
  );
}

// Styled components remain mostly the same
const Row = styled.div`
  margin: 0;
  display: flex;
`;
const Col = styled.div`
  margin: 0;
  flex-grow: 1;
`;

const Col3 = styled.div`
  margin: 5px;
  min-width: 150px;
  font-weight: bold;
`;

const Col6 = styled.div`
  margin: 5px;
  flex-grow: 1;
`;
