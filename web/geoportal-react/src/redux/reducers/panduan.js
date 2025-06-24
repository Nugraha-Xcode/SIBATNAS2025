import {
  CREATE_PANDUAN,
  RETRIEVE_PANDUAN,
  UPDATE_PANDUAN,
  DELETE_PANDUAN,
  RETRIEVE_PANDUAN_PUBLIC,
} from "../actions/types";

const initialState = [];

function panduanReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PANDUAN:
      return [...datas, payload];

    case RETRIEVE_PANDUAN:
      return payload;

    case UPDATE_PANDUAN:
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

    case DELETE_PANDUAN:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    case RETRIEVE_PANDUAN_PUBLIC:
      return payload;

    default:
      return datas;
  }
}

export default panduanReducer;
