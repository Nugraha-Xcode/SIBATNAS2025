import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Grid, Container, Tabs, Tab, styled } from "@mui/material";
import Footer from "src/components/Footer";

import DataTab from "./DataTab";
import AllDataTab from "./AllDataTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function BukuTamuTransactions() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState("own");

  const tabs = [
    { value: "own", label: "Daftar Berita" },
    // { value: "all", label: "Semua User" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Batnas - Verifikasi</title>
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
                tab.value == "all" ? (
                  currentUser.roles.includes("ROLE_ADMIN") ? (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ) : (
                    ""
                  )
                ) : (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                )
              )}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === "own" && <DataTab />}
            {currentTab === "all" && <AllDataTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default BukuTamuTransactions;
