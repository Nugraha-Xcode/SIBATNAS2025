import {
  CREATE_METADATA_SUCCESS,
  CREATE_METADATA_FAIL,
  RETRIEVE_METADATA_SUCCESS,
  RETRIEVE_METADATA_FAIL,
  UPDATE_METADATA_SUCCESS,
  UPDATE_METADATA_FAIL,
  DELETE_METADATA_SUCCESS,
  DELETE_METADATA_FAIL,
} from "../actions/types";

const initialState = [];

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_METADATA_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_METADATA_SUCCESS:
      return payload;

    case RETRIEVE_METADATA_FAIL:
      return [...datas];

    case UPDATE_METADATA_SUCCESS:
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

    case DELETE_METADATA_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
