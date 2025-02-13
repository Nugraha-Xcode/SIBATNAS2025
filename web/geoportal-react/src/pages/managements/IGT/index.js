import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import KategoriTab from "./KategoriTab";
import DaftarTab from "./DaftarTab";
import ProdusenDaftarTab from "./Produsen/DaftarTab";
import UserTab from "./Produsen/UserTab";

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
    { value: "kategori", label: "Kategori Tematik" },
    { value: "produsen", label: "Produsen" },
    { value: "daftar", label: "Daftar IGT" },
    { value: "user", label: "User Produsen" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Managements - IGT</title>
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
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === "kategori" && <KategoriTab />}
            {currentTab === "produsen" && <ProdusenDaftarTab />}
            {currentTab === "daftar" && <DaftarTab />}
            {currentTab === "user" && <UserTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementsLokasi;
