import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Form, Input, Row, Col, Alert, Spin, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import Logo from "src/components/LogoSign";

import { Box, Container } from "@mui/material";
import { loginCaptcha, loginInaGeo } from "src/redux/actions/auth";
import { clearMessage } from "src/redux/actions/message";
import useForm from "src/hooks/useForm";
import swal from "sweetalert";

const App = () => {
  let navigate = useNavigate();

  const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const INA_GEO_SITE_KEY = "6LeH8XwhAAAAALw43tTI0iPcLqx8vrlMvkyRwuB6";

  const [loading, setLoading] = useState(false);
  const [inaGeoLoading, setInaGeoLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === 'development');
  const [debugInfo, setDebugInfo] = useState('');
  const [form] = Form.useForm(); // Add form instance

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());

    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    // Load regular reCAPTCHA
    if (SITE_KEY) {
      loadScriptByURL(
        "recaptcha-key",
        `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`,
        function () {
          console.log("Regular reCAPTCHA Script loaded!");
          if (debugMode) setDebugInfo(prev => prev + "Regular reCAPTCHA loaded\n");
        }
      );
    }

    // Load INA Geo reCAPTCHA
    loadScriptByURL(
      "recaptcha-inageo-key",
      `https://www.google.com/recaptcha/api.js?render=${INA_GEO_SITE_KEY}`,
      function () {
        console.log("INA Geo reCAPTCHA Script loaded!");
        if (debugMode) setDebugInfo(prev => prev + "INA Geo reCAPTCHA loaded\n");
      }
    );
  }, [SITE_KEY, debugMode]);

  if (isLoggedIn) {
    return <Navigate to="/overview" />;
  }

  const onFinish = (values) => {
    setLoading(true);
    if (!loading) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(SITE_KEY, { action: "submit" })
          .then((token) => {
            dispatch(loginCaptcha(values.email, values.password, token))
              .then(() => {
                swal("Success", "success", "success", {
                  buttons: false,
                  timer: 2000,
                });
                window.setTimeout(() => {
                  setLoading(false);
                  navigate("/overview");
                }, 2000);
              })
              .catch(() => {
                setLoading(false);
              });
          });
      });
    }
  };

  const onInaGeoLogin = (values) => {
    console.log("INA Geo login initiated with values:", { email: values.email, password: "[HIDDEN]" });
    if (debugMode) setDebugInfo(prev => prev + `INA Geo login started for: ${values.email}\n`);

    setInaGeoLoading(true);

    if (!inaGeoLoading) {
      // Check if grecaptcha is available
      if (typeof window.grecaptcha === 'undefined') {
        console.error("reCAPTCHA not loaded");
        if (debugMode) setDebugInfo(prev => prev + "ERROR: reCAPTCHA not loaded\n");
        setInaGeoLoading(false);
        swal("Error", "reCAPTCHA tidak tersedia. Silakan refresh halaman.", "error");
        return;
      }

      window.grecaptcha.ready(() => {
        console.log("Executing INA Geo reCAPTCHA...");
        if (debugMode) setDebugInfo(prev => prev + "Executing reCAPTCHA...\n");

        window.grecaptcha
          .execute(INA_GEO_SITE_KEY, { action: "submit" })
          .then((token) => {
            console.log("reCAPTCHA token received:", token.substring(0, 20) + "...");
            if (debugMode) setDebugInfo(prev => prev + `reCAPTCHA token: ${token.substring(0, 20)}...\n`);

            const requestData = {
              email: values.email,
              password: values.password,
              token: token
            };

            console.log("Dispatching loginInaGeo with data:", {
              email: requestData.email,
              password: "[HIDDEN]",
              token: requestData.token.substring(0, 20) + "..."
            });

            if (debugMode) setDebugInfo(prev => prev + "Sending request to backend...\n");

            dispatch(loginInaGeo(requestData.email, requestData.password, requestData.token))
              .then((response) => {
                console.log("INA Geo login success:", response);
                if (debugMode) setDebugInfo(prev => prev + "Login successful!\n");

                swal("Success", "Login INA Geo berhasil", "success", {
                  buttons: false,
                  timer: 2000,
                });
                window.setTimeout(() => {
                  setInaGeoLoading(false);
                  navigate("/overview");
                }, 2000);
              })
              .catch((error) => {
                console.error("INA Geo login error:", error);
                if (debugMode) setDebugInfo(prev => prev + `Login error: ${error.message}\n`);
                setInaGeoLoading(false);
              });
          })
          .catch((captchaError) => {
            console.error("reCAPTCHA error:", captchaError);
            if (debugMode) setDebugInfo(prev => prev + `reCAPTCHA error: ${captchaError.message}\n`);
            setInaGeoLoading(false);
            swal("Error", "Gagal mendapatkan reCAPTCHA token", "error");
          });
      });
    }
  };

  // Handle INA Geo button click
  const handleInaGeoLogin = async () => {
    try {
      // Trigger form validation
      const values = await form.validateFields();

      // If validation passes, proceed with INA Geo login
      onInaGeoLogin(values);
    } catch (errorInfo) {
      console.log('Form validation failed:', errorInfo);
    }
  };

  // Test function untuk debugging
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: 'data',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      console.log("Backend test result:", result);
      setDebugInfo(prev => prev + `Backend test: ${response.status} - ${JSON.stringify(result)}\n`);
    } catch (error) {
      console.error("Backend test error:", error);
      setDebugInfo(prev => prev + `Backend test error: ${error.message}\n`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Auth - Login</title>
      </Helmet>
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Col>
          <Logo />
          <br />
          <br />
          <br />

          {debugMode && (
            <Card style={{ width: 450, marginBottom: 20 }}>
              <h4>Debug Information</h4>
              <Button onClick={testBackendConnection} size="small" style={{ marginBottom: 10 }}>
                Test Backend Connection
              </Button>
              <Button onClick={() => setDebugInfo('')} size="small" style={{ marginLeft: 10, marginBottom: 10 }}>
                Clear Debug
              </Button>
              <pre style={{
                fontSize: '10px',
                maxHeight: '150px',
                overflow: 'auto',
                background: '#f5f5f5',
                padding: '10px'
              }}>
                {debugInfo}
              </pre>
            </Card>
          )}

          <Card
            title="Signin to SIBATNAS"
            style={{ width: 450, textAlign: "center" }}
          >
            {/* Single Login Form dengan 2 tombol */}
            <Form
              form={form}
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Tolong masukkan email Anda!" },
                  {
                    type: "email",
                    message: "Format email tidak valid!",
                  },
                ]}
              >
                <Input
                  placeholder="Email"
                  prefix={<MailOutlined />}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Tolong masukkan password Anda!" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  prefix={<LockOutlined />}
                  size="large"
                />
              </Form.Item>

              {!loading && !inaGeoLoading && message && (
                <Alert
                  message={message}
                  type="error"
                  showIcon
                  style={{ marginBottom: "16px" }}
                />
              )}

              <Form.Item>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <Spin spinning={loading} delay={100}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        shape="round"
                        disabled={inaGeoLoading}
                      >
                        Login
                      </Button>
                    </Spin>
                  </Col>
                  <Col span={24}>
                    <Spin spinning={inaGeoLoading} delay={100}>
                      <Button
                        type="default"
                        block
                        size="large"
                        shape="round"
                        disabled={loading}
                        onClick={handleInaGeoLogin}
                        style={{
                          backgroundColor: "#52c41a",
                          borderColor: "#52c41a",
                          color: "white"
                        }}
                      >
                        Login dengan Ina Geoportal
                      </Button>
                    </Spin>
                  </Col>
                </Row>
              </Form.Item>
            </Form>

            <Divider sx={{ my: 4 }}>OR</Divider>
            <center>
              <Button href={process.env.PUBLIC_URL + "/"} variant="outlined">
                Kembali ke Beranda
              </Button>
            </center>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default App;