import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import DaftarTab from "./DaftarTab";
import RecordTab from "./RecordTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementsPublikasi_csw() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(
    currentUser.roles.includes("ROLE_ADMIN") ||
      currentUser.roles.includes("ROLE_WALIDATA")
      ? "daftar"
      : "publikasi"
  );

  const tabs = [
    currentUser.roles.includes("ROLE_ADMIN") ||
    currentUser.roles.includes("ROLE_WALIDATA")
      ? { value: "daftar", label: "Daftar Siap Publikasi" }
      : null,
    { value: "publikasi", label: "Daftar Publikasi CSW" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Managements - Publikasi CSW</title>
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
              {tabs.map((tab) =>
                tab ? (
                  <Tab key={tab?.value} label={tab?.label} value={tab?.value} />
                ) : null
              )}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === "daftar" && <DaftarTab />}
            {currentTab === "publikasi" && <RecordTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementsPublikasi_csw;
