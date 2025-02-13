import { Box } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        display: "block",
        width: "100%",
        background: "black",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          color: "#fff",
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
          width: "100%",
          padding: "10px",
        }}
      >
        <p>
          Copyright © Badan Informasi Geospasial - 2024. All rights reserved.
        </p>
      </Box>
    </Box>
  );
}
export default Footer;
