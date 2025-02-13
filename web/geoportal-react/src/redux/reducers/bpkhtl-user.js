import {
  CREATE_BPKHTL_USER_SUCCESS,
  CREATE_BPKHTL_USER_FAIL,
  RETRIEVE_BPKHTL_USER_SUCCESS,
  RETRIEVE_BPKHTL_USER_FAIL,
  UPDATE_BPKHTL_USER_SUCCESS,
  UPDATE_BPKHTL_USER_FAIL,
  DELETE_BPKHTL_USER_SUCCESS,
  DELETE_BPKHTL_USER_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BPKHTL_USER_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_BPKHTL_USER_SUCCESS:
      return payload;

    case RETRIEVE_BPKHTL_USER_FAIL:
      return [...datas];

    case UPDATE_BPKHTL_USER_SUCCESS:
      return datas.map((data) => {
        if (data.uuid === payload.uuid) {
          return {
            ...datas,
            ...payload,
          };
        } else {
          return data;
        }
      });

    case DELETE_BPKHTL_USER_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
