import {
  CREATE_PROVINSI_SUCCESS,
  CREATE_PROVINSI_FAIL,
  RETRIEVE_PROVINSI_SUCCESS,
  RETRIEVE_PROVINSI_FAIL,
  UPDATE_PROVINSI_SUCCESS,
  UPDATE_PROVINSI_FAIL,
  DELETE_PROVINSI_SUCCESS,
  DELETE_PROVINSI_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PROVINSI_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_PROVINSI_SUCCESS:
      return payload;

    case RETRIEVE_PROVINSI_FAIL:
      return [...datas];

    case UPDATE_PROVINSI_SUCCESS:
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

    case DELETE_PROVINSI_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
