import {
  CREATE_DATA_PEMERIKSAAN_SUCCESS,
  CREATE_DATA_PEMERIKSAAN_FAIL,
  RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
  RETRIEVE_DATA_PEMERIKSAAN_FAIL,
  UPDATE_DATA_PEMERIKSAAN_SUCCESS,
  UPDATE_DATA_PEMERIKSAAN_FAIL,
  DELETE_DATA_PEMERIKSAAN_SUCCESS,
  DELETE_DATA_PEMERIKSAAN_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_PEMERIKSAAN_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_DATA_PEMERIKSAAN_SUCCESS:
      return payload;

    case RETRIEVE_DATA_PEMERIKSAAN_FAIL:
      return [...datas];

    case UPDATE_DATA_PEMERIKSAAN_SUCCESS:
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

    case DELETE_DATA_PEMERIKSAAN_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
