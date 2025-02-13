import http from "./http-common";
import authHeader from "./auth-header";
const base = "aktifitas-unduh";

const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllUser = (uuid) => {
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const Service = {
  getAll,
  getAllUser,
};

export default Service;
