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
import { styled } from "@mui/system";
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

// Styled components remain mostly the same
const Row = styled("div")(`
  margin: 0;
  display: flex;
`);
const Col = styled("div")(`
  margin: 0;
  flex-grow: 1;
`);
const Col3 = styled("div")(`
  margin: 5px;
  min-width: 150px;
  font-weight: bold;
`);

const Col6 = styled("div")(`
  margin: 5px;
  flex-grow: 1;
`);

export default function Metadata({ open, handleCloseMetadata, id, row }) {
  //const url_list_harvesting = environment.api + "/record/identifier/";
  //const [row, setRow] = useState(null);

  const handleClose = () => {
    handleCloseMetadata(false);
  };
  /*
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
*/
  function viewReferences(subjects) {
    if (subjects) {
      const parts = subjects.split(",");
      var list = "";
      list +=
        "<br />" +
        parts[2] +
        "<br />" +
        parts[3] +
        "<br/>" +
        parts[0] +
        "<br />";
      return <div dangerouslySetInnerHTML={{ __html: list }} />;
      /*
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
      }*/
    }
  }

  function viewImage(subjects) {
    if (subjects) {
      const parts = subjects.split(",");
      //[
      //  'my_workspace:RBI25K_TITIKKONTROLGEODESI_PT_25K',
      //  'None',
      //  'OGC:WMS',
      //  'http://localhost/geoserver/my_workspace/wms'
      //]
      var esri_wms = parts[2].includes("ESRI:ArcGIS:MapServer");
      var esri_image = parts[2].includes("ESRI:ArcGIS:ImageServer");
      var esri_feature = parts[2].includes("ESRI:ArcGIS:FeatureServer");
      var wms = parts[2].includes("OGC:WMS");
      var wfs = parts[2].includes("OGC:WFS");
      var link = parts[2].includes("WWW:LINK");

      var thumb;

      if (esri_wms > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
      } else if (esri_image > 0) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
      } else if (esri_feature) {
        //console.log('aye');
        //console.log(esri[0]);
        thumb = parts[3] + "/info/thumbnail";
      } else {
        if (wms) {
          thumb = parts[3] + "/reflect?layers=" + parts[0];
        }
      }
      //return thumb;
      return <img src={thumb} alt="Map thumbnail" width="240" height="180" />;
    }
  }

  //let dateISO = new Date(row?.publication_date);
  //let formatted_datetime = dateToString(dateISO);

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={true}
      maxWidth="md"
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
          <Col6>{row?.organization}</Col6>
        </Row>
        <Row>
          <Col3>Tipe Data</Col3>
          <Col6>{row?.type}</Col6>
        </Row>
        <Row>
          <Col3>Waktu Publikasi</Col3>
          <Col6>{row?.date_publication}</Col6>
        </Row>
        <Row>
          <Col3>Kata kunci</Col3>
          <Col6>{row?.keywords}</Col6>
        </Row>
        <Row>
          <Col3>Info Distribusi</Col3>
          <Col6>{row ? viewReferences(row?.links) : null}</Col6>
        </Row>
        <Row>
          <Col3>Pratinjau Peta</Col3>
          <Col6>{row ? viewImage(row?.links) : null}</Col6>
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
                  environment.csw +
                    "?request=GetRecordById&service=CSW&version=2.0.2&elementSetName=full&outputSchema=http://www.isotc211.org/2005/gmd&id=" +
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
