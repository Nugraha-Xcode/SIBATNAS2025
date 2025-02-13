//import { styled } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DomainIcon from "@mui/icons-material/Domain";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CategoryIcon from "@mui/icons-material/Category";

import {
  BrandingWatermark,
  BrandingWatermarkOutlined,
  Description,
  DescriptionOutlined,
  Home,
  HomeOutlined,
  Settings,
  SettingsOutlined,
} from "@mui/icons-material";

export default function LeftMenu({ menu, setMenu }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        flexGrow: 1,
      }}
    >
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="h1" id="nested-list-subheader">
            Menu Penyaringan
          </ListSubheader>
        }
      >
        {/* Menu items can be added here */}
        <ListItem button>
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Tahun" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LocalLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Kata Kunci" />
        </ListItem>
      </List>
    </div>
  );
}

// Converted styled-components into MUI's `styled` utility
/*
const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  flexGrow: 1,
});
*/
/*
const ListMenu = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginTop: "3px",
  overflowY: "auto",
  flexGrow: 1,
});

const MenuTitle = styled("span")({
  fontSize: "14px",
  fontWeight: 600,
  marginLeft: "15px",
});

const Menu = styled("div")(({ active }) => ({
  height: "64px",
  marginBottom: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingLeft: "25px",
  color: "#555",
  "&:hover": {
    color: "#000",
    backgroundColor: "#efefef",
  },
  "&:active": {
    backgroundColor: "#ddd",
    color: "#2F4E6F",
  },
  ...(active && {
    backgroundColor: "#ddd",
    color: "#2F4E6F",
    "&:hover": {
      backgroundColor: "#ddd",
      color: "#2F4E6F",
    },
  }),
}));

const WrapperIcon = styled("div")({
  borderLeft: "4px solid #2F4E6F",
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

// Icons remain the same
const DescriptionIcon = styled(Description)``;
const DescriptionOutlinedIcon = styled(DescriptionOutlined)``;

const AnalysisIcon = styled(Settings)``;
const AnalysisOutlinedIcon = styled(SettingsOutlined)``;

const BrandingWatermarkIcon = styled(BrandingWatermark)``;
const BrandingWatermarkOutlinedIcon = styled(BrandingWatermarkOutlined)``;

const Footer = styled("div")({
  textAlign: "center",
  fontSize: "14px",
  fontWeight: 400,
  padding: "10px",
  backgroundColor: "#98B1C4",
  color: "white",
});
*/
