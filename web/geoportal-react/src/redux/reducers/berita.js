import {
  CREATE_BERITA,
  RETRIEVE_BERITA,
  UPDATE_BERITA,
  DELETE_BERITA,
  RETRIEVE_BERITA_PUBLIC,
  RETRIEVE_BERITA_PUBLIC_FAIL,
} from "../actions/types";

const initialState = [];

function beritaReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BERITA:
      return [...datas, payload];

    case RETRIEVE_BERITA:
    case RETRIEVE_BERITA_PUBLIC:
      return payload;

    case UPDATE_BERITA:
      return datas.map((data) => {
        if (data.uuid === payload.uuid) {
          return {
            ...data,
            ...payload,
          };
        } else {
          return data;
        }
      });

    case DELETE_BERITA:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);
    
    case RETRIEVE_BERITA_PUBLIC_FAIL:
      return datas; 

    default:
      return datas;
  }
}

export default beritaReducer;