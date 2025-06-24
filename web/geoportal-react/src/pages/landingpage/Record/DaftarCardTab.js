import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Grid,
  Divider,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  useTheme,
  styled,
  CardContent,
  Paper,
  InputBase,
  Chip,
  Pagination,
  CircularProgress,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays, parseISO } from "date-fns";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import RefreshIcon from "@mui/icons-material/Refresh";
import Search from "@mui/icons-material/Search";

import { retrievePublikPaginated } from "src/redux/actions/record";
import { retrievePublik as retrieve } from "src/redux/actions/keywords";
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";

import MediaCard from "./MediaCard";
import TopSearch from "./TopSearch";
import Metadata from "./Metadata";

function RecordTab() {
  const theme = useTheme();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState();
  const [row, setRow] = useState();

  const [tag, setTag] = useState("Semua");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const label = "Dataset Publikasi";

  const initialConfig = {
    data: null,
    title: `Tambah ${label} Baru`,
    mode: "add",
    action: "Submit",
    description: `Silahkan isi form berikut untuk menambahkan ${label} baru.`,
  };
  
  const [config, setConfig] = useState(initialConfig);
  const recordState = useSelector((state) => state.record);
  const { records, totalItems, totalPages, currentPage } = recordState;
  const [filtered, setFiltered] = useState([]);

  const keywords = useSelector((state) => state.keywords);
  const { user: currentUser } = useSelector((state) => state.auth);
  const siteSetting = useSelector((state) => state.siteSetting);

  const dispatch = useDispatch();

  // Initial data load
  useEffect(() => {
    loadRecords();
    dispatch(retrievePublicSiteSettings());
    dispatch(retrieve());
  }, []);

  // Update when records change in Redux
  useEffect(() => {
    if (records) {
      setFiltered(records);
    }
  }, [records]);

  // Load records with pagination
  const loadRecords = (searchQuery = "", pageNum = 0) => {
    setLoading(true);
    const params = {
      page: pageNum,
      size,
      keyword: searchQuery, // Jangan pakai query dari state
    };
    dispatch(retrievePublikPaginated(params)).finally(() => setLoading(false));
  };
  

  // Handle page change
  const handleChange = (event, value) => {
    setPage(value - 1);
    loadRecords(query, value - 1); 
  };

  // Handle tag filtering
  const handleTag = (tag) => {
    const searchInput = document.getElementById("search");
    if (searchInput) searchInput.value = "";
  
    const newQuery = tag.toLowerCase();
    setPage(0);
    setQuery(newQuery);
    setTag(tag);
  
    loadRecords(newQuery, 0); // Gunakan query baru langsung
  };
  

  // Reset to all records
  const handleAll = () => {
    const searchInput = document.getElementById("search");
    if (searchInput) searchInput.value = "";
  
    const newQuery = "";
    setPage(0);
    setQuery(newQuery);
    setTag("Semua");
  
    loadRecords(newQuery, 0); // Gunakan query baru langsung
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadRecords(query, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    setPage(0);
    
    // Reload with new size
    const params = {
      page: 0,
      size: newSize,
      keyword: query
    };
    
    dispatch(retrievePublikPaginated(params));
  };

  const handleOpenDialog = (id) => {
    setRow(id);
    setOpen(true);
  };

  function generate_url(url) {
    const parts = url.split(",");
    var esri_wms = parts[2].includes("ESRI:ArcGIS:MapServer");
    var esri_image = parts[2].includes("ESRI:ArcGIS:ImageServer");
    var esri_feature = parts[2].includes("ESRI:ArcGIS:FeatureServer");
    var wms = parts[2].includes("OGC:WMS");
    var wfs = parts[2].includes("OGC:WFS");
    var link = parts[2].includes("WWW:LINK");

    var thumb;

    if (esri_wms > 0) {
      thumb = parts[3] + "/info/thumbnail";
    } else if (esri_image > 0) {
      thumb = parts[3] + "/info/thumbnail";
    } else if (esri_feature) {
      thumb = parts[3] + "/info/thumbnail";
    } else {
      if (wms) {
        thumb = parts[3] + "/reflect?layers=" + parts[0];
      }
    }
    return thumb;
  }

  function getRows() {
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress />
        </div>
      );
    }
    
    if (filtered && filtered?.length > 0) {
      return filtered.map((row) => {
        return (
          <MediaCard
            key={row?.identifier}
            row={row}
            identifier={row?.identifier}
            title={row?.title}
            abstract={row?.abstract}
            url={generate_url(row?.links)}
            setOpen={(e) => handleOpenDialog(e)}
          />
        );
      });
    } else {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          Tidak ditemukan data sesuai pencarian yang dilakukan
        </div>
      );
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
      event.preventDefault();
    }
  };

  const handleSearch = () => {
    const searchInput = document.getElementById("search");
    const searchValue = searchInput ? searchInput.value : "";
    
    setPage(0);
    setTag("");
    setQuery(searchValue);
    
    loadRecords(searchValue, 0);
  };

  function handleCloseMetadata(e) {
    setOpen(e);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
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
              placeholder={`Cari data di katalog ${siteSetting?.name || 'SIBATNAS'}`}
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
            flexWrap: "wrap",           
            justifyContent: "center", 
            gap: "10px",              
            margin: 10,
            paddingTop: "15px",
            paddingBottom: "15px",
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
            // overflowX: "auto"
          }}
        >
          <Chip
            key={0}
            label="Semua"
            variant={tag === "Semua" ? "default" : "outlined"}
            // style={{ marginRight: 10 }} - hapus ini
            onClick={() => handleAll()}
          />

          {keywords &&
            keywords.map((data) => (
              <Chip
                key={data.uuid}
                label={data.name}
                variant={tag === data.name ? "default" : "outlined"}
                // style={{ marginRight: 10 }} - hapus ini
                onClick={() => handleTag(data.name)}
              />
            ))}

        </div>
        
        <Card>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getRows()}
            </div>
          </CardContent>
        </Card>
        
        <Metadata
          open={open}
          id={identifier}
          row={row}
          handleCloseMetadata={(e) => handleCloseMetadata(e)}
        />
        
        {totalPages > 0 && (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              variant="outlined"
              shape="rounded"
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default RecordTab;