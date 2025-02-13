import {
  CREATE_BPKHTL_PROVINCE_SUCCESS,
  CREATE_BPKHTL_PROVINCE_FAIL,
  RETRIEVE_BPKHTL_PROVINCE_SUCCESS,
  RETRIEVE_BPKHTL_PROVINCE_FAIL,
  UPDATE_BPKHTL_PROVINCE_SUCCESS,
  UPDATE_BPKHTL_PROVINCE_FAIL,
  DELETE_BPKHTL_PROVINCE_SUCCESS,
  DELETE_BPKHTL_PROVINCE_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/bpkhtl-province.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_BPKHTL_PROVINCE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveBpkhtlProvince = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllProvince(uuid);

    dispatch({
      type: RETRIEVE_BPKHTL_PROVINCE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveBpkhtlProvinceUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllProvinceUser(uuid);

    dispatch({
      type: RETRIEVE_BPKHTL_PROVINCE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const create = (bpkhtl, province) => async (dispatch) => {
  try {
    const res = await Service.create({
      bpkhtl,
      province,
    });

    dispatch({
      type: CREATE_BPKHTL_PROVINCE_SUCCESS,
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
      type: UPDATE_BPKHTL_PROVINCE_SUCCESS,
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
    const res = await Service.remove(data.bpkhtl.uuid, data.province.uuid);
    let uuid = data.province.uuid;
    dispatch({
      type: DELETE_BPKHTL_PROVINCE_SUCCESS,
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
