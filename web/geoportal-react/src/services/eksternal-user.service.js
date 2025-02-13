import http from "./http-common";
import authHeader from "./auth-header";
const base = "eksternal-user";

const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};
const getAllEksternal = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/eksternal/${uuid}`, { headers: authHeader() });
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

const remove = (uuid1, uuid2) => {
  return http.delete(`/${base}/${uuid1}/${uuid2}`, { headers: authHeader() });
};

const UserService = {
  getAll,
  getAllEksternal,
  get,
  create,
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
