import {
  CREATE_NOTIFIKASI_SUCCESS,
  CREATE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_SUCCESS,
  RETRIEVE_NOTIFIKASI_FAIL,
  UPDATE_NOTIFIKASI_SUCCESS,
  UPDATE_NOTIFIKASI_FAIL,
  DELETE_NOTIFIKASI_SUCCESS,
  DELETE_NOTIFIKASI_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_NOTIFIKASI_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_NOTIFIKASI_SUCCESS:
      return payload;

    case RETRIEVE_NOTIFIKASI_FAIL:
      return [...datas];

    case UPDATE_NOTIFIKASI_SUCCESS:
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

    case DELETE_NOTIFIKASI_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
