import {
  CREATE_DATA_INTERNAL_SUCCESS,
  CREATE_DATA_INTERNAL_FAIL,
  RETRIEVE_DATA_INTERNAL_SUCCESS,
  RETRIEVE_DATA_INTERNAL_FAIL,
  UPDATE_DATA_INTERNAL_SUCCESS,
  UPDATE_DATA_INTERNAL_FAIL,
  DELETE_DATA_INTERNAL_SUCCESS,
  DELETE_DATA_INTERNAL_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data-internal.service";
import EventBus from "src/utils/EventBus";

export const retrieveAllData = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_INTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllInternal = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternal(uuid);
    dispatch({
      type: RETRIEVE_DATA_INTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create =
  (deskripsi, user, tematik, documentFile, metadataFile, dataSpasialFile) =>
  async (dispatch) => {
    try {
      //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
      const res = await Service.createData(
        {
          deskripsi,
          user,
          tematik,
        },
        documentFile,
        metadataFile,
        dataSpasialFile
      );

      dispatch({
        type: CREATE_DATA_INTERNAL_SUCCESS,
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
      type: UPDATE_DATA_INTERNAL_SUCCESS,
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
      type: DELETE_DATA_INTERNAL_SUCCESS,
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
