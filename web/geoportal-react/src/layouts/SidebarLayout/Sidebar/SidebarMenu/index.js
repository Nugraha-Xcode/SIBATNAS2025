import { useContext, useState } from "react";

import { useSelector } from "react-redux";
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";
import { SidebarContext } from "src/contexts/SidebarContext";

import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import BrightnessLowTwoToneIcon from "@mui/icons-material/BrightnessLowTwoTone";
import MmsTwoToneIcon from "@mui/icons-material/MmsTwoTone";
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";

import BallotTwoToneIcon from "@mui/icons-material/BallotTwoTone";
import BeachAccessTwoToneIcon from "@mui/icons-material/BeachAccessTwoTone";
import EmojiEventsTwoToneIcon from "@mui/icons-material/EmojiEventsTwoTone";
import FilterVintageTwoToneIcon from "@mui/icons-material/FilterVintageTwoTone";
import HowToVoteTwoToneIcon from "@mui/icons-material/HowToVoteTwoTone";
import LocalPharmacyTwoToneIcon from "@mui/icons-material/LocalPharmacyTwoTone";
import RedeemTwoToneIcon from "@mui/icons-material/RedeemTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import TrafficTwoToneIcon from "@mui/icons-material/TrafficTwoTone";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import ChromeReaderModeTwoToneIcon from "@mui/icons-material/ChromeReaderModeTwoTone";
import WorkspacePremiumTwoToneIcon from "@mui/icons-material/WorkspacePremiumTwoTone";
import CameraFrontTwoToneIcon from "@mui/icons-material/CameraFrontTwoTone";
import DisplaySettingsTwoToneIcon from "@mui/icons-material/DisplaySettingsTwoTone";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
 
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
     
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      .MuiListItemButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }
      .MuiListItem-root {
        padding: 1px 0;
 
        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }

        
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);

  const { user: currentUser } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [openMetadata, setOpenMetadata] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const toggleMenuMetadata = () => {
    setOpenMetadata(!openMetadata);
  };

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/overview"
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Overview
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Akun
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/akun/profile/details"
                  startIcon={<AccountCircleTwoToneIcon />}
                >
                  User Profile
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/akun/profile/settings"
                  startIcon={<DisplaySettingsTwoToneIcon />}
                >
                  Account Settings
                </Button>
              </ListItem>
              {/*
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/akun/profile/aktivitas"
                  startIcon={<BrightnessLowTwoToneIcon />}
                >
                  Activity
                </Button>
              </ListItem>
              */}
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/akun/profile/notifikasi"
                  startIcon={<MmsTwoToneIcon />}
                >
                  Notification
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        {currentUser.roles.includes("ROLE_ADMIN") ? (
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Sistem
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                {/*
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/systems/settings"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Settings
                  </Button>
                </ListItem>
                */}
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/systems/user"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    User
                  </Button>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ""
        )}

        {currentUser.roles.includes("ROLE_ADMIN") ? (
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Master Referensi
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/managements/igt"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    IGT dan Produsen
                  </Button>
                </ListItem>
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/managements/keywords"
                    startIcon={<DesignServicesTwoToneIcon />}
                  >
                    Keywords
                  </Button>
                </ListItem>
                {/*<ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/managements/produsen"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Produsen
                  </Button>
                </ListItem>
                */}
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/managements/pemeriksaan"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Pemeriksaan
                  </Button>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>
        ) : (
          ""
        )}

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Data
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItemButton onClick={toggleMenu}>
                <ListItemText primary="Manage Data Geospasial" />
                {open ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/data/produsen"
                      startIcon={<DesignServicesTwoToneIcon />}
                    >
                      Daftar Data Vektor
                    </Button>
                  </ListItem>
                  {/* <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/data-raster"
                      startIcon={<DesignServicesTwoToneIcon />}
                    >
                      Daftar Data Raster
                    </Button>
                  </ListItem>
                  */}
                </List>
              </Collapse>
            </List>
          </SubMenuWrapper>
        </List>
        {/*
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Metadata
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItemButton onClick={toggleMenuMetadata}>
                <ListItemText primary="Manage Metadata" />
                {openMetadata ? (
                  <ExpandLessTwoToneIcon />
                ) : (
                  <ExpandMoreTwoToneIcon />
                )}
              </ListItemButton>
              <Collapse in={openMetadata} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/metadata/daftar"
                      startIcon={<DesignServicesTwoToneIcon />}
                    >
                      Metadata Spasial
                    </Button>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </SubMenuWrapper>
        </List>*/}

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Publikasi Data
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {currentUser.roles.includes("ROLE_ADMIN") ||
              currentUser.roles.includes("ROLE_PRODUSEN") ||
              currentUser.roles.includes("ROLE_WALIDATA") ? (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/data/pemeriksaan"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Pemeriksaan
                  </Button>
                </ListItem>
              ) : (
                ""
              )}
              {currentUser.roles.includes("ROLE_ADMIN") ||
              currentUser.roles.includes("ROLE_WALIDATA") ? (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    //href={process.env.PUBLIC_URL + "/data/publikasi"}
                    to="/data/publikasi"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Publikasi Geoservice
                  </Button>
                </ListItem>
              ) : (
                ""
              )}
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  //href={process.env.PUBLIC_URL + "/data/publikasi"}
                  to="/data/publikasi-csw"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Publikasi CSW
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
