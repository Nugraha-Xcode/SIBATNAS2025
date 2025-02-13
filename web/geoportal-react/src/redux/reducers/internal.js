import {
  CREATE_INTERNAL_SUCCESS,
  CREATE_INTERNAL_FAIL,
  RETRIEVE_INTERNAL_SUCCESS,
  RETRIEVE_INTERNAL_FAIL,
  UPDATE_INTERNAL_SUCCESS,
  UPDATE_INTERNAL_FAIL,
  DELETE_INTERNAL_SUCCESS,
  DELETE_INTERNAL_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_INTERNAL_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_INTERNAL_SUCCESS:
      return payload;

    case RETRIEVE_INTERNAL_FAIL:
      return [...datas];

    case UPDATE_INTERNAL_SUCCESS:
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

    case DELETE_INTERNAL_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
