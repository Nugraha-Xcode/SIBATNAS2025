import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  styled,
  Avatar,
  Alert,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import Logo from "src/components/LogoSign";
import { blue, green } from "@mui/material/colors";

import { login } from "src/redux/actions/auth";
import useForm from "src/hooks/useForm";
import swal from "sweetalert";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

function Login() {
  let navigate = useNavigate();
  const initialValues = { username: "", password: "" };
  const [values, handleChange, resetForm] = useForm(initialValues);
  const initialError = { username: "", password: "" };
  const [error, setError] = useState(initialError);

  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  if (isLoggedIn) {
    return <Navigate to="/overview" />;
  }

  function isValidated() {
    let username = "";
    let password = "";

    if (values.username.length == 0) {
      username = "This field is required";
    } else {
      username = "";
    }

    if (values.password.length == 0) {
      password = "This field is required";
    } else {
      password = "";
    }
    setError({ username: username, password: password });
    //console.log(error);
    return values.username.length > 0 && values.password.length > 0;
  }
  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    if (!loading) {
      //setSuccess(false);
      setLoading(true);
      if (isValidated()) {
        dispatch(login(values.username, values.password))
          .then(() => {
            swal("Success", "success", "success", {
              buttons: false,
              timer: 2000,
            });
            window.setTimeout(() => {
              //setSuccess(true);
              setLoading(false);
              navigate("/overview");
              //window.location.reload();
            }, 2000);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        //console.log(values);

        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Auth - Login</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Container maxWidth="sm">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ pb: 3 }}
            >
              <Logo />
            </Box>
          </Container>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: "center", mt: 3, p: 3 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Sign In
              </Typography>

              <form onSubmit={handleLogin}>
                <FormControl variant="outlined" fullWidth>
                  <OutlinedInputWrapper
                    type="text"
                    id="username"
                    name="username"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="username"
                    autoComplete="off"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="username-error-text">
                    {error.username}
                  </FormHelperText>
                </FormControl>
                <FormControl variant="outlined" fullWidth sx={{ mt: 3, mb: 2 }}>
                  <OutlinedInputWrapper
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="password-error-text">
                    {error.password}
                  </FormHelperText>
                </FormControl>
                {message && <Alert severity="error">{message}</Alert>}
                <Box sx={{ position: "relative" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                    type="submit"
                  >
                    Login
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: blue[500],
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 4 }}>OR</Divider>
                <Button href={process.env.PUBLIC_URL + "/"} variant="outlined">
                  Kembali ke Beranda
                </Button>
              </form>
            </Card>
          </Container>
        </Container>
      </MainContent>
    </>
  );
}

export default Login;
