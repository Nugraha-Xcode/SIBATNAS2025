import http from "./http-common";
import authHeader from "./auth-header";

import authHeaderFile from "./auth-headerFile";
const base = "provinsi";

const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllEksternalProvince = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/eksternal/${uuid}`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const create = (data) => {
  return http.post(`/${base}/`, data, { headers: authHeader() });
};

const uploadPolygon = (uuid, file) => {
  let formData = new FormData();
  formData.append("files", file);

  return http.put(`/${base}/polygon/${uuid}`, formData, {
    headers: authHeaderFile(),
  });
  //return http.put(`/${base}/ambil/${uuid}`, data, { headers: authHeader() });
};

const updateGrass = (uuid, data) => {
  return http.put(`/${base}/grass/${uuid}`, data, { headers: authHeader() });
};
const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const UserService = {
  getAll,
  getAllEksternalProvince,
  get,
  create,
  uploadPolygon,
  updateGrass,
  update,
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
