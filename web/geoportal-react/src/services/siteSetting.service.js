import http from "./http-common";
import axios from "axios";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
import environment from "src/config/environment";

const base = "site-settings";

const getSettings = () => {
  return http.get(`/${base}`, { headers: authHeader() });
};

const update = (uuid, data) => {
  return http.put(`/${base}/${uuid}`, data, {
    headers: authHeaderFile(),
  });
};

const getPublicSettings = () => {
  return http.get(`/${base}/public`, { headers: authHeader() });
};

// New method for handling chunked uploads
const uploadChunk = (formData) => {
  return axios.post(
    `${environment.api}${base}/chunk-upload`,
    formData,
    {
      headers: {
        ...authHeaderFile(),
        "Content-Type": "multipart/form-data",
        "chunked-upload": "true"
      }
    }
  ).then(response => response.data);
};

const SiteSettingService = {
  getSettings,
  update,
  getPublicSettings,
  uploadChunk
};

export default SiteSettingService;