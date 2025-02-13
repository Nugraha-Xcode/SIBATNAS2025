import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import MekanismeTab from "./MekanismeTab";
import KategoriTab from "./KategoriTab";
import DaftarTab from "./DaftarTab";
import IgtTab from "./IgtTab";
import UnduhTab from "./UnduhTab";
import WilkerTab from "./WilkerTab";
import UserTab from "./UserTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementsLokasi() {
  const [currentTab, setCurrentTab] = useState("mekanisme");

  const tabs = [
    { value: "mekanisme", label: "Mekanisme Eksternal" },
    { value: "kategori", label: "Kategori Eksternal" },
    { value: "daftar", label: "Daftar Eksternal" },
    { value: "igt_unggah", label: "IGT Unggah Eksternal" },
    { value: "igt_unduh", label: "IGT Unduh Eksternal" },
    { value: "wilker", label: "Wilayah Kerja" },
    { value: "user", label: "User" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Managements - Eksternal</title>
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
            {currentTab === "mekanisme" && <MekanismeTab />}
            {currentTab === "kategori" && <KategoriTab />}
            {currentTab === "daftar" && <DaftarTab />}
            {currentTab === "igt_unggah" && <IgtTab />}
            {currentTab === "igt_unduh" && <UnduhTab />}
            {currentTab === "wilker" && <WilkerTab />}
            {currentTab === "user" && <UserTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementsLokasi;
