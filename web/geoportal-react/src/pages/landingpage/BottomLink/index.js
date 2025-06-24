import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// Site Settings
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";
import environment from "src/config/environment";
function BottomLink() {
  // Site Settings
    const siteSetting = useSelector((state) => state.siteSetting);
    
    const dispatch = useDispatch();
  
    // Site Settings
      useEffect(() => {
        dispatch(retrievePublicSiteSettings());
      }, []);

  return (
    <Container maxWidth="md">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item lg={3} xs={12} sx={{ color: "white" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textDecoration: "underline" }}
          >
            Menu
          </Typography>
          <Typography variant="body2">
            <Box
              component={RouterLink}
              to="/"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Beranda
            </Box>
            <br />
            <Box
              component={RouterLink}
              to="/katalog"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Katalog
            </Box>
            <br />
            <Box
              component={RouterLink}
              to="/peta"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Peta
            </Box>
            <br />

            <Box
              component={RouterLink}
              to="/panduan"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Panduan Pengguna
            </Box>
            <br />

            <Box
              component={RouterLink}
              to="/auth/login"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              Masuk Tata Kelola
            </Box>
          </Typography>
        </Grid>
        <Grid item lg={3} xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            color="white"
            sx={{ textDecoration: "underline" }}
          >
            Referensi
          </Typography>
          <Typography variant="body2">
            <Box
              component={RouterLink}
              to="https://tanahair.indonesia.go.id"
              target="_blank"
              sx={{
                color: "white",
                textDecoration: "none",
                mb: "10px",
              }}
            >
              Ina-Geoportal
            </Box>
            <br />
            <Box
              component={RouterLink}
              to="https://kugi.ina-sdi.or.id"
              target="_blank"
              sx={{ color: "white", textDecoration: "none", mb: 10 }}
            >
              KUGI
            </Box>
            <br />
            <Box
              component={RouterLink}
              to={environment.api}
              target="_blank"
              sx={{ color: "white", textDecoration: "none", mb: 10 }}
            >
              API SIKAMBING
            </Box>
            <br />
            <Box
              component={RouterLink}
              to={environment.csw}
              target="_blank"
              sx={{ color: "white", textDecoration: "none", mb: 10 }}
            >
              CSW
            </Box>
            <br />
          </Typography>
        </Grid>
        <Grid item lg={3} xs={12} sx={{ color: "#fff" }}>
          <Typography variant="h4" gutterBottom color="white">
            Kontak Kami
          </Typography>
          <p>
            {siteSetting?.institusi} 
            <br />
            {siteSetting?.alamat}
            <br />
            Email: {siteSetting?.email}
            <br />
            Telp: {siteSetting?.telp}
            <br />
            Fax: {siteSetting?.fax}
          </p>
          
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "20px",
                  width: "200px",
                }}
              >
                <Box
                  component="img"
                  src={
                    process.env.PUBLIC_URL + "/static/images/logo/facebook.png"
                  }
                  alt="Logo Facebook"
                  sx={{ maxWidth: "100%" }}
                />

                <Box
                  component="img"
                  src={
                    process.env.PUBLIC_URL + "/static/images/logo/instagram.png"
                  }
                  alt="Logo Instagram"
                  sx={{ maxWidth: "100%" }}
                />
                <Box
                  component="img"
                  src={
                    process.env.PUBLIC_URL + "/static/images/logo/youtube.png"
                  }
                  alt="Logo Youtube"
                  sx={{ maxWidth: "100%" }}
                />
              </Box> */}
             
        </Grid>
        <Grid item lg={3} xs={12}>
          <Typography variant="h4" gutterBottom color="white">
            Dikelola oleh:
          </Typography>
          <br />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Box
              component="img"
              src={process.env.PUBLIC_URL + "/static/images/logo/logo-big.png"}
              alt="Logo"
              sx={{ width: "90px", height: "100px" }}
            />
            <Box
              component="img"
              src={`${environment.api}site-settings/logo`}
              alt={`logo ${siteSetting?.name || 'SIBATNAS'}`}
              sx={{ width: "90px", height: "100px" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
export default BottomLink;
