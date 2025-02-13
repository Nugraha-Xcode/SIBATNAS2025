import {
  CREATE_BPKHTL_USER_SUCCESS,
  CREATE_BPKHTL_USER_FAIL,
  RETRIEVE_BPKHTL_USER_SUCCESS,
  RETRIEVE_BPKHTL_USER_FAIL,
  UPDATE_BPKHTL_USER_SUCCESS,
  UPDATE_BPKHTL_USER_FAIL,
  DELETE_BPKHTL_USER_SUCCESS,
  DELETE_BPKHTL_USER_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/bpkhtl-user.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_BPKHTL_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveBpkhtlUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllUser(uuid);

    dispatch({
      type: RETRIEVE_BPKHTL_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const create = (bpkhtl, user) => async (dispatch) => {
  try {
    const res = await Service.create({
      bpkhtl,
      user,
    });

    dispatch({
      type: CREATE_BPKHTL_USER_SUCCESS,
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
      type: UPDATE_BPKHTL_USER_SUCCESS,
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
    const res = await Service.remove(data.bpkhtl.uuid, data.user.uuid);
    let uuid = data.user.uuid;
    dispatch({
      type: DELETE_BPKHTL_USER_SUCCESS,
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
