import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import DataTab from "./DataTab";
import CariTab from "./CariTab";

import DataEksternalTab from "./DataEksternalTab";
import DataInternalTab from "./DataInternalTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementsLokasi() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState("kategori");

  const tabs = [
    // { value: "kategori", label: "Kategori" },
    // { value: "pencarian", label: "Pencarian" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  return (
    <>
      <Helmet>
        <title>Data - Publikasi</title>
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
          {/* {(currentUser.roles.includes("ROLE_ADMIN") ||
            currentUser.roles.includes("ROLE_BPKHTL") ||
            currentUser.roles.includes("ROLE_PRODUSEN") ||
            currentUser.roles.includes("ROLE_WALIDATA")) && (
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
          )} */}
          <Grid item xs={12}>
            {currentTab === "kategori" &&
              (currentUser.roles.includes("ROLE_ADMIN") ||
                currentUser.roles.includes("ROLE_BPKHTL") ||
                currentUser.roles.includes("ROLE_PRODUSEN") ||
                currentUser.roles.includes("ROLE_WALIDATA")) && <DataTab />}
            {currentUser.roles.includes("ROLE_EKSTERNAL") && (
              <DataEksternalTab />
            )}
            {currentUser.roles.includes("ROLE_INTERNAL") && <DataInternalTab />}
            {/* {currentTab === "pencarian" && <CariTab />} */}
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementsLokasi;
