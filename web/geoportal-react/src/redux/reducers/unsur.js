import {
  CREATE_UNSUR_SUCCESS,
  CREATE_UNSUR_FAIL,
  RETRIEVE_UNSUR_SUCCESS,
  RETRIEVE_UNSUR_FAIL,
  UPDATE_UNSUR_SUCCESS,
  UPDATE_UNSUR_FAIL,
  DELETE_UNSUR_SUCCESS,
  DELETE_UNSUR_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_UNSUR_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_UNSUR_SUCCESS:
      return payload;

    case RETRIEVE_UNSUR_FAIL:
      return [...datas];

    case UPDATE_UNSUR_SUCCESS:
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

    case DELETE_UNSUR_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
