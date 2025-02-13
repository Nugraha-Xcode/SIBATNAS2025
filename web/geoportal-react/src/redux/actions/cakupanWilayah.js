import {
  RETRIEVE_CAKUPAN_WILAYAH_SUCCESS,
  RETRIEVE_CAKUPAN_WILAYAH_FAIL,
  SET_MESSAGE,
} from "./types";

import Service from "src/services/cakupanWilayah.service";
import EventBus from "src/utils/EventBus";
export const retrieve = () => async (dispatch) => {
  try {
    const res = await Service.getAll();

    dispatch({
      type: RETRIEVE_CAKUPAN_WILAYAH_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
