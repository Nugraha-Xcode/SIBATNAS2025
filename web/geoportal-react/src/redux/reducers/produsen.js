import {
  CREATE_PRODUSEN_SUCCESS,
  CREATE_PRODUSEN_FAIL,
  RETRIEVE_PRODUSEN_SUCCESS,
  RETRIEVE_PRODUSEN_FAIL,
  UPDATE_PRODUSEN_SUCCESS,
  UPDATE_PRODUSEN_FAIL,
  DELETE_PRODUSEN_SUCCESS,
  DELETE_PRODUSEN_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PRODUSEN_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_PRODUSEN_SUCCESS:
      return payload;

    case RETRIEVE_PRODUSEN_FAIL:
      return [...datas];

    case UPDATE_PRODUSEN_SUCCESS:
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

    case DELETE_PRODUSEN_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
