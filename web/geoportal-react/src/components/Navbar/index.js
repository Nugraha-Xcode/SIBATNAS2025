import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Box, Toolbar, Button, Container } from "@mui/material";

import nama from "src/assets/namaBig.svg";
import logoBig from "src/assets/logobig.svg";

function NavbarComponent() {
  const [isSticky, setIsSticky] = useState(false);
  
  useEffect(() => {
    // Mengambil posisi awal navbar
    const navbar = document.getElementById("navbar");
    const navbarPosition = navbar ? navbar.offsetTop : 0;
    
    const handleScroll = () => {
      // Jika posisi scroll melebihi posisi awal navbar + 50px, jadikan sticky
      if (window.pageYOffset > navbarPosition + 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pages = [
    { name: "BERANDA", link: "/" },
    { name: "PETA", link: "/peta" },
    { name: "CARI", link: "/katalog" },
    { name: "BERITA", link: "/berita" },
    { name: "PANDUAN PENGGUNA", link: "/panduan" },
    { name: "BATNAS", link: "/batnas" },
    { name: "DEMNAS", link: "/demnas" },
  ];

  return (
    <Box id="navbar-wrapper" sx={{ position: "relative" }}>
      <AppBar 
        id="navbar"
        color="inherit" 
        elevation={0}
        sx={{
          position: isSticky ? "fixed" : "static",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          transition: "all 0.4s ease",
          boxShadow: isSticky ? "0px 2px 10px rgba(0,0,0,0.1)" : "none",
          padding: "5px 0",
          zIndex: 1000,
        }}
      >
        <Container 
          maxWidth={isSticky ? "xl" : "lg"}
          disableGutters={isSticky}
          sx={{
            transition: "all 0.4s ease",
            px: isSticky ? 2 : 4,
            mx: isSticky ? 0 : "auto",
          }}
        >
          <Toolbar sx={{ 
            transition: "all 0.4s ease",
            height: isSticky ? "70px" : "80px",
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img 
                src={logoBig} 
                alt="Logo" 
                width={isSticky ? "45" : "50"} 
                height={isSticky ? "45" : "50"} 
                style={{ transition: "all 0.4s ease" }}
              />
              <img 
                src={nama} 
                alt="Logo" 
                width={isSticky ? "180" : "200"} 
                height={isSticky ? "27" : "30"} 
                style={{ transition: "all 0.4s ease", marginLeft: "8px" }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.link}
                  sx={{ 
                    color: "black", 
                    fontWeight: 700, 
                    fontSize: isSticky ? "0.9rem" : "1rem",
                    transition: "all 0.4s ease",
                    mx: 0.5
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Button
              size="small"
              variant="contained"
              component={RouterLink}
              to="/auth/login"
              sx={{ 
                ml: 1, 
                transition: "all 0.4s ease",
                fontSize: isSticky ? "0.8rem" : "0.875rem",
                py: isSticky ? 0.8 : 1
              }}
            >
              MASUK
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Tambahkan placeholder untuk menghindari konten melompat saat navbar menjadi fixed */}
      {isSticky && (
        <Box sx={{ height: "80px" }} />
      )}
    </Box>
  );
}

export default NavbarComponent;