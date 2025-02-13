import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "data-perbaikan-produsen";
const getAll = () => {
  //return http.get("/tutorials");
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllPemeriksaanUUID = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/pemeriksaan/${uuid}`, { headers: authHeader() });
};

const getAllProdusen = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/produsen/${uuid}`, { headers: authHeader() });
};

const getAllUser = (uuid) => {
  //return http.get("/tutorials");
  return http.get(`/${base}/user/${uuid}`, { headers: authHeader() });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

const createData = (data, documentFile, metadataFile, dataSpasialFile) => {
  let formData = new FormData();

  formData.append("files", documentFile);
  formData.append("files", metadataFile);
  formData.append("files", dataSpasialFile);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));
  console.log(data);
  console.log(documentFile);
  console.log(metadataFile);
  console.log(dataSpasialFile);

  return http.post(`/${base}`, formData, {
    headers: authHeaderFile(),
    //onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const createPeriksa = (data, documentFile) => {
  let formData = new FormData();

  formData.append("files", documentFile);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));
  console.log(data);
  console.log(documentFile);

  return http.post(`/${base}/periksa`, formData, {
    headers: authHeaderFile(),
    //onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const unduhReferensi = (uuid) => {
  return http.get(`/${base}/referensi/${uuid}`, {
    headers: authHeader(),
    responseType: "blob",
  });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const BukuTamuService = {
  getAll,
  getAllPemeriksaanUUID,
  getAllUser,
  getAllProdusen,
  get,
  createData,
  createPeriksa,
  unduhReferensi,
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
