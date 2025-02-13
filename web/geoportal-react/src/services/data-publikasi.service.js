import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "data-publikasi";
const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllProdusen = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/produsen/${uuid}`, { headers: authHeader() });
};

const getAllProdusenAdmin = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/produsen-admin/${uuid}`, { headers: authHeader() });
};

const getAllEksternalUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/eksternal-user/${uuid}`, { headers: authHeader() });
};

const getAllInternalUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/internal-user/${uuid}`, { headers: authHeader() });
};

const getAllLocation = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/lokasi/${uuid}`, { headers: authHeader() });
};

const getByUUID = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/${uuid}`, { headers: authHeader() });
};

const getAllUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const getAllIGT = (query) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/igt/${query}`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const createData = (data, documentFile) => {
  let formData = new FormData();

  formData.append("files", documentFile);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));
  console.log(data);
  console.log(documentFile);

  return http.post(`/${base}`, formData, {
    headers: authHeaderFile(),
    //onUploadProgress,
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

const publish = (uuid, data) => {
  return http.put(`/${base}/publish/${uuid}`, data, { headers: authHeader() });
};

const deactivate = (uuid, data) => {
  return http.put(`/${base}/deactivate/${uuid}`, data, {
    headers: authHeader(),
  });
};

const unduh = (uuid, user_uuid) => {
  //
  return http.get(`/${base}/unduh/${uuid}/${user_uuid}`, {
    headers: authHeader(),
  });
};

const unduhIndonesia = (uuid, user_uuid) => {
  //
  return http.get(`/${base}/unduh/indonesia/${uuid}/${user_uuid}`, {
    headers: authHeader(),
  });
};

const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const BukuTamuService = {
  getAll,
  getAllProdusen,
  getAllProdusenAdmin,
  getAllEksternalUser,
  getAllInternalUser,
  getAllLocation,
  getAllUser,
  getAllIGT,

  getByUUID,
  get,
  createData,
  publish,
  deactivate,
  unduh,
  unduhIndonesia,
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
