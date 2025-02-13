import {
  CREATE_DATA_VEKTOR_SUCCESS,
  CREATE_DATA_VEKTOR_FAIL,
  RETRIEVE_DATA_VEKTOR_SUCCESS,
  RETRIEVE_DATA_VEKTOR_FAIL,
  UPDATE_DATA_VEKTOR_SUCCESS,
  UPDATE_DATA_VEKTOR_FAIL,
  DELETE_DATA_VEKTOR_SUCCESS,
  DELETE_DATA_VEKTOR_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_VEKTOR_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_DATA_VEKTOR_SUCCESS:
      return payload;

    case RETRIEVE_DATA_VEKTOR_FAIL:
      return [...datas];

    case UPDATE_DATA_VEKTOR_SUCCESS:
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

    case DELETE_DATA_VEKTOR_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
