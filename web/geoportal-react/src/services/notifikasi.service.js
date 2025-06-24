import http from "./http-common";
import authHeader from "./auth-header";
const base = "notifikasi";

const getAllUserPaginated = (uuid, params) => {
  return http.get(`/${base}/user/${uuid}`, { 
    params, 
    headers: authHeader() 
  });
};

const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllUser = (uuid) => {
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const getAllUserUnread = (uuid) => {
  return http.get(`/${base}/user/unread/${uuid}`, { headers: authHeader() });
};

const updateReadStatus = (uuid) => {
  return http.put(`/${base}/update/${uuid}`, {}, { headers: authHeader() });
};

const Service = {
  getAll,
  getAllUser,
  getAllUserUnread,
  updateReadStatus,
  getAllUserPaginated,
};

export default Service;
