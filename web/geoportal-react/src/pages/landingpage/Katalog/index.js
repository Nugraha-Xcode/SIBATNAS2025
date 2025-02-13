import "./Landing.css";
//import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";

import Pagination from "@mui/material/Pagination";
//import styled from "styled-components";
//import Config from "./config.json";
import AddAlertRounded from "@mui/icons-material/AddAlertRounded";
import Close from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Search from "@mui/icons-material/Search";
import environment from "src/config/environment";

import { useState, useEffect } from "react";
import Draggable from "react-draggable";

import TopMenu from "src/components/TopMenu";
import TopSearch from "./TopSearch";

//import Metadata from "./Metadata";
import FilterMenu from "./FilterMenu";
//import MediaCard from "./MediaCard";

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

function Katalog() {
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState();
  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [pagination, setPagination] = useState(1);
  const [query, setQuery] = useState("none");
  const [tag, setTag] = useState("Semua");

  const handleChange = (event, value) => {
    setPage(value - 1);
  };

  const handleSearch = () => {
    var q = document.getElementById("search").value;
    //alert('aaa ' + q);
    setPage(0);
    setTag("");
    if (q) setQuery(q);
    else setQuery("none");
  };

  const handleAll = () => {
    var q = document.getElementById("search");
    q.value = "";
    //alert('aaa ' + q);
    setPage(0);
    setQuery("none");
    setTag("Semua");
  };

  const handleTag = (tag) => {
    var q = document.getElementById("search");
    q.value = "";
    //alert('aaa ' + q);
    setPage(0);
    if (tag === "CTSRT") {
      tag = "Citra";
    } else if (tag === "Imagery") {
      tag = "Foto";
    }
    setQuery(tag.toLowerCase());
    setTag(tag);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = (id) => {
    //alert(id)
    setIdentifier(id);
    setOpen(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
      event.preventDefault();
    }
  };

  function handleCloseMetadata(e) {
    setOpen(e);
  }

  function getRows() {
    if (typeof data !== "undefined") {
      //var items=props.presensiDataLast.data;
      if (data !== null) {
        if (data.length > 0) {
          return data.map((row) => {
            var json_obj = JSON.parse(row.distributions);
            //console.log(json_obj[0].url);
            return "";
            /*
            return (
              <MediaCard
                view=""
                identifier={row.identifier}
                title={row.title}
                abstract={row.abstract}
                produsen=""
                download={true}
                url={json_obj[0].url + "/info/thumbnail"}
                setOpen={(e) => handleOpenDialog(e)}
              />
            );
            */
          });
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <>
      <TopMenu idx={1} />
      {
        //<Metadata open={open} id={identifier} handleCloseMetadata={(e) => handleCloseMetadata(e)} />
      }
      <Grid container sx={{ height: "84vh" }}>
        <Grid
          item
          sm={2}
          xs={2}
          sx={{ borderRight: "1px solid #eee", marginTop: "5px" }}
          style={{ background: "#eee" }}
        >
          {<FilterMenu style={{ background: "blue" }} />}
        </Grid>
        <Grid
          item
          sm={10}
          xs={10}
          sx={{ padding: "20px", maxHeight: "84vh", overflowY: "auto" }}
        >
          {/*
					<div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
						<Paper
							component="form"
							elevation={0}
							sx={{ p: '0px 5px', display: 'flex', width: 500, border:'solid 1px #ddd' }}
						>
							<InputBase
								placeholder="Cari dataset"
								inputProps={{ 'aria-label': 'search map' }}
								style={{ marginLeft: '10px', flex: 1 }}
							/>
							<IconButton aria-label="search" style={{ padding: 10 }}>
								<SearchIcon />
							</IconButton>
						</Paper>
					</div>
          
      
					*/}

          <TopSearch>
            <Paper
              component="form"
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <InputBase
                placeholder="Cari data di katalog Geoportal Kutai Kartanegara"
                inputProps={{ "aria-label": "search dataset" }}
                style={{ marginLeft: "10px", flex: 1 }}
                id="search"
                autoComplete="off"
                onKeyPress={(e) => handleKeyPress(e)}
              />
              <IconButton
                aria-label="search"
                style={{ padding: 10 }}
                onClick={() => handleSearch()}
              >
                <Search />
              </IconButton>
            </Paper>
          </TopSearch>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: 10,
              paddingTop: "15px",
              paddingBottom: "15px",
              borderTop: "1px solid #eee",
              borderBottom: "1px solid #eee",
            }}
          >
            <Chip
              label="Semua"
              variant={tag === "Semua" ? "default" : "outlined"}
              style={{ marginRight: 10 }}
              onClick={() => handleAll()}
            />
            <Chip
              label="Sungai"
              variant={tag === "Sungai" ? "default" : "outlined"}
              style={{ marginRight: 10 }}
              onClick={() => handleTag("Sungai")}
            />
            <Chip
              label="Jalan"
              variant={tag === "Jalan" ? "default" : "outlined"}
              style={{ marginRight: 10 }}
              onClick={() => handleTag("Jalan")}
            />
            <Chip
              label="CTSRT"
              variant={tag === "CTSRT" ? "default" : "outlined"}
              style={{ marginRight: 10 }}
              onClick={() => handleTag("CTSRT")}
            />
            <Chip
              label="Imagery"
              variant={tag === "Imagery" ? "default" : "outlined"}
              style={{ marginRight: 10 }}
              onClick={() => handleTag("Imagery")}
            />
            <Chip
              label="Batas"
              variant={tag === "Batas" ? "default" : "outlined"}
              onClick={() => handleTag("Batas")}
            />
          </div>
          {
            //<Chip label="Atlas" variant={tag==="Atlas"?"default":"outlined"} style={{ marginRight: 10 }} onClick={()=>handleTag("Atlas")} />
          }
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {
              /*
							<div style={{display: 'flex', justifyContent: 'space-between', padding:'1em 3em 1em 1em'}}>							
						<div>Ditemukan data sebanyak: 140</div>
					</div>
						<MediaCard view="10K" title='Atlas 250K Gunung Api' produsen="PTRA" download={true} url='https://geoservices.big.go.id/gis/rest/services/PTRA/Atlas_250K_GunungApi/MapServer/info/thumbnail' />
						<MediaCard view="1K" title='Foto Udara' produsen="PPRT" download={true} url='https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_1988_Meulaboh/ImageServer/info/thumbnail'  />
						<MediaCard view="1M" title='Rel KA 25K' produsen="PPRT" download={true} url='https://geoservices.big.go.id/rbi/rest/services/TRANSPORTASI/RelKA_25K/MapServer/info/thumbnail' />
						<MediaCard view="130K" title="Danau 50K" produsen="PPRT" download={true} url='https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/Danau_50K/MapServer/info/thumbnail' />
						<MediaCard view="10M" title="Hidrografi Sungai 250K" download={true} produsen="PPRT" url="https://geoservices.big.go.id/rbi/rest/services/HIDROGRAFI/Sungai_250K/MapServer/info/thumbnail" />
						<MediaCard view="123K" title="Jalan 250K" produsen="PPRT" download={false} url="https://geoservices.big.go.id/rbi/rest/services/TRANSPORTASI/Jalan_250K/MapServer/info/thumbnail" />
						<MediaCard view="12M" title="LPI 250K" produsen="PKLP" download={true} url="https://geoservices.big.go.id/rbi/rest/services/INDEKS/LPI_250K/MapServer/info/thumbnail" />
						<MediaCard view="99" title="Imagery FU Pekanbaru" download={true} produsen="PPRT" url='https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_2011_KotaPekanbaru/ImageServer/info/thumbnail' />
						<MediaCard view="500" title="Toponim PT 5K" produsen="PPRT" download={true} url="https://geoservices.big.go.id/rbi/rest/services/TOPONIMI/TOPONIM_PT_5K/MapServer/info/thumbnail" />
						<MediaCard view="222K" title="Imagery FU Tebing Tinggi" produsen="PPRT" download={true} url="https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_2020_Tebingtinggi/ImageServer/info/thumbnail" />
						<MediaCard view="12M" title="FU Siabu" produsen="PPRT" download={false} url="https://geoservices.big.go.id/raster/rest/services/IMAGERY/FU_2020_Siabu/ImageServer/info/thumbnail" />
						<MediaCard view="130K" title="Batas Negara Laut 50K" produsen="PPRT" download={true} url='https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BatasNegaraLaut_50K/MapServer/info/thumbnail' />
						*/
              getRows()
            }
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {pagination > 1 && (
              <Pagination
                count={pagination}
                page={page + 1}
                variant="outlined"
                shape="rounded"
                style={{ margin: 30 }}
                onChange={handleChange}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Katalog;
/*
const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const TopSearch = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0px;
`;
*/
