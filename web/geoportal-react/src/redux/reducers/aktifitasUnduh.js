import {
  CREATE_AKTIFITAS_SUCCESS,
  CREATE_AKTIFITAS_FAIL,
  RETRIEVE_AKTIFITAS_SUCCESS,
  RETRIEVE_AKTIFITAS_FAIL,
  UPDATE_AKTIFITAS_SUCCESS,
  UPDATE_AKTIFITAS_FAIL,
  DELETE_AKTIFITAS_SUCCESS,
  DELETE_AKTIFITAS_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_AKTIFITAS_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_AKTIFITAS_SUCCESS:
      return payload;

    case RETRIEVE_AKTIFITAS_FAIL:
      return [...datas];

    case UPDATE_AKTIFITAS_SUCCESS:
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

    case DELETE_AKTIFITAS_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
