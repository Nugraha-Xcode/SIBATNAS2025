import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import router from "./router";

import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { logout } from "src/redux/actions/auth";
import { clearMessage } from "src/redux/actions/message";
import AuthVerify from "./utils/AuthVerify";
import EventBus from "./utils/EventBus";

function App() {
  const content = useRoutes(router);

  let navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  let location = useLocation();

  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

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

  return (
    <ThemeProvider>
      <CssBaseline />
      {content}
      <AuthVerify logOut={logOut} />
    </ThemeProvider>
  );
}

export default App;
