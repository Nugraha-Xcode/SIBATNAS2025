import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import {
  Box,
  Typography,
  Card,
  Grid,
  Container,
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

import Footer from "src/components/Footer";

import RecentOrders from "./RecentOrders";

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

function SystemsSettings() {
  return (
    <>
      <Helmet>
        <title>Systems - Settings</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {/*
          <Grid item xs={12}>
            <Box pb={2}>
              <Typography variant="h3">Geoserver</Typography>
              <Typography variant="subtitle2">
                Opsi pengaturan Geoserver
              </Typography>
            </Box>
            <Card>
              <List>
                <ListItem sx={{ p: 3 }}>
                  <ListItemAvatar sx={{ pr: 2 }}>
                    <AvatarWrapper
                      src={
                        process.env.PUBLIC_URL +
                        "/static/images/logo/google.svg"
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h5",
                      gutterBottom: true,
                    }}
                    secondaryTypographyProps={{
                      variant: "subtitle2",
                      lineHeight: 1,
                    }}
                    primary="Geoserver"
                    secondary="A Geoserver server hasn’t been yet added to your system"
                  />
                  <Button color="secondary" size="large" variant="contained">
                    Connect
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
          */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SystemsSettings;
