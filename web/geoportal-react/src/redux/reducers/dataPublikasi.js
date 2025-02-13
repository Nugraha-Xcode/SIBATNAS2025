import {
  CREATE_DATA_PUBLIKASI_SUCCESS,
  CREATE_DATA_PUBLIKASI_FAIL,
  RETRIEVE_DATA_PUBLIKASI_SUCCESS,
  RETRIEVE_DATA_PUBLIKASI_FAIL,
  UPDATE_DATA_PUBLIKASI_SUCCESS,
  UPDATE_DATA_PUBLIKASI_FAIL,
  DELETE_DATA_PUBLIKASI_SUCCESS,
  DELETE_DATA_PUBLIKASI_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_PUBLIKASI_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_DATA_PUBLIKASI_SUCCESS:
      return payload;

    case RETRIEVE_DATA_PUBLIKASI_FAIL:
      return [...datas];

    case UPDATE_DATA_PUBLIKASI_SUCCESS:
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

    case DELETE_DATA_PUBLIKASI_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
