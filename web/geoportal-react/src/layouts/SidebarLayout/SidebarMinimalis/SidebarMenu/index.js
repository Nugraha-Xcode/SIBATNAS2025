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
import HomeIcon from "@mui/icons-material/Home";

const SidebarMenu = () => {
  const theme = useTheme();

  return (
    <List>
      <Tooltip title="Home" placement="right" arrow>
        <ListItem
          button
          sx={{
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </Tooltip>
      {/* Add more menu items here */}
    </List>
  );
};
export default SidebarMenu;
