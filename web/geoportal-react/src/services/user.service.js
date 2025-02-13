import http from "./http-common";
import authHeader from "./auth-header";
const base = "user";

const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllRole = (id) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/role/${id}`, { headers: authHeader() });
};

const getAllEksternal = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}/eksternal`, { headers: authHeader() });
};

const getAllInternal = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}/internal`, { headers: authHeader() });
};
const getAllBpkhtl = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}/bpkhtl`, { headers: authHeader() });
};
const getAllProdusen = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}/produsen`, { headers: authHeader() });
};
const getAllWalidata = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}/walidata`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const create = (data) => {
  return http.post(`/${base}/`, data, { headers: authHeader() });
};

const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const updateProfile = (uuid, data) => {
  return http.put(`/${base}/profile/${uuid}`, data, { headers: authHeader() });
};

const resetPassword = (uuid) => {
  return http.put(`/${base}/reset/${uuid}`, {}, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const UserService = {
  getAll,
  getAllRole,
  getAllEksternal,
  getAllBpkhtl,
  getAllProdusen,
  getAllWalidata,
  getAllInternal,
  get,
  create,
  update,
  updateProfile,
  resetPassword,
  remove,
  //removeAll,
  //findByTitle,
};

export default UserService;

/*
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
*/
