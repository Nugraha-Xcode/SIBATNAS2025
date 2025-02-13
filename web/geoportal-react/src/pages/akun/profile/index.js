import { Helmet } from "react-helmet-async";
import { useState } from "react";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Footer from "src/components/Footer";

import { Container, Tabs, Tab, Grid, styled } from "@mui/material";
//import ProfileCover from "./ProfileCover";
//import RecentActivity from "./RecentActivity";
//import Feed from "./Feed";
//import PopularTags from "./PopularTags";
//import MyCards from "./MyCards";
//import Addresses from "./Addresses";
import ProfileTab from "./ProfileTab";
const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);
function ManagementUserProfile() {
  const [currentTab, setCurrentTab] = useState("profile");

  const tabs = [
    // { value: "activity", label: "Activity" },
    { value: "profile", label: "Profile" },
    //   { value: "notifications", label: "Notifications" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  return (
    <>
      <Helmet>
        <title>User Details - Profile</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container sx={{ mt: 3 }} maxWidth="lg">
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
            {currentTab === "profile" && <ProfileTab />}
          </Grid>
          {/*
          <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
         
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid>
          */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
