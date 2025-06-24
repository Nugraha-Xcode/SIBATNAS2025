import http from "./http-common";
import authHeader from "./auth-header";
const base = "berita";

const getAll = () => {
  return http.get(`/${base}`, { headers: authHeader() });
};

// PERBAIKAN: Pastikan endpoint public benar
const getAllPublic = () => {
  console.log("Calling public berita endpoint"); // Debug log
  return http.get(`/${base}/public`); // Tanpa auth header
};

// BARU: Get single public berita
const getPublic = (uuid) => {
  console.log("Calling public berita detail endpoint for:", uuid); 
  return http.get(`/${base}/public/${uuid}`);
};

const get = (uuid) => {
  return http.get(`/${base}/${uuid}`, { headers: authHeader() });
};

const create = (data) => {
  console.log("Sending to API:", data);

  if (data instanceof FormData) {
    return http.post(`/${base}`, data, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  return http.post(`/${base}`, data, { headers: authHeader() });
};

const update = (uuid, data) => {
  console.log("Updating berita:", uuid, data);

  if (data instanceof FormData) {
    return http.put(`/${base}/${uuid}`, data, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  return http.put(`/${base}/${uuid}`, data, { headers: authHeader() });
};

const remove = (uuid) => {
  return http.delete(`/${base}/${uuid}`, { headers: authHeader() });
};

const Service = {
  getAll,
  get,
  create,
  update,
  remove,
  getAllPublic,
  getPublic,
};

export default Service;