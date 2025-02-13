import http from "./http-common";
import authHeader from "./auth-header";
import authHeaderFile from "./auth-headerFile";
const base = "verify";

const checkData = (documentFile) => {
  let formData = new FormData();

  formData.append("file", documentFile);

  return http.post(`/${base}`, formData, {
    headers: authHeaderFile(),
  });

  //return http.post("/pegawai/", data, { headers: authHeader() });
};

const BukuTamuService = {
  checkData,
};

export default BukuTamuService;
