import { CREATE_VERIFY_DATA_SUCCESS, SET_MESSAGE } from "./types";

import Service from "src/services/verify.service";
import EventBus from "src/utils/EventBus";

export const check = (documentFile) => async (dispatch) => {
  try {
    //console.log(nip, namaLengkap, hp, alamat, foto, user, lokasi);
    const res = await Service.checkData(documentFile);

    dispatch({
      type: CREATE_VERIFY_DATA_SUCCESS,
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
