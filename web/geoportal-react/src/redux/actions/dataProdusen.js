import {
  CREATE_DATA_PRODUSEN_SUCCESS,
  CREATE_DATA_PRODUSEN_FAIL,
  RETRIEVE_DATA_PRODUSEN_SUCCESS,
  RETRIEVE_DATA_PRODUSEN_FAIL,
  UPDATE_DATA_PRODUSEN_SUCCESS,
  UPDATE_DATA_PRODUSEN_FAIL,
  DELETE_DATA_PRODUSEN_SUCCESS,
  DELETE_DATA_PRODUSEN_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/data-produsen.service";
import EventBus from "src/utils/EventBus";

export const retrieveAll = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_DATA_PRODUSEN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveAllProdusen = (uuid, params) => async (dispatch) => {
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
        console.log("retrieveAllProdusen",payload);
    dispatch({
      type: RETRIEVE_DATA_PRODUSEN_SUCCESS,
      payload: payload,
    });
    return Promise.resolve(payload);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.error('Error in retrieveAllProdusenPaginated:', err);
    
    dispatch({
      type: RETRIEVE_DATA_PRODUSEN_FAIL,
    });
    
    return Promise.reject(err);
  }
};

export const retrieveAllProdusenUser = (uuid, params) => async (dispatch) => {
  console.log("retrieveAllProdusenUser",uuid,params);
  try {
    const res = await Service.getAllUser(uuid, params);
    
    // Pastikan struktur data yang tepat
    const payload = res.data.records 
      ? res.data 
      : { 
          records: res.data, 
          totalItems: res.data.length, 
          totalPages: 1, 
          currentPage: params.page || 0 
        };
        console.log("retrieveAllProdusenUser",payload);
    dispatch({
      type: RETRIEVE_DATA_PRODUSEN_SUCCESS,
      payload: payload,
    });
    return Promise.resolve(payload);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.error('Pagination fetch error:', err);
    
    dispatch({
      type: RETRIEVE_DATA_PRODUSEN_FAIL,
    });
    
    return Promise.reject(err);
  }
};

export const unduhReferensi = (data) => async (dispatch) => {
  try {
    let response = await Service.unduhReferensi(data.uuid);
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", data.pdfname); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    let id = "s";
    dispatch({
      type: DELETE_DATA_PRODUSEN_SUCCESS,
      payload: { id },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const unduhMetadata = (uuid) => async (dispatch) => {
  try {
    let response = await Service.unduhReferensi(uuid);
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "metadata.xml"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    let id = "s";
    dispatch({
      type: DELETE_DATA_PRODUSEN_SUCCESS,
      payload: { id },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
export const unduhFile = (uuid) => async (dispatch) => {
  try {
    let response = await Service.unduhReferensi(uuid);
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "file_spasial.zip"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    let id = "s";
    dispatch({
      type: DELETE_DATA_PRODUSEN_SUCCESS,
      payload: { id },
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
      type: RETRIEVE_DATA_PRODUSEN_SUCCESS,
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
        type: CREATE_DATA_PRODUSEN_SUCCESS,
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
        type: CREATE_DATA_PRODUSEN_SUCCESS,
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
      type: UPDATE_DATA_PRODUSEN_SUCCESS,
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
      type: UPDATE_DATA_PRODUSEN_SUCCESS,
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
      type: DELETE_DATA_PRODUSEN_SUCCESS,
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
