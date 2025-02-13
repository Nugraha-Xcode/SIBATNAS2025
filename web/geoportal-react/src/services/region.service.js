import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "region";
const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllProvinsi = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/provinsi/${uuid}`, { headers: authHeader() });
};

const getAllLocation = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/lokasi/${uuid}`, { headers: authHeader() });
};

const getAllUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const create = (data) => {
  return http.post(`/${base}/`, data, { headers: authHeader() });
};

const createData = (data, file, onUploadProgress) => {
  console.log(data);
  console.log(file);
  let formData = new FormData();

  formData.append("file", file);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));

  return http.post(`/${base}`, formData, {
    headers: authHeaderFile(),
    onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const createDatang = (data, file, onUploadProgress) => {
  console.log(data);
  console.log(file);
  let formData = new FormData();

  formData.append("file", file);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));

  return http.post(`/${base}/datang`, formData, {
    headers: authHeaderFile(),
    onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const updatePulang = (uuid, data) => {
  return http.put(`/${base}/pulang/${uuid}`, data, { headers: authHeader() });
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

const BukuTamuService = {
  getAll,
  getAllProvinsi,
  getAllLocation,
  getAllUser,
  get,
  create,
  createData,
  uploadPolygon,
  updateGrass,
  update,
  remove,
  //removeAll,
  //findByTitle,
};

export default BukuTamuService;

/*
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
