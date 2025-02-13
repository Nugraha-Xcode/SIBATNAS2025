import { Typography, Button, Grid } from "@mui/material";

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Data Produsen
        </Typography>
        <Typography variant="subtitle2">Pengelolaan Data Produsen</Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
