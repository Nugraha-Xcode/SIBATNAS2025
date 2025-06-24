import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import router from "./router";

import { CssBaseline } from "@mui/material";
import { Helmet } from "react-helmet-async"; 
import ThemeProvider from "./theme/ThemeProvider";
import { logout } from "src/redux/actions/auth";
import { clearMessage } from "src/redux/actions/message";
import { retrievePublicSiteSettings } from "src/redux/actions/siteSetting"; // Tambahkan import ini
import AuthVerify from "./utils/AuthVerify";
import EventBus from "./utils/EventBus";

import environment from "./config/environment";

function App() {
  const content = useRoutes(router);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const siteSetting = useSelector((state) => state.siteSetting);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    dispatch(retrievePublicSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSetting?.name) {
      document.title = `${siteSetting.name} | Tata Kelola`;
    }
  }, [siteSetting?.name]);

  useEffect(() => {
    if (["/auth/login"].includes(location.pathname)) {
      dispatch(clearMessage()); // clear message when changing location
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (currentUser) {
      //setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      //setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      //setShowModeratorBoard(false);
      //setShowAdminBoard(false);
    }
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  useEffect(() => {
    const setDynamicFavicon = async () => {
      try {
        const res = await fetch(`${environment.api}site-settings/icon`);
        if (res.ok) {
          updateFavicon(`${environment.api}site-settings/icon`);
        } else {
          updateFavicon("/favicon.ico");
        }
      } catch (error) {
        updateFavicon("/favicon.ico");
      }
    };

    const updateFavicon = (url) => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = url;
    };

    setDynamicFavicon();
  }, []);

  return (
    <ThemeProvider>
      <Helmet>
        <title>
          {siteSetting?.name 
            ? `${siteSetting.name} | Tata Kelola` 
            : 'SIBATNAS | Tata Kelola'
          }
        </title>
        <meta 
          name="description" 
          content={
            siteSetting?.deskripsi || 
            'SIBATNAS (Sistem Batimetri Nasional) adalah sistem informasi yang menyediakan data batimetri dan informasi terkait untuk mendukung pengelolaan sumber daya laut dan pesisir di Indonesia.'
          } 
        />
      </Helmet>
      
      <CssBaseline />
      {content}
      <AuthVerify logOut={logOut} />
    </ThemeProvider>
  );
}

export default App;
