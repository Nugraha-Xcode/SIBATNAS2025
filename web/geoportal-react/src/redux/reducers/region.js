import {
  CREATE_REGION_SUCCESS,
  CREATE_REGION_FAIL,
  RETRIEVE_REGION_SUCCESS,
  RETRIEVE_REGION_FAIL,
  UPDATE_REGION_SUCCESS,
  UPDATE_REGION_FAIL,
  DELETE_REGION_SUCCESS,
  DELETE_REGION_FAIL,
} from "../actions/types";

const initialState = [];

function bukutamuReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_REGION_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_REGION_SUCCESS:
      return payload;

    case RETRIEVE_REGION_FAIL:
      return [...datas];

    case UPDATE_REGION_SUCCESS:
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

    case DELETE_REGION_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default bukutamuReducer;
