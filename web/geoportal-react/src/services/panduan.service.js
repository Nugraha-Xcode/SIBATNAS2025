import http from "./http-common";
import authHeader from "./auth-header";
const base = "panduan";

  const create = (data) => {
    return http.post(`/${base}/`, data, { headers: authHeader() });
  };
  
  const update = (uuid, data) => {
    return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
  };

  const getAll = () => {
    return http.get(`/${base}`, { headers: authHeader() });
  };

  
  const get = (uuid) => {
    return http.get(`/${base}/${uuid}`);
  };
  
  const remove = (uuid) => {
    return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
  };

  const getAllPublic = () => {
    return http.get(`/${base}/public`, { headers: authHeader() });
  }


  const Service = {
    getAll,
    get,
    create,
    update,
    remove,
    getAllPublic,
  };
  
  export default Service;
