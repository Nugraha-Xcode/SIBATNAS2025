import {
  CREATE_RECORD_SUCCESS,
  CREATE_RECORD_FAIL,
  RETRIEVE_RECORD_SUCCESS,
  RETRIEVE_RECORD_FAIL,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_FAIL,
  DELETE_RECORD_SUCCESS,
  DELETE_RECORD_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_RECORD_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_RECORD_SUCCESS:
      return payload;

    case RETRIEVE_RECORD_FAIL:
      return [...datas];

    case UPDATE_RECORD_SUCCESS:
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

    case DELETE_RECORD_SUCCESS:
      return datas.filter(
        ({ identifier }) => identifier !== payload.identifier
      );

    default:
      return datas;
  }
}

export default Reducer;
