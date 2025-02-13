import {
  CREATE_PUBLIKASI_CSW_SUCCESS,
  CREATE_PUBLIKASI_CSW_FAIL,
  RETRIEVE_PUBLIKASI_CSW_SUCCESS,
  RETRIEVE_PUBLIKASI_CSW_FAIL,
  UPDATE_PUBLIKASI_CSW_SUCCESS,
  UPDATE_PUBLIKASI_CSW_FAIL,
  DELETE_PUBLIKASI_CSW_SUCCESS,
  DELETE_PUBLIKASI_CSW_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/publikasi_csw.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_PUBLIKASI_CSW_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrievePublik = () => async (dispatch) => {
  try {
    const res = await Service.getAllPublik();

    dispatch({
      type: RETRIEVE_PUBLIKASI_CSW_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create = (uuid, metadataFile) => async (dispatch) => {
  try {
    const res = await Service.createData(
      {
        uuid,
      },
      metadataFile
    );

    dispatch({
      type: UPDATE_PUBLIKASI_CSW_SUCCESS,
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
      type: UPDATE_PUBLIKASI_CSW_SUCCESS,
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
      type: DELETE_PUBLIKASI_CSW_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
