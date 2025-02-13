import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import Wallets from "./Wallets";
import Footer from "src/components/Footer";
import AccountBalance from "./AccountBalance";

function DashboardWelcome() {
  return (
    <>
      <Helmet>
        <title>Welcome Dashboard</title>
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
          spacing={4}
        >
          {/*
          <Grid item xs={12}>
            <AccountBalance />
          </Grid>
        
          <Grid item lg={8} xs={12}>
            <Wallets />
          </Grid>
          <Grid item lg={4} xs={12}></Grid>
          <Grid item xs={12}></Grid>
          */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardWelcome;
