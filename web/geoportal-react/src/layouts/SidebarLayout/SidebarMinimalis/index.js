import React, { useContext } from "react";
import {
  Box,
  Divider,
  Button,
  Drawer,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { alpha, darken, lighten, useTheme } from "@mui/material/styles";
import { SidebarContext } from "src/contexts/SidebarContext";
import Scrollbar from "src/components/Scrollbar";
import Logo from "src/components/LogoSign";
import SidebarMenu from "./SidebarMenu"; // Replace with your actual SidebarMenu
import HomeIcon from "@mui/icons-material/Home"; // Example icon, replace with actual ones
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";

const SidebarWrapper = ({ children, ...rest }) => (
  <Box
    sx={{
      width: { xs: "70px", lg: "240px" },
      transition: "width 0.3s ease",
      "&:hover": {
        width: "240px",
      },
    }}
    {...rest}
  >
    {children}
  </Box>
);

function SidebarMinimalis() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: "none",
            lg: "inline-block",
          },
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          background:
            theme.palette.mode === "dark"
              ? alpha(lighten(theme.header.background, 0.1), 0.5)
              : darken(theme.colors.alpha.black[100], 0.5),
          boxShadow:
            theme.palette.mode === "dark" ? theme.sidebar.boxShadow : "none",
        }}
      >
        <Scrollbar>
          <Box mt={1} display="flex" justifyContent="center">
            <Logo />
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          />
          <List>
            <SidebarMenu />
          </List>
        </Scrollbar>
        <Divider sx={{ background: theme.colors.alpha.trueWhite[10] }} />
        <Box p={2}>
          <Button
            href="https://sibatnas.big.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="success"
            size="small"
            fullWidth
          >
            Powered by SIBATNAS
          </Button>
        </Box>
      </SidebarWrapper>
      <Drawer
        sx={{ boxShadow: `${theme.sidebar.boxShadow}` }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === "dark"
                ? theme.colors.alpha.white[100]
                : darken(theme.colors.alpha.black[100], 0.5),
          }}
        >
          <Scrollbar>
            <Box mt={3} display="flex" justifyContent="center">
              <Logo />
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[10],
              }}
            />
            <List>
              <SidebarMenu />
            </List>
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default SidebarMinimalis;
