import {
  CREATE_DATA_EKSTERNAL_SUCCESS,
  CREATE_DATA_EKSTERNAL_FAIL,
  RETRIEVE_DATA_EKSTERNAL_SUCCESS,
  RETRIEVE_DATA_EKSTERNAL_FAIL,
  UPDATE_DATA_EKSTERNAL_SUCCESS,
  UPDATE_DATA_EKSTERNAL_FAIL,
  DELETE_DATA_EKSTERNAL_SUCCESS,
  DELETE_DATA_EKSTERNAL_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data-eksternal.service";
import EventBus from "src/utils/EventBus";

export const retrieveAllData = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_EKSTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllEksternal = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllEksternal(uuid);
    dispatch({
      type: RETRIEVE_DATA_EKSTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllEksternalUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllEksternalUser(uuid);
    dispatch({
      type: RETRIEVE_DATA_EKSTERNAL_SUCCESS,
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
  (deskripsi, user, tematik, documentFile, dataSpasialFile) =>
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
        dataSpasialFile
      );

      dispatch({
        type: CREATE_DATA_EKSTERNAL_SUCCESS,
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
export const createDatang =
  (namaTamu, tujuan, keperluan, user, lokasi, file, onUploadProgress) =>
  async (dispatch) => {
    try {
      //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
      const res = await Service.createDatang(
        {
          namaTamu,
          tujuan,
          keperluan,
          user,
          lokasi,
        },
        file,
        onUploadProgress
      );

      dispatch({
        type: CREATE_DATA_EKSTERNAL_SUCCESS,
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
export const updatePulang = (uuid, user) => async (dispatch) => {
  try {
    const res = await Service.updatePulang(uuid, user);

    dispatch({
      type: UPDATE_DATA_EKSTERNAL_SUCCESS,
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
      type: UPDATE_DATA_EKSTERNAL_SUCCESS,
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
      type: DELETE_DATA_EKSTERNAL_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveByUUID = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getByUUID(uuid);
    console.log(res.data);
    dispatch({
      type: RETRIEVE_DATA_EKSTERNAL_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const unduhIndonesia = (uuid, user_uuid) => async () => {
  try {
    console.log(uuid);
    const res = await Service.unduhIndonesia(uuid, user_uuid);
    /*
    dispatch({
      type: UPDATE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
    */
    console.log(res);
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const unduh = (level, uuid, data, user_uuid) => async () => {
  try {
    console.log(uuid);
    console.log(data);

    const res = await Service.unduh(
      level,
      uuid,
      level == "provinsi" ? data.province.kode : data.region.kode,
      user_uuid
    );
    /*
    dispatch({
      type: UPDATE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
    */
    console.log(res);
    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
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
