import { LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "src/redux/actions/auth";
import swal from "sweetalert";

function Logout() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
    swal("Success", "successfuly signed out", "success", {
      buttons: false,
      timer: 2000,
    });
    window.setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);
  return <LinearProgress />;
}

export default Logout;
