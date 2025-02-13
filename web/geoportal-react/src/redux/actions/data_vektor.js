import {
  CREATE_DATA_VEKTOR_SUCCESS,
  CREATE_DATA_VEKTOR_FAIL,
  RETRIEVE_DATA_VEKTOR_SUCCESS,
  RETRIEVE_DATA_VEKTOR_FAIL,
  UPDATE_DATA_VEKTOR_SUCCESS,
  UPDATE_DATA_VEKTOR_FAIL,
  DELETE_DATA_VEKTOR_SUCCESS,
  DELETE_DATA_VEKTOR_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data_vektor.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_VEKTOR_SUCCESS,
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
      type: CREATE_DATA_VEKTOR_SUCCESS,
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
      type: UPDATE_DATA_VEKTOR_SUCCESS,
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
      type: DELETE_DATA_VEKTOR_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
