import {
  CREATE_INTERNAL_REGION_SUCCESS,
  CREATE_INTERNAL_REGION_FAIL,
  RETRIEVE_INTERNAL_REGION_SUCCESS,
  RETRIEVE_INTERNAL_REGION_FAIL,
  UPDATE_INTERNAL_REGION_SUCCESS,
  UPDATE_INTERNAL_REGION_FAIL,
  DELETE_INTERNAL_REGION_SUCCESS,
  DELETE_INTERNAL_REGION_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/internal-region.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_INTERNAL_REGION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveInternalRegion = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternal(uuid);

    dispatch({
      type: RETRIEVE_INTERNAL_REGION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create = (internal, region) => async (dispatch) => {
  try {
    const res = await Service.create({
      internal,
      region,
    });

    dispatch({
      type: CREATE_INTERNAL_REGION_SUCCESS,
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
      type: UPDATE_INTERNAL_REGION_SUCCESS,
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
    const res = await Service.remove(data.internal.uuid, data.region.uuid);
    let uuid = data.region.uuid;
    dispatch({
      type: DELETE_INTERNAL_REGION_SUCCESS,
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
