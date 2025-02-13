import { Typography, Avatar, Grid, useTheme } from "@mui/material";

import { useSelector } from "react-redux";
function PageHeader() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {currentUser.username}!
        </Typography>
        <Typography variant="subtitle2">
          Today is a good day to work!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
/*
 <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8),
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      */
