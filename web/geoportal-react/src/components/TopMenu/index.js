import {
  Avatar,
  Button,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { Search, Menu, Apps, MoreVert } from "@mui/icons-material";
import logo from "./logo.png";
import sdi from "./sdi.png";
import big from "./big.png";
import { useState } from "react";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import environment from "src/config/environment";

// Styles with MUI sx or styled API
const Container = styled("div")({
  display: "flex",
  padding: "3px",
  height: "8vh",
  backgroundColor: "white",
  borderBottom: "0.5vh solid #2A63B5",
  alignItems: "center",
});

const LeftTopMenu = styled("div")({
  display: "flex",
  flexGrow: 2,
  justifyContent: "flex-start",
  alignItems: "center",
});

const Logo = styled("div")({
  paddingLeft: "10px",
});

const TopSearch = styled("div")({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
});

const RighTopMenu = styled("div")({
  display: "flex",
  paddingRight: "10px",
  alignItems: "center",
});

const AppContainer = styled("div")({
  padding: "0px 10px 10px 10px",
  width: "200px",
});

const ListApp = styled("ul")({
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  padding: "0px",
  justifyContent: "space-around",
});

const ItemApp = styled("li")({
  width: "120px",
  height: "80px",
  borderRadius: "5px",
  border: "1px solid #eee",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  margin: "5px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#eee",
  },
});

// Utility functions
function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function TopMenu({ idx }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [value, setValue] = useState(idx);

  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    let btn = document.getElementById("app");
    btn.style.backgroundColor = "#ddd";
  };

  const handleClose = () => {
    setAnchorEl(null);
    let btn = document.getElementById("app");
    btn.style.backgroundColor = "";
  };

  const handleChange = () => {
    setValue(1);
  };

  return (
    <Container>
      <LeftTopMenu>
        <Logo>
          <img
            src={process.env.PUBLIC_URL + "/static/images/logo/kukar-logo.png"}
            width="30"
            height="30"
            alt="Geoportal SJ"
          />
        </Logo>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 800,
            fontFamily: "finalsix, sans-serif",
            marginTop: 0,
            marginLeft: "1rem",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          Geoportal Kutai Kartanegara
        </h2>
      </LeftTopMenu>
      <TopSearch>{/* Search Bar Component can go here */}</TopSearch>
      <RighTopMenu>
        <Tabs value={idx} onChange={handleChange}>
          <Tab value={0} label="Beranda" component={RouterLink} to="/" />
          <Tab value={1} label="Katalog" component={RouterLink} to="/katalog" />

          <Tab
            value={2}
            label="Penyaji Peta"
            component={RouterLink}
            to="/peta"
          />
          <Tab
            value={3}
            label="Panduan Pengguna"
            component={RouterLink}
            to="/panduan"
          />

          <Tab
            value={4}
            label="Masuk Tata Kelola"
            component={RouterLink}
            to="/auth/login"
          />
        </Tabs>
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
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{ marginTop: "10px" }}
        >
          <AppContainer>
            <ListApp>
              <ItemApp
                onClick={() => window.open("https://tanahair.indonesia.go.id")}
              >
                <Avatar sx={{ bgcolor: "#df3344" }}>IG</Avatar>
                <Typography sx={{ fontSize: "12px" }}>Ina-Geoportal</Typography>
              </ItemApp>
              <ItemApp onClick={() => window.open("https://data.go.id")}>
                <Avatar sx={{ bgcolor: "#a13402" }}>SDI</Avatar>
                <Typography sx={{ fontSize: "12px" }}>Portal SDI</Typography>
              </ItemApp>
            </ListApp>
          </AppContainer>
        </Popover>
      </RighTopMenu>
    </Container>
  );
}
