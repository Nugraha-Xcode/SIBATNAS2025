import {
  CREATE_DATA_PEMERIKSAAN_SUCCESS,
  CREATE_DATA_PEMERIKSAAN_FAIL,
  RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
  RETRIEVE_DATA_PEMERIKSAAN_FAIL,
  UPDATE_DATA_PEMERIKSAAN_SUCCESS,
  UPDATE_DATA_PEMERIKSAAN_FAIL,
  DELETE_DATA_PEMERIKSAAN_SUCCESS,
  DELETE_DATA_PEMERIKSAAN_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data-pemeriksaan.service";
import EventBus from "src/utils/EventBus";

export const retrieveAllData = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllProdusen = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusen(uuid);
    dispatch({
      type: RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllProdusenUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusenUser(uuid);
    dispatch({
      type: RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
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
  (user, kategori, dataProdusen, uuid, documentFile) => async (dispatch) => {
    try {
      //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
      const res = await Service.createData(
        {
          user,
          kategori,
          dataProdusen,
          uuid,
        },
        documentFile
      );

      dispatch({
        type: UPDATE_DATA_PEMERIKSAAN_SUCCESS,
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
      type: UPDATE_DATA_PEMERIKSAAN_SUCCESS,
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
      type: DELETE_DATA_PEMERIKSAAN_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllProdusenPaginated = (uuid, params) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusenPaginated(uuid, params);
    dispatch({
      type: RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
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

export const retrieveAllProdusenUserPaginated = (uuid, params) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusenUserPaginated(uuid, params);
    
    // Ensure the response has the correct structure
    const payload = res.data.records 
      ? res.data 
      : { 
          records: res.data, 
          totalItems: res.data.length, 
          totalPages: 1, 
          currentPage: 0 
        };

    dispatch({
      type: RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
      payload: payload,
    });
    return Promise.resolve(payload);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.error('Pagination fetch error:', err);
    return Promise.reject(err);
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
