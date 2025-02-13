import {
  CREATE_IGT_INTERNAL_SUCCESS,
  CREATE_IGT_INTERNAL_FAIL,
  RETRIEVE_IGT_INTERNAL_SUCCESS,
  RETRIEVE_IGT_INTERNAL_FAIL,
  UPDATE_IGT_INTERNAL_SUCCESS,
  UPDATE_IGT_INTERNAL_FAIL,
  DELETE_IGT_INTERNAL_SUCCESS,
  DELETE_IGT_INTERNAL_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_IGT_INTERNAL_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_IGT_INTERNAL_SUCCESS:
      return payload;

    case RETRIEVE_IGT_INTERNAL_FAIL:
      return [...datas];

    case UPDATE_IGT_INTERNAL_SUCCESS:
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

    case DELETE_IGT_INTERNAL_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
