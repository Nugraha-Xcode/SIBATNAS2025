import { combineReducers } from "redux";
import aktifitas_unduh from "./aktifitasUnduh";
import auth from "./auth";
import data_eksternal from "./dataEksternal";
import data_produsen from "./dataProdusen";
import data_perbaikan_produsen from "./dataPerbaikanProdusen";
import data_pemeriksaan from "./dataPemeriksaan";
import data_publikasi from "./dataPublikasi";
import message from "./message";
import eksternal from "./eksternal";
import eksternal_user from "./eksternal-user";
import kategoriTematik from "./kategoriTematik";
import mekanismeEksternal from "./mekanismeEksternal";
import notifikasi from "./notifikasi";
import produsen from "./produsen";
import produsen_user from "./produsen-user";
import role from "./role";
import statusPemeriksaan from "./statusPemeriksaan";
import setting from "./setting";
import tematik from "./tematik";
import user from "./user";
import keywords from "./keywords";
import metadata from "./metadata";
import publikasi_csw from "./publikasi_csw";
import statistik from "./statistik";
import record from "./record";

export default combineReducers({
  aktifitas_unduh,
  auth,
  data_eksternal,
  data_produsen,
  data_perbaikan_produsen,
  data_pemeriksaan,
  data_publikasi,
  eksternal,
  eksternal_user,
  message,
  kategoriTematik,
  mekanismeEksternal,
  notifikasi,
  produsen,
  produsen_user,
  role,
  setting,
  statusPemeriksaan,
  tematik,
  user,
  keywords,
  metadata,
  publikasi_csw,
  statistik,
  record,
});
