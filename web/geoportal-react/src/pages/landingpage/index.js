import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Card,
  CardMedia,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput,
  Input,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
  IconButton,
  Typography,
  styled,
  Slide,
  Stack,
  Tabs,
  TextField,
  Tab,
  Zoom,
  Divider,
  Drawer,
  Chip,
  Fade,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { Link as RouterLink } from "react-router-dom";
///import FullScreenImage from "./FullScreenImage";

import { MapViewerProvider } from "src/contexts/MapViewerContext";

import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Inbox as InboxIcon,
  Mail as MailIcon,
  Remove as RemoveIcon,
  Close,
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  GpsFixed as GpsFixedIcon,
  LayersRounded,
  Print as PrintIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard,
  Menu as MenuIcon,
  Apps as AppsIcon,
} from "@mui/icons-material";

import VisitorStats from "src/components/VisitorStats";
import CarouselsComponent from "src/components/Carousels";
import LembagaComponent from "src/components/Lembaga";
import BatimetriComponent from "src/components/BatimetriComponent";
import BeritaComponent from "src/components/BeritaComponent";
import LandingPageIndex from "src/components/Footer/landingPageIndex";

const OverviewWrapper = styled(Box)(
  () => `
      overflow: auto;
      flex: 1;
      overflow-x: hidden;
      align-items: center;
  `
);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(50)};
  `
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      font-weight: bold;
      border-radius: 30px;
      text-transform: uppercase;
      display: inline-block;
      font-size: ${theme.typography.pxToRem(11)};
      padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
      margin-bottom: ${theme.spacing(2)};
  `
);

const Banner = styled(Box)(
  ({ theme }) => `
    display: flex; 
    width: 100%; 
    height: 13vh; 
    background-color: rgba(255, 255, 255, 1); 
    z-index: 990; 
    position: fixed; 
    padding: 1em 3em;
    align-items: center;
  `
);

const SideMenu = styled(Box)(
  ({ theme }) => `
       width: 70px;
       height: 100vh;
       display: flex;
       padding: 20px;
       justify-content: center;
       align-items: start;
    `
);

const RightWrapper = styled(Box)(
  ({ theme }) => `
         width: 120px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         z-index: 2;
      `
);

const ButtonContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      right: 15px;
      bottom: 20px;
      color: white;
      transition: 0.8s;
      height: 105px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

  `
);

const ScaleContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 15px;
      bottom: 20px;
      color: white;
      transition: 0.8s;
      padding-top: 5px;
  `
);

const MenuContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 15px;
      top: 110px;
      background-color: "white";
  `
);

const TagContainer = styled(Box)(
  ({ theme }) => `
        z-index:1;
        color: white;
        transition: 0.8s;
    `
);

const SearchContainer = styled(Box)(
  ({ theme }) => `
   
      z-index:1;
      background-color: white;
      border-radius: 30px;
      transition: 0.8s;   
  `
);
const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;
const LayerContainer = styled(Box)(
  ({ theme }) => `
      position: absolute;
      z-index:1;
      left: 15px;
      top: 170px;
      color: white;
      transition: 'opacity 1500ms ease-in-out';
      padding-top: 5px;
  `
);

const CustomButton = styled(Button)({
  backgroundColor: "white", // Custom background color
  "&:hover": {
    backgroundColor: "#eee", // Custom background color on hover
  },
});

function Overview() {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching...");
  };

  return (
    <>
      <Helmet>
        <title>Sistem Batimetri Nasional | Landing Page</title>
      </Helmet>

      {/* <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 300 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Box>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                sx={{ color: "#000", fontSize: "20px" }}
              >
                Sistem Batimetri Nasional
              </Typography>
            </Box>
            <IconButton size="small" onClick={toggleDrawer(false)}>
              <Close size="small" />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {["Saved", "Recents", "Your contributions", "Location sharing"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            {["Share or embed map", "Print", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Tips", "Get Help"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer> */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <VisitorStats />
      </Box>
      <Box sx={{ display: "flex" }}>
        <CarouselsComponent />
      </Box>
      <Box sx={{ display: "flex" }}>
        <LembagaComponent />
      </Box>
      <Box sx={{ display: "flex" }}>
        <BatimetriComponent />
      </Box>
      <Box sx={{ display: "flex" }}>
        <BeritaComponent />
      </Box>

      <LandingPageIndex />
    </>
  );
}

export default Overview;
