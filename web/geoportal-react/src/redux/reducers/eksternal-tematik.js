import {
  CREATE_EKSTERNAL_TEMATIK_SUCCESS,
  CREATE_EKSTERNAL_TEMATIK_FAIL,
  RETRIEVE_EKSTERNAL_TEMATIK_SUCCESS,
  RETRIEVE_EKSTERNAL_TEMATIK_FAIL,
  UPDATE_EKSTERNAL_TEMATIK_SUCCESS,
  UPDATE_EKSTERNAL_TEMATIK_FAIL,
  DELETE_EKSTERNAL_TEMATIK_SUCCESS,
  DELETE_EKSTERNAL_TEMATIK_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_EKSTERNAL_TEMATIK_SUCCESS:
      return [...datas, payload];
    //return payload;

    case RETRIEVE_EKSTERNAL_TEMATIK_SUCCESS:
      return payload;

    case RETRIEVE_EKSTERNAL_TEMATIK_FAIL:
      return [...datas];

    case UPDATE_EKSTERNAL_TEMATIK_SUCCESS:
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

    case DELETE_EKSTERNAL_TEMATIK_SUCCESS:
      //return payload;
      console.log(datas);
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default userReducer;
