import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "unsur";

const getAll = () => {
  return http.get(`/${base}`, { headers: authHeader() });
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

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const importUnsur = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);
  //formData.append("nip", data.nip);

  return http.post(`${base}/import`, formData, {
    headers: authHeaderFile(),
    onUploadProgress,
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const Service = {
  getAll,
  get,
  create,
  update,
  remove,
  importUnsur,
};

export default Service;
