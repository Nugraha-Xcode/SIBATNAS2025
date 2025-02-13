import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "data-eksternal";
const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllEksternal = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/eksternal/${uuid}`, { headers: authHeader() });
};

const getAllEksternalUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const createData = (data, documentFile, dataSpasialFile) => {
  let formData = new FormData();

  formData.append("files", documentFile);
  formData.append("files", dataSpasialFile);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));
  console.log(data);
  console.log(documentFile);
  console.log(dataSpasialFile);

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

const updatePulang = (uuid, data) => {
  return http.put(`/${base}/pulang/${uuid}`, data, { headers: authHeader() });
};
const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const unduh = (level, uuid, kode, user_uuid) => {
  //
  return http.get(`/${base}/unduh/${level}/${uuid}/${kode}/${user_uuid}`, {
    headers: authHeader(),
  });
};

const unduhIndonesia = (uuid, user_uuid) => {
  //
  return http.get(`/${base}/unduh/indonesia/${uuid}/${user_uuid}`, {
    headers: authHeader(),
  });
};

const getByUUID = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/${uuid}`, { headers: authHeader() });
};

const BukuTamuService = {
  getAll,
  getAllEksternal,
  getAllEksternalUser,
  get,
  createData,
  createDatang,
  updatePulang,
  update,
  remove,
  unduhIndonesia,
  unduh,
  getByUUID,
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
