import {
  Box,
  Button,
  Container,
  Card,
  Typography,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { Link as RouterLink } from "react-router-dom";

//import Hero from "./Hero";

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

function Overview() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>Geoportal Borobudur | Landing Page</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: "50px",
          zIndex: "1000",
          marginTop: "0px",
          width: "100%",
          margin: "0",
          padding: "0",
        }}
      >
        <Box
          sx={{
            display: "block",
            padding: "0 30px",
            float: "left",
            fontSize: "20px",
            width: "auto",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <a href="/">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/static/images/logo/logo_borobudur.png"
                }
                width="60"
                height="60"
                alt="Geoportal Borobudur"
              />
            </a>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: 800,
                fontFamily: "finalsix, sans-serif",
                marginTop: 0,
                marginBottom: "0.5rem",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              Geoportal Borobudur
            </h2>
          </Box>
        </Box>
        <Box
          sx={{
            display: "block",
            padding: "0 30px 0 0",
          }}
        >
          <Box>
            <Tabs textColor="secondary" indicatorColor="secondary">
              <Tab label="Beranda" component={RouterLink} to="/" />
              <Tab label="Katalog" component={RouterLink} to="/katalog" />
              <Tab label="Peta" component={RouterLink} to="/peta" />
              <Tab label="Tentang" component={RouterLink} to="/tentang" />
              <Tab
                label="Tata Kelola"
                component={RouterLink}
                to="/auth/login"
              />
            </Tabs>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          minHeight: "350px",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/static/images/bg_borobudur.jpg"}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <Box
          sx={{
            top: "35%",
            position: "absolute",
            left: "100px",
          }}
        >
          <LabelWrapper color="success">Version 4.1.0</LabelWrapper>

          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              fontFamily: "finalsix, sans-serif",
              marginTop: 0,
              marginBottom: "0.5rem",
              lineHeight: 1.2,
              color: "white",
            }}
          >
            Geoportal Borobudur
          </h2>
          <p
            style={{
              fontSize: "24px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 400,
              marginTop: 0,
              marginBottom: "0.5rem",
              lineHeight: "36px",
              color: "white",
            }}
          >
            Geoportal Simpul Jaringan
          </p>
        </Box>
      </Box>
      <Box
        sx={{
          display: "block",
          width: "100%",
          background: "#433E38",
          paddingTop: "40px",
        }}
      >
        <Box
          sx={{
            color: "#fff",
            display: "flex",
            padding: "60px",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              flex: "40%",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <h6
              style={{
                fontSize: "24px",
                marginTop: 0,
                marginBottom: "0.5rem",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              Geoportal Borobudur
            </h6>
            <p>
              Geoportal Borobudur adalah sebuah platform terintegrasi yang
              mengumpulkan, menyajikan, dan menyebarluaskan data dan informasi
              geospasial yang menjadi tanggung jawab dan kewenangan unit
              produksi dan walidata.
            </p>
            <ul style={{ display: "flex", padding: "0px" }}>
              <li
                style={{
                  listStyle: "none",
                  margin: "0px 15px 0px 0px",
                  background: "#fff",
                  borderRadius: "50%",
                  height: "48px",
                  width: "48px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://www.facebook.com/direktorat"
                  target="_blank"
                  style={{ display: "inlineFlex", alignItems: "center" }}
                >
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/static/images/logo/facebook.png"
                    }
                    alt=""
                    style={{ verticalAlign: "middle" }}
                  />
                </a>
              </li>
              <li
                style={{
                  listStyle: "none",
                  margin: "0px 15px 0px 0px",
                  background: "#fff",
                  borderRadius: "50%",
                  height: "48px",
                  width: "48px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://www.instagram.com/direktorat/"
                  target="_blank"
                  style={{ display: "inlineFlex", alignItems: "center" }}
                >
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/static/images/logo/instagram.png"
                    }
                    alt=""
                    style={{ verticalAlign: "middle" }}
                  />
                </a>
              </li>
              <li
                style={{
                  listStyle: "none",
                  margin: "0px 15px 0px 0px",
                  background: "#fff",
                  borderRadius: "50%",
                  height: "48px",
                  width: "48px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://www.youtube.com/channel/direktorat"
                  target="_blank"
                  style={{ display: "inlineFlex", alignItems: "center" }}
                >
                  <img
                    src={
                      process.env.PUBLIC_URL + "/static/images/logo/youtube.png"
                    }
                    alt=""
                    style={{ verticalAlign: "middle" }}
                  />
                </a>
              </li>
            </ul>
          </Box>
          <Box
            sx={{
              flex: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "80px",
                height: "80px",
                marginRight: "15px",
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/static/images/logo/Frame.png"}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>
            <Box>
              <p>KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN</p>
              <p>
                DIREKTORAT JENDERAL PLANOLOGI KEHUTANAN DAN TATA LINGKUNGAN{" "}
              </p>
              <p>DIREKTORAT INVENTARISASI DAN PEMANTAUAN SUMBER DAYA HUTAN</p>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            textAlign: "center",
            borderTop: "solid 1px #7d766f",
            backgroundColor: "#433E38",
            color: "#fff",
            display: "block",
            justifyContent: "center",
            alignItems: "center",
            height: "60px",
            width: "100%",
            paddingTop: "15px",
          }}
        >
          <p>Copyright © Direktorat IPSDH - 2023. All rights reserved.</p>
        </Box>
      </Box>
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
