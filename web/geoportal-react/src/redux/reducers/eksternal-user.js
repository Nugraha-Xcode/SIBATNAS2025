import {
  CREATE_EKSTERNAL_USER_SUCCESS,
  CREATE_EKSTERNAL_USER_FAIL,
  RETRIEVE_EKSTERNAL_USER_SUCCESS,
  RETRIEVE_EKSTERNAL_USER_FAIL,
  UPDATE_EKSTERNAL_USER_SUCCESS,
  UPDATE_EKSTERNAL_USER_FAIL,
  DELETE_EKSTERNAL_USER_SUCCESS,
  DELETE_EKSTERNAL_USER_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_EKSTERNAL_USER_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_EKSTERNAL_USER_SUCCESS:
      return payload;

    case RETRIEVE_EKSTERNAL_USER_FAIL:
      return [...datas];

    case UPDATE_EKSTERNAL_USER_SUCCESS:
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

    case DELETE_EKSTERNAL_USER_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
