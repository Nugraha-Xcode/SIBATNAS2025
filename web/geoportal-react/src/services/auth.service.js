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

const updatePassword = (uuid, data) => {
  return http.put(`/auth/password/${uuid}`, data, { headers: authHeader() });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  updatePassword,
  logout,
};
