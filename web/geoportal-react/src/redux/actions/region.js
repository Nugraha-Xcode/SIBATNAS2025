import {
  CREATE_REGION_SUCCESS,
  CREATE_REGION_FAIL,
  RETRIEVE_REGION_SUCCESS,
  RETRIEVE_REGION_FAIL,
  UPDATE_REGION_SUCCESS,
  UPDATE_REGION_FAIL,
  DELETE_REGION_SUCCESS,
  DELETE_REGION_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/region.service";
import EventBus from "src/utils/EventBus";

export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_REGION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveRegionProvinsi = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllProvinsi(uuid);

    dispatch({
      type: RETRIEVE_REGION_SUCCESS,
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllProvinsi = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllLocation(uuid);
    dispatch({
      type: RETRIEVE_REGION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const create = (kode, name, province) => async (dispatch) => {
  try {
    //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
    const res = await Service.create({
      kode,
      name,
      province,
    });

    dispatch({
      type: CREATE_REGION_SUCCESS,
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

export const uploadPolygon = (uuid, documentFile) => async (dispatch) => {
  try {
    const res = await Service.uploadPolygon(uuid, documentFile);

    dispatch({
      type: UPDATE_REGION_SUCCESS,
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

export const updateGrass = (uuid) => async (dispatch) => {
  try {
    const res = await Service.updateGrass(uuid, {});
    dispatch({
      type: UPDATE_REGION_SUCCESS,
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
      type: UPDATE_REGION_SUCCESS,
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
      type: DELETE_REGION_SUCCESS,
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
