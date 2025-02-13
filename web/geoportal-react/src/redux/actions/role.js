import {
  RETRIEVE_ROLE_SUCCESS,
  RETRIEVE_ROLE_FAIL,
  SET_MESSAGE,
} from "./types";

import RoleService from "src/services/role.service";
import EventBus from "src/utils/EventBus";
export const retrieveRole = () => async (dispatch) => {
  try {
    const res = await RoleService.getAll();

    dispatch({
      type: RETRIEVE_ROLE_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
