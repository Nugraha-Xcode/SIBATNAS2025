import { Typography } from "@mui/material";

import { useSelector } from "react-redux";
function PageHeader() {
  const { user: currentUser } = useSelector((state) => state.auth);
  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="subtitle2">
        {currentUser.username}, this could be your user profile panel.
      </Typography>
    </>
  );
}

export default PageHeader;
