import {
  CREATE_INTERNAL_TEMATIK_SUCCESS,
  CREATE_INTERNAL_TEMATIK_FAIL,
  RETRIEVE_INTERNAL_TEMATIK_SUCCESS,
  RETRIEVE_INTERNAL_TEMATIK_FAIL,
  UPDATE_INTERNAL_TEMATIK_SUCCESS,
  UPDATE_INTERNAL_TEMATIK_FAIL,
  DELETE_INTERNAL_TEMATIK_SUCCESS,
  DELETE_INTERNAL_TEMATIK_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/internal-tematik.service";
import EventBus from "src/utils/EventBus";
export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_INTERNAL_TEMATIK_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveInternalTematik = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternal(uuid);

    dispatch({
      type: RETRIEVE_INTERNAL_TEMATIK_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create = (internal, tematik) => async (dispatch) => {
  try {
    const res = await Service.create({
      internal,
      tematik,
    });

    dispatch({
      type: CREATE_INTERNAL_TEMATIK_SUCCESS,
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
      type: UPDATE_INTERNAL_TEMATIK_SUCCESS,
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

export const remove = (data) => async (dispatch) => {
  try {
    const res = await Service.remove(data.internal.uuid, data.tematik.uuid);
    let uuid = data.tematik.uuid;
    dispatch({
      type: DELETE_INTERNAL_TEMATIK_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
/*
export const create = (name) => (dispatch) => {
  return KategoriService.create({ name }).then(
    (response) => {
      dispatch({
        type: CREATE_KATEGORI_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CREATE_KATEGORI_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
*/
