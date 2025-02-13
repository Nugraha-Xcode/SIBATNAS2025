import {
  CREATE_NOTIFIKASI_SUCCESS,
  CREATE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_SUCCESS,
  RETRIEVE_NOTIFIKASI_FAIL,
  UPDATE_NOTIFIKASI_SUCCESS,
  UPDATE_NOTIFIKASI_FAIL,
  DELETE_NOTIFIKASI_SUCCESS,
  DELETE_NOTIFIKASI_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/notifikasi.service";
import EventBus from "src/utils/EventBus";

export const retrieveAll = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_NOTIFIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllUser(uuid);

    dispatch({
      type: RETRIEVE_NOTIFIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
