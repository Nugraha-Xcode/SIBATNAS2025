import {
  CREATE_NOTIFIKASI_SUCCESS,
  CREATE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_SUCCESS,
  RETRIEVE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_UNREAD,
  UPDATE_NOTIFIKASI_SUCCESS,
  UPDATE_NOTIFIKASI_FAIL,
  DELETE_NOTIFIKASI_SUCCESS,
  DELETE_NOTIFIKASI_FAIL,
  UPDATE_NOTIFIKASI_READ_STATUS,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/notifikasi.service";
import EventBus from "src/utils/EventBus";

export const retrieveAllUserPaginated = (uuid, params) => async (dispatch) => {
  try {
    const res = await Service.getAllUserPaginated(uuid, params);
    dispatch({
      type: RETRIEVE_NOTIFIKASI_SUCCESS,
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

export const retrieveAllUserUnread = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllUserUnread(uuid);
    dispatch({
      type: RETRIEVE_NOTIFIKASI_UNREAD,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const updateReadStatus = (uuid) => async (dispatch) => {
  try {
    const response = await Service.updateReadStatus(uuid);
    dispatch({
      type: "UPDATE_NOTIFIKASI_READ_STATUS",
      payload: { uuid, sudahBaca: true, waktuBaca: new Date() },
    });
    return Promise.resolve(response.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
