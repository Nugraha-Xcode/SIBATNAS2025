import {
  CREATE_IGT_EKSTERNAL_SUCCESS,
  CREATE_IGT_EKSTERNAL_FAIL,
  RETRIEVE_IGT_EKSTERNAL_SUCCESS,
  RETRIEVE_IGT_EKSTERNAL_FAIL,
  UPDATE_IGT_EKSTERNAL_SUCCESS,
  UPDATE_IGT_EKSTERNAL_FAIL,
  DELETE_IGT_EKSTERNAL_SUCCESS,
  DELETE_IGT_EKSTERNAL_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_IGT_EKSTERNAL_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_IGT_EKSTERNAL_SUCCESS:
      return payload;

    case RETRIEVE_IGT_EKSTERNAL_FAIL:
      return [...datas];

    case UPDATE_IGT_EKSTERNAL_SUCCESS:
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

    case DELETE_IGT_EKSTERNAL_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
