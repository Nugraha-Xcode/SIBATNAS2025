import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

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

  const tabs = [
    { value: "kategori", label: "Penamaan" },
    { value: "lokasi", label: "Wilayah Kerja" },
    { value: "user", label: "User" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Data - Eksternal</title>
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
