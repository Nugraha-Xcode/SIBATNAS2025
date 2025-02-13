import "./Landing.css";
import styled from "styled-components";
import Config from "./config.json";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useState } from "react";

import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import TopMenu from "./components/TopMenu";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

import BottomMenu from "./components/BottomMenu";
import Carousel from "react-material-ui-carousel";

import logo from "./logo.png";
import sdi from "./sdi.png";
import big from "./big.png";
import { Apps, MoreVert } from "@material-ui/icons";
import { useLocation } from "react-router-dom";

import { Avatar, Popover, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

function Item(props) {
  return (
    <section
      id="geo-hero"
      style={{
        backgroundImage: "url('" + process.env.PUBLIC_URL + "/maps.jpg')",
      }}
    >
      <div className="container d-flex align-items-center">
        <div className="geo-hero-text">
          <h2>{props.item.name}</h2>
          <p style={{ color: "white" }}>
            Platform terintegrasi untuk pengelolaan dan berbagi-pakai data
            spasial.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "30px",
          }}
        >
          <Paper
            component="form"
            style={{
              padding: "4px 10px",
              display: "flex",
              border: "1px solid #000",
              alignItems: "center",
              justifyContent: "space-between",
              width: 400,
            }}
          >
            <InputBase
              placeholder="Search Dataset"
              inputProps={{ "aria-label": "search dataset" }}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
    </section>
  );
}

const TopUpStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: "red",
    "&.active": {
      backgroundColor: "black",
    },
  },
  title: {
    fontSize: "12px",
  },
}));

function Landing() {
  const classes = TopUpStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open2 = Boolean(anchorEl);
  const id = open2 ? "simple-popover" : undefined;
  const location = useLocation();

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    let btn = document.getElementById("app");
    btn.style.backgroundColor = "";
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    let btn = document.getElementById("app");
    btn.style.backgroundColor = "#ddd";
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "10vh",
          backgroundColor: "rgba(255,255,255, 0.65)",
          zIndex: 990,
          position: "fixed",
          padding: "1em 3em 1em 3em",
        }}
      >
        <LeftTopMenu>
          <Logo>
            <img src={big} alt="logo badan informasi geospasial" width="85px" />
          </Logo>
          <h2>Geoportal Badan Informasi Geospasial</h2>
        </LeftTopMenu>
        <RightTopMenu>
          <Button
            variant={location?.pathname === "/" ? "outlined" : "text"}
            style={{
              marginRight: "10px",
              padding: "5px 15px",
              borderRadius: "20px",
            }}
            href="#/"
          >
            Beranda
          </Button>
          <Button
            variant={location?.pathname === "/katalog" ? "outlined" : "text"}
            style={{
              marginRight: "10px",
              padding: "5px 15px",
              borderRadius: "20px",
            }}
            href="#/katalog"
          >
            Katalog
          </Button>
          <Button
            variant={location?.pathname === "/viewer" ? "outlined" : "text"}
            style={{
              marginRight: "10px",
              padding: "5px 15px",
              borderRadius: "20px",
            }}
            href="#/viewer"
          >
            Peta
          </Button>
          <Button
            href={Config.api_domain + "/"}
            style={{
              marginRight: "10px",
              padding: "5px 15px",
              borderRadius: "20px",
            }}
          >
            API
          </Button>
          <IconButton onClick={handleClick} id="app">
            <MoreVert />
          </IconButton>
          <Logo>
            <img src={logo} alt="logo geospasial untuk negeri" width="145px" />
          </Logo>
          <Logo>
            <img src={sdi} alt="logo satu data indonesia" width="75px" />
          </Logo>
          <Popover
            id={id}
            open={open2}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            style={{ marginTop: "10px" }}
          >
            <AppContainer>
              <ListApp>
                <ItemApp
                  onClick={() =>
                    window.open("https://tanahair.indonesia.go.id")
                  }
                >
                  <Avatar style={{ backgroundColor: "#df3344" }}>IG</Avatar>
                  <Typography className={classes.title}>
                    Ina-Geoportal
                  </Typography>
                </ItemApp>

                <ItemApp onClick={() => window.open("https://data.go.id")}>
                  <Avatar style={{ backgroundColor: "#a13402" }}>SDI</Avatar>
                  <Typography className={classes.title}>Portal SDI</Typography>
                </ItemApp>
              </ListApp>
            </AppContainer>
          </Popover>
        </RightTopMenu>
      </div>
      <div style={{ width: "100%", height: "100vh" }}>
        <Carousel
          duration="500"
          indicators={false}
          navButtonsAlwaysVisible={true}
          stopAutoPlayOnHover={false}
        >
          <div
            id="slider1"
            style={{
              backgroundSize: "100% 100%",
              backgroundImage:
                "url('" + process.env.PUBLIC_URL + "/kantor.jpg')",
              width: "100%",
              height: "100vh",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "18vh",
              }}
            ></div>
          </div>
          <div
            id="slider4"
            style={{
              backgroundSize: "100% 100%",
              backgroundImage: "url('" + process.env.PUBLIC_URL + "/rbi.jpg')",
              width: "100%",
              height: "100vh",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  color: "rgba(42,99,181, 1)",
                  textAlign: "center",
                  lineHeight: "1.5em",
                }}
              >
                Platform terintegrasi <br />
                untuk pengelolaan dan berbagi-pakai <br />
                data spasial.
              </h1>
              {
                //rgba(42,99,181,var(--tw-bg-opacity))
              }
              <Button
                variant="contained"
                style={{ padding: "10px 30px", borderRadius: "30px" }}
                color="primary"
                disableElevation
                href="#/katalog"
              >
                Cari Dataset
              </Button>
            </div>
          </div>
          <div
            id="slider2"
            style={{
              backgroundSize: "100% 100%",
              backgroundImage:
                "url('" + process.env.PUBLIC_URL + "/bg_produk_big.jpg')",
              width: "100%",
              height: "100vh",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "#555",
                  paddingBottom: "1em",
                  textAlign: "center",
                }}
              >
                "Badan Informasi Geospasial mempunyai tugas melaksanakan tugas
                pemerintahan di bidang Informasi Geospasial"
              </h2>
            </div>
          </div>
          {/*
						<div id="slider3" style={{ filter: 'opacity(20%)', backgroundSize: "100% 100%", backgroundImage: "url('" + process.env.PUBLIC_URL + "/kantor_big.jpg')", width: "100%", height: "100vh" }}></div>
					
						<div id="slider5" style={{ filter: 'opacity(20%)', filter: 'saturate(2)', backgroundSize: "100% 100%", backgroundImage: "url('" + process.env.PUBLIC_URL + "/maps.jpg')", width: "100%", height: "100vh" }}></div>
						*/}
        </Carousel>
        <div
          style={{
            height: "80vh",
            backgroundSize: "100% 100%",
            backgroundImage:
              "url('" + process.env.PUBLIC_URL + "/bg-ripple.png')",
          }}
        >
          <div
            id="content"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h1
              style={{
                color: "rgba(42,99,181, 1)",
                paddingTop: "3em",
                marginBottom: "1em",
              }}
            >
              Geoportal SJ BIG
            </h1>
            <h4
              style={{
                width: "50%",
                color: "rgba(42,90,151, 1)",
                padding: "30px",
                borderRadius: "30px",
                backgroundColor: "rgba(200,200,200,0.4)",
                fontSize: "18px",
                textAlign: "center",
                lineHeight: "2rem",
              }}
            >
              Geoportal SJ BIG adalah sebuah platform terintegrasi yang
              mengumpulkan, menyajikan, dan menyebarluaskan data dan informasi
              geospasial yang menjadi tanggung jawab dan kewenangan unit
              produksi dan walidata di Badan Informasi Geospasial.
            </h4>
            <div></div>
          </div>
        </div>
        <div style={{ height: "30vh", background: "#233568" }}>
          <div
            id="subfooter"
            style={{
              display: "flex",
              padding: "1em 3em",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: "white",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <h3
                style={{ textDecoration: "underline", marginBlockEnd: "0px" }}
              >
                Didukung oleh:
              </h3>
              <p
                style={{
                  color: "white",
                  lineHeight: "1.5em",
                  fontSize: "12px",
                }}
              >
                - SIKAMBING
                <br />- Palapa BIG
              </p>
            </div>
            <div style={{ color: "white", textAlign: "right" }}>
              <h3 style={{ textDecoration: "underline" }}>Hubungi Kami </h3>
              <p
                style={{
                  color: "white",
                  lineHeight: "1.5em",
                  fontSize: "12px",
                }}
              >
                Badan Informasi Geospasial <br />
                Jl. Raya Jakarta - Bogor KM. 46, Kabupaten Bogor, 16911, Jawa
                Barat, Indonesia
                <br />
                021-8753155
                <br />
                021-87901255
                <br />
                helpdesk.nsdi@big.go.id
              </p>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "black",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "white",
                padding: "10px",
                fontSize: "14px",
              }}
            >
              Copyright © 2021 Badan Informasi Geospasial All Right Reserved
            </div>
          </div>
        </div>
      </div>
      {/*
				position: fixed;
	z-index: 990;
					<div style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "8vh", backgroundColor: 'rgba(255,0,0,0)' }}>
				<p>TopMenu</p>
			</div>
			<div style={{ width: "100%", height: "100vh" }}>
				<div style={{ width: "100%", height: "100vh", background: 'grey' }}>
					<p id="slider">slider</p>
				</div>
				<div style={{height:"100vh", background:'white', border:"solid 1px #000"}}>
					<p id="content">content</p>
				</div>
			</div>
	
					<div style={{height:"100vh", background:'grey'}}>
					<p id="slider">slider</p>
				</div>
				<div style={{height:"100vh", background:'white', border:"solid 1px #000"}}>
					<p id="content">content</p>
				</div>
				<div style={{ height:"100vh", border:"solid 1px #000"}}>
					<p id="feature">feature</p>
				</div>
				<div style={{ height:"25vh", padding:"3em", background:"black"}}>
					<div style={{display:"flex", }}>
	
					</div>
				</div>
				
				<Slider />
				<section id="geo-hero" style={{}}>
					<div className="container d-flex align-items-center">
						<div className="geo-hero-text">
							<h2>Geoportal BIG</h2>
							<p style={{ color: "white" }}>
								Geoportal BIG adalah satu platform terintegrasi
							</p>
						</div>
					</div>
				</section>
				<section id="geo-hero" style={{}}>
					<div className="container d-flex align-items-center">
						<div className="geo-hero-text">
							<h2>Tautan Website terkait</h2>
							<p style={{ color: "white" }}>
								Inageoportal TanahAir
							</p>
						</div>
					</div>
				</section>
				<section id="geo-cta">
					<div className="container">
						<h2>Anda mengalami kesulitan?</h2>
						<p>Silahkan gunakan layanan bantuan berikut</p>
						<ul>
							<li><a href={Config.base_domain + "help.html"}>Cari data <i class="las la-angle-right"></i></a></li>
							<li><a href={Config.base_domain + "guidelines.html"} >Panduan<i class="las la-angle-right"></i></a></li>
						</ul>
					</div>
				</section>
				<div style={{ borderTop: "2px solid #000" }}>
					<BottomMenu />
				</div>
				*/}
    </div>
  );
}

export default Landing;

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const Logo = styled.div`
  padding-left: 10px;
`;

const LeftTopMenu = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
`;

const RightTopMenu = styled.div`
  display: flex;
  padding-right: 5em;
  align-items: center;
`;

const AppContainer = styled.div`
  padding: 0px 10px 10px 10px;
  width: 200px;
`;

const ListApp = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0px;
  justify-content: space-around;
`;

const ItemApp = styled.li`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 5px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
    /*box-shadow: 4px 4px 8px 0 rgba(0, 0, 255, 0.2)*/
  }
`;
