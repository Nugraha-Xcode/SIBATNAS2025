import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";

import { Box } from "@mui/material";

import Header from "src/components/Navbar";

const BaseLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    //console.log(location.pathname);
    //setValue(getIdx(location.pathname));
    //console.log(value);
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        backgroundColor: "#F6F9FC",
      }}
    >
      {location.pathname == "/auth/login" ? "" : <Header />}
      {children || <Outlet />}
    </Box>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseLayout;
