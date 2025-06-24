import http from "./http-common";
import authHeader from "./auth-header";

const register = (username, email, password) => {
  return http.post("/auth/signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return http
    .post("/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const loginCaptcha = async (email, password, token) => {
  const response = await http.post("/auth/signinCaptcha", {
    email,
    password,
    token,
  });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Fixed INA Geo login service dengan debugging
const loginInaGeo = async (email, password, token) => {
  console.log("=== AUTH SERVICE: INA GEO LOGIN ===");
  console.log("Email:", email);
  console.log("Password:", password ? "[HIDDEN]" : "undefined");
  console.log("Token:", token ? token.substring(0, 20) + "..." : "undefined");
  
  try {
    // Validate input
    if (!email || !password || !token) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password'); 
      if (!token) missingFields.push('token');
      
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const requestData = {
      email,
      password,
      token,
    };

    console.log("Making request to /auth/signinInaGeo");
    console.log("Request data:", {
      email: requestData.email,
      password: "[HIDDEN]",
      token: requestData.token.substring(0, 20) + "..."
    });

    const response = await http.post("/auth/signinInaGeo", requestData);
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    // Check if response is successful
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Validate response data structure
    if (!response.data) {
      throw new Error("Empty response data");
    }

    if (!response.data.accessToken) {
      throw new Error("No access token in response");
    }

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));
    console.log("User data stored in localStorage");
    console.log("=== AUTH SERVICE: INA GEO LOGIN SUCCESS ===");
    
    return response.data;

  } catch (error) {
    console.log("=== AUTH SERVICE: INA GEO LOGIN ERROR ===");
    console.error("INA Geo login error:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
      
      // Extract meaningful error message
      let errorMessage = "Authentication failed";
      
      if (error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      // Throw error with meaningful message
      const httpError = new Error(errorMessage);
      httpError.status = error.response.status;
      httpError.response = error.response;
      throw httpError;
      
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("Network error: No response from server");
      
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw error;
    }
  }
};

const updatePassword = (uuid, data) => {
  return http.put(`/auth/password/${uuid}`, data, { headers: authHeader() });
};

const logout = () => {
  localStorage.removeItem("user");
};

// Test method untuk debugging koneksi
const testConnection = async () => {
  try {
    console.log("Testing backend connection...");
    const response = await http.post("/test", {
      test: "data",
      timestamp: new Date().toISOString()
    });
    console.log("Test connection successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Test connection failed:", error);
    throw error;
  }
};

export default {
  register,
  login,
  loginCaptcha,
  loginInaGeo,
  updatePassword,
  logout,
  testConnection, // Export test method for debugging
};