import http from "./http-common";
import authHeader from "./auth-header";
const base = "record";

const getAll = () => {
  return http.get(`/${base}`, { headers: authHeader() });
};

const getAllPublik = () => {
  return http.get(`/${base}/publik`);
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

const remove = (identifier) => {
  return http.delete(`/${base}/${identifier}`, { headers: authHeader() });
};

const Service = {
  getAll,
  getAllPublik,
  get,
  create,
  update,
  remove,
};

export default Service;
