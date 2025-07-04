import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
import Footer from "src/components/Footer";

import RoleTab from "./RoleTab";
import UserTab from "./UserTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function SystemsUser() {
  const [currentTab, setCurrentTab] = useState("role");

  const tabs = [
    { value: "role", label: "Role" },
    { value: "user", label: "User" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Systems - User</title>
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
            {currentTab === "role" && <RoleTab />}
            {currentTab === "user" && <UserTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SystemsUser;
