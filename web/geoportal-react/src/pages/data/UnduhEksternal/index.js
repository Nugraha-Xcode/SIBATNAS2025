import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Button, Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import { NavLink } from "react-router-dom";
import DataTab from "./DataTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementsLokasi() {
  const [currentTab, setCurrentTab] = useState("kategori");

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleClick = (e) => {
    window.location.href = "data/eksternal";
  };

  return (
    <>
      <Helmet>
        <title>Unduh Data - Eksternal</title>
      </Helmet>
      <div style={{ padding: "20px" }}>
        <Button
          variant="contained"
          size="small"
          href={process.env.PUBLIC_URL + "/data/eksternal"}
          //component={NavLink}
          //to="/data/publikasi"
        >
          Kembali ke Daftar IGT Eksternal
        </Button>
      </div>
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
          <Grid item xs={12}>
            <DataTab />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementsLokasi;
