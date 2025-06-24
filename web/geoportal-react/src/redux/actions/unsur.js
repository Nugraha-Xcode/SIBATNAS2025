import {
  CREATE_UNSUR_SUCCESS,
  CREATE_UNSUR_FAIL,
  RETRIEVE_UNSUR_SUCCESS,
  RETRIEVE_UNSUR_FAIL,
  UPDATE_UNSUR_SUCCESS,
  UPDATE_UNSUR_FAIL,
  DELETE_UNSUR_SUCCESS,
  DELETE_UNSUR_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/unsur.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_UNSUR_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create = (data) => async (dispatch) => {
  try {
    const res = await Service.create(data);

    dispatch({
      type: CREATE_UNSUR_SUCCESS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const importUnsur = (file, onUploadProgress) => async (dispatch) => {
  try {
    const res = await Service.importUnsur(file, onUploadProgress);

    dispatch({
      type: CREATE_UNSUR_SUCCESS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const update = (uuid, data) => async (dispatch) => {
  try {
    const res = await Service.update(uuid, data);

    dispatch({
      type: UPDATE_UNSUR_SUCCESS,
      payload: data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const remove = (uuid) => async (dispatch) => {
  try {
    await Service.remove(uuid);

    dispatch({
      type: DELETE_UNSUR_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
