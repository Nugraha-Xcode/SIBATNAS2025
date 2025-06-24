import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import MenuIcon from "@mui/icons-material/Menu";

// Site Settings
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";
import environment from "src/config/environment";

function Header() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  // Site Settings
  const siteSetting = useSelector((state) => state.siteSetting);
  
  const dispatch = useDispatch();

  // Site Settings
    useEffect(() => {
      dispatch(retrievePublicSiteSettings());
    }, []);

  const location = useLocation(); // Get the current location
  //console.log(location.pathname);
  //const currentPath = location.pathname.split("/").pop();
  //console.log(currentPath);

  function getIdx(path) {
    var idx = "";
    switch (path) {
      case "/":
        idx = 0;
        break;
      case "/katalog":
        idx = 1;
        break;
      case "/peta":
        idx = 2;
        break;
      case "/panduan":
        idx = 3;
        break;
      case "/login":
        idx = -1;
        break;
      default:
        idx = 99;
    }

    return idx;
  }

  const key = getIdx(location.pathname);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
      <Box
        sx={{
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          top: isMobile ? "60px" : "20px",
          margin: isMobile ? "0px 5%" : "0px 10%",
          paddingBottom: key == "0" ? "0px" : "20px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "block",
            float: "left",
            fontSize: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <a href="/">
              <img
                src={`${environment.api}site-settings/logo`}
                width="60"
                height="72"
                alt={`logo ${siteSetting?.name || 'SIBATNAS'}`}
              />
            </a>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                fontFamily: "finalsix, sans-serif",
                marginTop: 0,
                marginLeft: "1rem",
                marginBottom: "0.5rem",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              {siteSetting?.name}
            </h2>
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "finalsix, sans-serif",
            marginTop: 0,
            marginBottom: "0.5rem",
            lineHeight: 1.2,
            color: "white",
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/"
                  onClick={handleMenuClose}
                >
                  Beranda
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/panduan"
                  onClick={handleMenuClose}
                >
                  Katalog
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/peta"
                  onClick={handleMenuClose}
                >
                  Peta
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/panduan"
                  onClick={handleMenuClose}
                >
                  Panduan Pengguna
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/auth/login"
                  onClick={handleMenuClose}
                >
                  Masuk Tata Kelola
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tabs value={key}>
              <Tab
                value={0}
                label="Beranda"
                component={RouterLink}
                to="/"
                sx={{ color: "#ffffff" }}
              />
              <Tab
                value={1}
                label="Katalog"
                component={RouterLink}
                to="/katalog"
                sx={{ color: "#ffffff" }}
              />

              <Tab
                value={2}
                label="Peta"
                component={RouterLink}
                to="/peta"
                sx={{ color: "#ffffff" }}
              />
              <Tab
                value={3}
                label="Panduan Pengguna"
                component={RouterLink}
                to="/panduan"
                sx={{ color: "#ffffff" }}
              />

              <Tab
                label="Masuk Tata Kelola"
                component={RouterLink}
                to="/auth/login"
                sx={{ color: "#ffffff" }}
              />
            </Tabs>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Header;
