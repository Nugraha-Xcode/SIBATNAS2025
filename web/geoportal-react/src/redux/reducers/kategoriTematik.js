import {
  CREATE_KATEGORI_TEMATIK_SUCCESS,
  CREATE_KATEGORI_TEMATIK_FAIL,
  RETRIEVE_KATEGORI_TEMATIK_SUCCESS,
  RETRIEVE_KATEGORI_TEMATIK_FAIL,
  UPDATE_KATEGORI_TEMATIK_SUCCESS,
  UPDATE_KATEGORI_TEMATIK_FAIL,
  DELETE_KATEGORI_TEMATIK_SUCCESS,
  DELETE_KATEGORI_TEMATIK_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_KATEGORI_TEMATIK_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_KATEGORI_TEMATIK_SUCCESS:
      return payload;

    case RETRIEVE_KATEGORI_TEMATIK_FAIL:
      return [...datas];

    case UPDATE_KATEGORI_TEMATIK_SUCCESS:
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

    case DELETE_KATEGORI_TEMATIK_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
