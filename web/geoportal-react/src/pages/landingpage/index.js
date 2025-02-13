import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CountUp from "react-countup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Card,
  Grid,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { Helmet } from "react-helmet-async";
import { retrieveNumber } from "src/redux/actions/statistik";

import { Link as RouterLink } from "react-router-dom";
import environment from "src/config/environment";
import BottomLink from "./BottomLink";
import Footer from "./Footer";

//import Hero from "./Hero";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: "relative",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
    background-color: #676a6e;
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

function Overview() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  var settings = {
    dots: true,
    className: "center",
    centerPadding: isMobile ? "20px" : "80px",
    centerMode: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setCurrentIndex(index),
  };

  const getThumbnailUrl = (videoId) =>
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  //https://i.ytimg.com/vi/8hYlB38asDY/hqdefault.jpg

  const [anchorEl, setAnchorEl] = useState(null);

  const stats = useSelector((state) => state.statistik);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveNumber());
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <OverviewWrapper>
      <Helmet>
        <title>
          Geoportal Palapa - Kabupaten Kutai Kartanegara | Landing Page
        </title>
      </Helmet>
      <video
        autoPlay
        muted
        loop
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        <source
          src={process.env.PUBLIC_URL + "/static/KukarVideo.mp4"}
          type="video/mp4"
        />
      </video>
      <Container
        maxWidth="xl"
        sx={{
          paddingBottom: "100px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              zIndex: 2,
              position: "relative",
              alignItems: "center",
              top: isMobile ? "120px" : "180px",
              margin: isMobile ? "30px 0%" : "30px 20%",
              padding: isMobile ? "20px" : "30px",
              display: "flex",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "12px",
            }}
          >
            <Box>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  fontFamily: "finalsix, sans-serif",
                  marginTop: 0,
                  marginBottom: "0.5rem",
                  lineHeight: 1.2,
                  color: isMobile ? "black" : "darkblue",
                }}
              >
                Geoportal Simpul Jaringan
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 200,
                  marginTop: 0,
                  marginBottom: "0.5rem",
                  lineHeight: isMobile ? "18px" : "18px",
                  color: isMobile ? "white" : "black",
                }}
              >
                Geoportal SJ Kutai Kartanegara adalah sebuah platform
                terintegrasi yang mengumpulkan, menyajikan, dan menyebarluaskan
                data dan informasi geospasial yang menjadi tanggung jawab dan
                kewenangan unit produksi dan walidata di Kabupaten Kutai
                Kartanegara.
              </p>
            </Box>
          </Box>
        </Container>
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 1,
            padding: isMobile ? "150px 0px 30px 50px" : "270px 0px 30px 0px",
            color: "white",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent={isMobile ? "start" : "center"}
            alignItems="stretch"
            spacing={4}
          >
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "240px",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/static/images/building.png"}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    textAlign="left"
                    sx={{
                      fontSize: "36px",
                      fontWeight: 600,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    <CountUp start={0} end={stats.produsen} duration={2.75} />
                  </Typography>
                  <Typography
                    variant="h2"
                    gutterBottom
                    textAlign="left"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    Total Produsen DG/IG
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "240px",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/static/images/profile.png"}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    textAlign="left"
                    sx={{
                      fontSize: "36px",
                      fontWeight: 600,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    <CountUp start={0} end={stats.user} duration={2.75} />
                  </Typography>
                  <Typography
                    variant="h2"
                    gutterBottom
                    textAlign="left"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    Total pengguna
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "240px",
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/static/images/dataset.png"}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    textAlign="left"
                    sx={{
                      fontSize: "36px",
                      fontWeight: 600,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    <CountUp start={0} end={stats.dataset} duration={2.75} />
                  </Typography>
                  <Typography
                    variant="h2"
                    gutterBottom
                    textAlign="left"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      fontFamily: "finalsix, sans-serif",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    Total dataset terpublikasi
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          backgroundColor: "black",
          minHeight: "200px",
          padding: "30px",
          marginTop: "80px",
        }}
      >
        <BottomLink />
        <Footer />
      </Container>

      {/*
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          backgroundColor: "black",
          minHeight: "200px",
          padding: "30px",
        }}
      >
        <Slider {...settings}>
          {videoData.map((video, index) => (
            <Box
              key={video.id}
              sx={{
                position: "relative",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "350px",
                height: "500px",
                borderRadius: "30px",
                cursor: "pointer",
                zIndex: 3,
              }}
            >
              <img
                src={getThumbnailUrl(video.videoId)}
                alt={video.title}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  filter: index === currentIndex ? "none" : "grayscale(100%)",
                  opacity: index === currentIndex ? 1 : 0.5,
                  transition: "all 0.3s ease-in-out",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Container>
      */}

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Beranda", "Panduan", "Login"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              component={RouterLink}
              to={text == "Login" ? "/auth/login" : "/"}
            >
              <ListItemButton>
                <ListItemIcon>
                  {index == 0 ? <HomeIcon /> : ""}
                  {index == 1 ? <BookIcon /> : ""}
                  {index == 2 ? <PersonIcon /> : ""}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </OverviewWrapper>
  );
}
/*

      <Container maxWidth="lg">
        <Card sx={{ p: 10, my: 5, borderRadius: 12 }}>
          <Hero />
        </Card>
      </Container>
      */
export default Overview;
