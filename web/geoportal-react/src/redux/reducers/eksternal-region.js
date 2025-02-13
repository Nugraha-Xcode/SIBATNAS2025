import {
  CREATE_EKSTERNAL_REGION_SUCCESS,
  CREATE_EKSTERNAL_REGION_FAIL,
  RETRIEVE_EKSTERNAL_REGION_SUCCESS,
  RETRIEVE_EKSTERNAL_REGION_FAIL,
  UPDATE_EKSTERNAL_REGION_SUCCESS,
  UPDATE_EKSTERNAL_REGION_FAIL,
  DELETE_EKSTERNAL_REGION_SUCCESS,
  DELETE_EKSTERNAL_REGION_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_EKSTERNAL_REGION_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_EKSTERNAL_REGION_SUCCESS:
      return payload;

    case RETRIEVE_EKSTERNAL_REGION_FAIL:
      return [...datas];

    case UPDATE_EKSTERNAL_REGION_SUCCESS:
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

    case DELETE_EKSTERNAL_REGION_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
