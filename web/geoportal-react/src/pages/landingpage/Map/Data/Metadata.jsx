import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
//import styled from "styled-components";
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

//import { makeStyles } from '@material-ui/core/styles';

//import Config from "../../config.json";

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
          //console.log(data.data);
        });
    }
  }, [id]);

  function viewSubjects(subjects) {
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var list = [];
        s.forEach(function (x) {
          //console.log(x.keywords);
          x.keywords.forEach(function (y) {
            list.push(y);
          });
        });
        //console.log(s[0].keywords);
        //console.log(s[0].keywords.join(", "));
        //console.log(list)
        if (list) return list.join(", ");
        else return "";
      }
    }
  }

  function viewReferences(subjects) {
    if (subjects) {
      var s = JSON.parse(subjects);
      if (s) {
        var list = "";
        s.forEach(function (x) {
          //console.log(x);
          //console.log(x.name);
          if (x.name !== null)
            list +=
              x.protocol +
              "<br /><a href='" +
              x.url +
              "' target='_blank' >" +
              x.name +
              "</a><br />";
          //+ <br /> + x.url + <hr /> + <br />
          //x.keywords.forEach(function(y){
          //    list.push(y)
          //});
        });
        //console.log(s[0].keywords);
        //console.log(s[0].keywords.join(", "));
        //console.log(list)
        return <div dangerouslySetInnerHTML={{ __html: list }} />;
        //return list
      }
    }
  }

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle
        style={{
          cursor: "move",
          padding: "5px 10px",
          backgroundColor: "#f3f3f3",
        }}
        id="draggable-dialog-title"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5 style={{ margin: "0px" }}>Pratinjau Metadata</h5>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent style={{ minHeight: "32vh", padding: "5px" }}>
        <Row>
          <Col3>Identifier</Col3>
          <Col6>{row?.identifier}</Col6>
        </Row>
        <Row>
          <Col3>Title</Col3>
          <Col6>{row?.title}</Col6>
        </Row>
        <Row>
          <Col3>Abstract</Col3>
          <Col6 style={{ maxHeight: "80px", overflowY: "auto" }}>
            {row?.abstract}
          </Col6>
        </Row>
        <Row>
          <Col3>Organization</Col3>
          <Col6>{row?.organizations.name}</Col6>
        </Row>
        <Row>
          <Col3>Keywords</Col3>
          <Col6>{row ? viewSubjects(row.keywords) : null}</Col6>
        </Row>
        <Row>
          <Col3>Distributions</Col3>
          <Col6>{row ? viewReferences(row.distributions) : null}</Col6>
        </Row>
        <Row>
          <Col6>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              style={{ padding: "5px 15px", borderRadius: "20px" }}
              onClick={() =>
                window.open(
                  environment.baseUrl +
                    "csw/?request=GetRecordById&service=CSW&version=2.0.2&elementSetName=full&outputSchema=http://www.isotc211.org/2005/gmd&id=" +
                    row.identifier
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

const Row = styled.div`
  margin: 0px;
  display: flex;
`;
const Col = styled.div`
  margin: 0px;
  flex-grow: 1;
`;

const Col2 = styled.div`
  margin: 5px;
  flex-grow: 2;
`;

const Col3 = styled.div`
  margin: 5px;
  min-width: 150px;
  font-weight: bold;
`;

const Col4 = styled.div`
  margin: 5px;
  flex-grow: 4;
`;

const Col6 = styled.div`
  margin: 5px;
  flex-grow: 1;
`;

const Col8 = styled.div`
  margin: 5px;
  flex-grow: 8;
`;

/*

classes={{
                                    root: {background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'},
                                    title: color: '#ff0000',
                                }}
{itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img src={item.img} alt={item.title} />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${item.title}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
 <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>

            */
