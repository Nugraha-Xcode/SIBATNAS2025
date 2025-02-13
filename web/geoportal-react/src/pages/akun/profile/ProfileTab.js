import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  ListItemAvatar,
  Avatar,
  Switch,
  CardHeader,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  useTheme,
  styled,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { format, subHours, subWeeks, subDays } from "date-fns";
import ProfileDialog from "./ProfileDialog";

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function ProfileTab() {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialConfig = {
    data: null,
    title: "Ubah Profile",
    mode: "edit",
    action: "Save",
    description: "Silahkan isi form berikut untuk mengubah profile.",
  };
  const [config, setConfig] = useState(initialConfig);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickAdd = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid container spacing={3}>
      {/*
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Social Accounts</Typography>
          <Typography variant="subtitle2">
            Manage connected social accounts options
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemAvatar sx={{ pr: 2 }}>
                <AvatarWrapper src="/static/images/logo/google.svg" />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Google"
                secondary="A Google account hasn’t been yet added to your account"
              />
              <Button color="secondary" size="large" variant="contained">
                Connect
              </Button>
            </ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemAvatar sx={{ pr: 2 }}>
                <AvatarSuccess>
                  <DoneTwoToneIcon />
                </AvatarSuccess>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Facebook"
                secondary="Your Facebook account has been successfully connected"
              />
              <ButtonError size="large" variant="contained">
                Revoke access
              </ButtonError>
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ p: 3 }}>
              <ListItemAvatar sx={{ pr: 2 }}>
                <AvatarSuccess>
                  <DoneTwoToneIcon />
                </AvatarSuccess>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Twitter"
                secondary="Your Twitter account was last syncronized 6 days ago"
              />
              <ButtonError size="large" variant="contained">
                Revoke access
              </ButtonError>
            </ListItem>
          </List>
        </Card>
      </Grid>
              */}
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Profile</Typography>
          <Typography variant="subtitle2">Change your profile here</Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Change Profile"
                secondary="You can change your profile here"
              />
              <Tooltip placement="top" title="Change Profile" arrow>
                <Button
                  sx={{ mt: { xs: 2, md: 0 }, mr: 1 }}
                  size="large"
                  variant="outlined"
                  startIcon={<EditTwoToneIcon fontSize="small" />}
                  onClick={handleClickAdd}
                >
                  Change Profile
                </Button>
              </Tooltip>
            </ListItem>
            {/*
            <Divider component="li" />
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary="Two-Factor Authentication"
                secondary="Enable PIN verification for all sign in attempts"
              />
              <Switch color="primary" />
            </ListItem>
            */}
          </List>
        </Card>
        <ProfileDialog open={open} onClose={handleClose} config={config} />
      </Grid>
    </Grid>
  );
}

export default ProfileTab;
