import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "publikasi_csw";

const getAll = (params = {}) => {
  return http.get(`/${base}`, { headers: authHeader(), params });
};

const getAllPublik = (params = {}) => {
  return http.get(`/${base}/publik`, { params });
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

//const create = (data) => {
//  return http.post(`/${base}/`, data, { headers: authHeader() });
//};

const createData = (data, metadataFile) => {
  let formData = new FormData();

  console.log("Data yang dikirim:", data);
  console.log("MetadataFile:", metadataFile);
  console.log("Tipe MetadataFile:", typeof metadataFile);
  console.log("Instanceof File:", metadataFile instanceof File);

  formData.append("metadataFile", metadataFile);
  formData.append("data", JSON.stringify(data));

  console.log("Sending FormData:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ', pair[1]);
  }
  return http.post(`/${base}`, formData, {
    headers: authHeaderFile(),
    //onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};
const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const Service = {
  getAll,
  getAllPublik,
  get,
  //create,
  createData,
  update,
  remove,
};

export default Service;
