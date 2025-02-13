import {
  RETRIEVE_CAKUPAN_WILAYAH_SUCCESS,
  RETRIEVE_CAKUPAN_WILAYAH_FAIL,
} from "../actions/types";

const initialState = [];

function roleReducer(roles = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_CAKUPAN_WILAYAH_SUCCESS:
      return payload;

    case RETRIEVE_CAKUPAN_WILAYAH_FAIL:
      return [...roles];

    default:
      return roles;
  }
}

export default roleReducer;
