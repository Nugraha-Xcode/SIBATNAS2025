import {
  CREATE_DATA_PUBLIKASI_SUCCESS,
  CREATE_DATA_PUBLIKASI_FAIL,
  RETRIEVE_DATA_PUBLIKASI_SUCCESS,
  RETRIEVE_DATA_PUBLIKASI_FAIL,
  RETRIEVE_DATA_PUBLIKASI_UNDUH_SUCCESS,
  UPDATE_DATA_PUBLIKASI_SUCCESS,
  UPDATE_DATA_PUBLIKASI_FAIL,
  UNPUBLISH_DATA_PUBLIKASI_SUCCESS,
  UNPUBLISH_DATA_PUBLIKASI_FAIL,
  DELETE_DATA_PUBLIKASI_SUCCESS,
  DELETE_DATA_PUBLIKASI_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data-publikasi.service";
import EventBus from "src/utils/EventBus";

export const retrieveAllData = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveByProdusen = (uuid, params = {}) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusen(uuid, params);
    
    // Pastikan struktur data yang tepat
    const payload = res.data.records 
      ? res.data 
      : { 
          records: res.data, 
          totalItems: res.data.length, 
          totalPages: 1, 
          currentPage: params.page || 0 
        };
        
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: payload,
    });
    return Promise.resolve(payload);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.error('Error in retrieveByProdusen:', err);
    
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_FAIL,
    });
    
    return Promise.reject(err);
  }
};

export const retrieveByProdusenAdmin = (uuid, params = {}) => async (dispatch) => {
  try {
    const res = await Service.getAllProdusenAdmin(uuid, params);
    
    // Pastikan struktur data yang tepat
    const payload = res.data.records 
      ? res.data 
      : { 
          records: res.data, 
          totalItems: res.data.length, 
          totalPages: 1, 
          currentPage: params.page || 0 
        };
        
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: payload,
    });
    return Promise.resolve(payload);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.error('Error in retrieveByProdusenAdmin:', err);
    
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_FAIL,
    });
    
    return Promise.reject(err);
  }
};

export const retrieveByEksternalUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllEksternalUser(uuid);
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveByInternalUser = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllInternalUser(uuid);
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const cariIGT = (query) => async (dispatch) => {
  try {
    const res = await Service.getAllIGT(query);
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllLocation = (uuid) => async (dispatch) => {
  try {
    const res = await Service.getAllLocation(uuid);
    dispatch({
      type: RETRIEVE_DATA_PUBLIKASI_SUCCESS,
      payload: res.data,
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
      type: RETRIEVE_DATA_PUBLIKASI_UNDUH_SUCCESS,
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
        type: CREATE_DATA_PUBLIKASI_SUCCESS,
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

export const publish = (uuid, user, isPublic) => async (dispatch) => {
  try {
    const data = {
      uuid,
      user,
      is_public: isPublic,
    };

    const res = await Service.publish(uuid, data);

    dispatch({
      type: UPDATE_DATA_PUBLIKASI_SUCCESS,
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

export const deactivate = (uuid, user) => async (dispatch) => {
  try {
    const res = await Service.deactivate(uuid, user);

    dispatch({
      type: UPDATE_DATA_PUBLIKASI_SUCCESS,
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

export const unduh = (uuid, user_uuid) => async () => {
  try {
    console.log(uuid);
    // console.log(data);

    const res = await Service.unduh(
      uuid,
      //level == "provinsi" ? data.province.kode : data.region.kode,
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

export const update = (uuid, data) => async (dispatch) => {
  try {
    const res = await Service.update(uuid, data);

    dispatch({
      type: UPDATE_DATA_PUBLIKASI_SUCCESS,
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
      type: DELETE_DATA_PUBLIKASI_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const unpublish = (uuid, user) => async (dispatch) => {
  try {
    const res = await Service.unpublish(uuid, user);

    dispatch({
      type: UNPUBLISH_DATA_PUBLIKASI_SUCCESS,
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
