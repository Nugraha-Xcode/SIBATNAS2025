import {
  CREATE_STATISTIK_SUCCESS,
  CREATE_STATISTIK_FAIL,
  RETRIEVE_STATISTIK_SUCCESS,
  RETRIEVE_STATISTIK_FAIL,
  UPDATE_STATISTIK_SUCCESS,
  UPDATE_STATISTIK_FAIL,
  DELETE_STATISTIK_SUCCESS,
  DELETE_STATISTIK_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_STATISTIK_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_STATISTIK_SUCCESS:
      return payload;

    case RETRIEVE_STATISTIK_FAIL:
      return [...datas];

    case UPDATE_STATISTIK_SUCCESS:
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

    case DELETE_STATISTIK_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
