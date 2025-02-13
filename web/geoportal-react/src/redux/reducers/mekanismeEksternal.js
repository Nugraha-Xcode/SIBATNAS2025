import {
  CREATE_MEKANISME_EKSTERNAL_SUCCESS,
  CREATE_MEKANISME_EKSTERNAL_FAIL,
  RETRIEVE_MEKANISME_EKSTERNAL_SUCCESS,
  RETRIEVE_MEKANISME_EKSTERNAL_FAIL,
  UPDATE_MEKANISME_EKSTERNAL_SUCCESS,
  UPDATE_MEKANISME_EKSTERNAL_FAIL,
  DELETE_MEKANISME_EKSTERNAL_SUCCESS,
  DELETE_MEKANISME_EKSTERNAL_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_MEKANISME_EKSTERNAL_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_MEKANISME_EKSTERNAL_SUCCESS:
      return payload;

    case RETRIEVE_MEKANISME_EKSTERNAL_FAIL:
      return [...datas];

    case UPDATE_MEKANISME_EKSTERNAL_SUCCESS:
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

    case DELETE_MEKANISME_EKSTERNAL_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
