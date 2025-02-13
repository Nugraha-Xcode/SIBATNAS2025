import {
  CREATE_IGT_INTERNAL_SUCCESS,
  CREATE_IGT_INTERNAL_FAIL,
  RETRIEVE_IGT_INTERNAL_SUCCESS,
  RETRIEVE_IGT_INTERNAL_FAIL,
  UPDATE_IGT_INTERNAL_SUCCESS,
  UPDATE_IGT_INTERNAL_FAIL,
  DELETE_IGT_INTERNAL_SUCCESS,
  DELETE_IGT_INTERNAL_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/igt-internal.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_IGT_INTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveIgtInternal = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternal(uuid);

    dispatch({
      type: RETRIEVE_IGT_INTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveIgtInternalUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternalUser(uuid);

    dispatch({
      type: RETRIEVE_IGT_INTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create = (name, internal) => async (dispatch) => {
  try {
    const res = await Service.create({
      name,
      internal,
    });

    dispatch({
      type: CREATE_IGT_INTERNAL_SUCCESS,
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
      type: UPDATE_IGT_INTERNAL_SUCCESS,
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
      type: DELETE_IGT_INTERNAL_SUCCESS,
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
