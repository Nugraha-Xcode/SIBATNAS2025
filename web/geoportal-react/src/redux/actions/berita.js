import {
  CREATE_BERITA,
  CREATE_BERITA_FAIL,
  RETRIEVE_BERITA,
  RETRIEVE_BERITA_FAIL,
  UPDATE_BERITA,
  UPDATE_BERITA_FAIL,
  DELETE_BERITA,
  DELETE_BERITA_FAIL,
  RETRIEVE_BERITA_PUBLIC,
  RETRIEVE_BERITA_PUBLIC_FAIL,
} from "./types";

import Service from "src/services/berita.service";
import EventBus from "src/utils/EventBus";

export const createBerita = (beritaData) => async (dispatch) => {
  try {
    const res = await Service.create(beritaData);
    
    dispatch({
      type: CREATE_BERITA,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    dispatch({
      type: CREATE_BERITA_FAIL,
      payload: err.response?.data?.message || "Create berita failed",
    });
    return Promise.reject(err);
  }
};

export const retrieveBerita = () => async (dispatch) => {
  try {
    const res = await Service.getAll();
    
    dispatch({
      type: RETRIEVE_BERITA,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    dispatch({
      type: RETRIEVE_BERITA_FAIL,
      payload: err.response?.data?.message || "Retrieve berita failed",
    });
    return Promise.reject(err);
  }
};

export const updateBerita = (uuid, data) => async (dispatch) => {
  try {
    const res = await Service.update(uuid, data);
    
    dispatch({
      type: UPDATE_BERITA,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    dispatch({
      type: UPDATE_BERITA_FAIL,
      payload: err.response?.data?.message || "Update berita failed",
    });
    return Promise.reject(err);
  }
};

export const deleteBerita = (uuid) => async (dispatch) => {
  try {
    await Service.remove(uuid);
    
    dispatch({
      type: DELETE_BERITA,
      payload: { uuid },
    });
    return Promise.resolve();
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    dispatch({
      type: DELETE_BERITA_FAIL,
      payload: err.response?.data?.message || "Delete berita failed",
    });
    return Promise.reject(err);
  }
};

export const retrieveBeritaPublic = () => async (dispatch) => {
  try {
    const res = await Service.getAllPublic();
    
    dispatch({
      type: RETRIEVE_BERITA_PUBLIC,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: RETRIEVE_BERITA_PUBLIC_FAIL,
      payload: err.response?.data?.message || "Gagal mengambil berita public",
    });
    return Promise.reject(err);
  }
};