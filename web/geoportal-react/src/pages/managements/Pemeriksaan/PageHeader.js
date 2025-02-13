import { Typography, Button, Grid } from "@mui/material";

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Status Pemeriksaan
        </Typography>
        <Typography variant="subtitle2">
          Pengelolaan Status Pemeriksaan
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
