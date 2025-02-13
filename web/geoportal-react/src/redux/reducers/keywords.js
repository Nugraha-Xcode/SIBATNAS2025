import {
  CREATE_KEYWORDS_SUCCESS,
  CREATE_KEYWORDS_FAIL,
  RETRIEVE_KEYWORDS_SUCCESS,
  RETRIEVE_KEYWORDS_FAIL,
  UPDATE_KEYWORDS_SUCCESS,
  UPDATE_KEYWORDS_FAIL,
  DELETE_KEYWORDS_SUCCESS,
  DELETE_KEYWORDS_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_KEYWORDS_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_KEYWORDS_SUCCESS:
      return payload;

    case RETRIEVE_KEYWORDS_FAIL:
      return [...datas];

    case UPDATE_KEYWORDS_SUCCESS:
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

    case DELETE_KEYWORDS_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
