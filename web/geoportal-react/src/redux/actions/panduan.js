import {
  CREATE_PANDUAN,
  RETRIEVE_PANDUAN,
  UPDATE_PANDUAN,
  DELETE_PANDUAN,
  RETRIEVE_PANDUAN_PUBLIC
} from "./types";

import Service from "src/services/panduan.service";
import EventBus from "src/utils/EventBus";

export const createPanduan = (panduanData) => async (dispatch) => {
  try {
    const res = await Service.create(panduanData);
    
    dispatch({
      type: CREATE_PANDUAN,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
    return Promise.reject(err);
  }
};

export const retrievePanduan = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    //console.log("API Response:", res.data);
    
    dispatch({
      type: RETRIEVE_PANDUAN,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
    return Promise.reject(err);
  }
};

export const updatePanduan = (uuid, data) => async (dispatch) => {
  try {
    const res = await Service.update(uuid, data);
    
    dispatch({
      type: UPDATE_PANDUAN,
      payload: res.data,
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
          EventBus.dispatch("logout");
        }
        console.log(err);
        return Promise.reject(err); //tampilkan swal error
      }
};

export const deletePanduan = (uuid) => async (dispatch) => {
  try {
    await Service.remove(uuid);
    
    dispatch({
      type: DELETE_PANDUAN,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
          EventBus.dispatch("logout");
        }
        console.log(err);
        return Promise.reject(err);
      }
};

export const retrievePanduanPublic = () => async (dispatch) => {
  try {
    const res = await Service.getAllPublic();
    
    dispatch({
      type: RETRIEVE_PANDUAN_PUBLIC,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};