import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "publikasi_csw";

const getAll = () => {
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllPublik = () => {
  return http.get(`/${base}/publik`);
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`);
};

//const create = (data) => {
//  return http.post(`/${base}/`, data, { headers: authHeader() });
//};

const createData = (data, metadataFile) => {
  let formData = new FormData();

  formData.append("metadataFile", metadataFile);
  //formData.append("nip", data.nip);
  formData.append("data", JSON.stringify(data));
  console.log(data);
  console.log(metadataFile);

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
