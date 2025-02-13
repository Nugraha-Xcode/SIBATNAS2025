import {
  CREATE_SETTING_SUCCESS,
  CREATE_SETTING_FAIL,
  RETRIEVE_SETTING_SUCCESS,
  RETRIEVE_SETTING_FAIL,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAIL,
  DELETE_SETTING_SUCCESS,
  DELETE_SETTING_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/setting.service";
import EventBus from "src/utils/EventBus";

export const retrieveInfoBatas = () => async (dispatch) => {
  try {
    const res = await Service.getAktif();

    dispatch({
      type: RETRIEVE_SETTING_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const create = (name) => async (dispatch) => {
  try {
    const res = await Service.create({
      name,
    });

    dispatch({
      type: CREATE_SETTING_SUCCESS,
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
    //console.log(uuid, data);
    const res = await Service.update(uuid, data);

    dispatch({
      type: RETRIEVE_SETTING_SUCCESS,
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
