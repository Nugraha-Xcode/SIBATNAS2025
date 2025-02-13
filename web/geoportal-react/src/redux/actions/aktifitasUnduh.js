import {
  CREATE_AKTIFITAS_SUCCESS,
  CREATE_AKTIFITAS_FAIL,
  RETRIEVE_AKTIFITAS_SUCCESS,
  RETRIEVE_AKTIFITAS_FAIL,
  UPDATE_AKTIFITAS_SUCCESS,
  UPDATE_AKTIFITAS_FAIL,
  DELETE_AKTIFITAS_SUCCESS,
  DELETE_AKTIFITAS_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/aktifitasUnduh.service";
import EventBus from "src/utils/EventBus";

export const retrieveAll = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_AKTIFITAS_SUCCESS,
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
      type: RETRIEVE_AKTIFITAS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
