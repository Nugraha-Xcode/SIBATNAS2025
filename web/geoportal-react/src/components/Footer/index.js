import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Link, Typography, styled } from "@mui/material";

// Site Settings
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting";

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  // Site Settings
  const siteSetting = useSelector((state) => state.siteSetting);

  const dispatch = useDispatch();
  
    // Site Settings
  useEffect(() => {
    dispatch(retrievePublicSiteSettings());
  }, []);

  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: "block", md: "flex" }}
        alignItems="center"
        textAlign={{ xs: "center", md: "left" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2024 - {siteSetting?.name} Dashboard
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 },
          }}
          variant="subtitle1"
        >
          Powered by{" "}
          <Link
            href="https://sibatnas.big.go.id/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SIBATNAS
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
