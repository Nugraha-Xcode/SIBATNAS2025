import {
  CREATE_PUBLIKASI_CSW_SUCCESS,
  CREATE_PUBLIKASI_CSW_FAIL,
  RETRIEVE_PUBLIKASI_CSW_SUCCESS,
  RETRIEVE_PUBLIKASI_CSW_FAIL,
  UPDATE_PUBLIKASI_CSW_SUCCESS,
  UPDATE_PUBLIKASI_CSW_FAIL,
  DELETE_PUBLIKASI_CSW_SUCCESS,
  DELETE_PUBLIKASI_CSW_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PUBLIKASI_CSW_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_PUBLIKASI_CSW_SUCCESS:
      return payload;

    case RETRIEVE_PUBLIKASI_CSW_FAIL:
      return [...datas];

    case UPDATE_PUBLIKASI_CSW_SUCCESS:
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

    case DELETE_PUBLIKASI_CSW_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
