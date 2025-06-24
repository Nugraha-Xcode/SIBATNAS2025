import {
  CREATE_DATA_PEMERIKSAAN_SUCCESS,
  CREATE_DATA_PEMERIKSAAN_FAIL,
  RETRIEVE_DATA_PEMERIKSAAN_SUCCESS,
  RETRIEVE_DATA_PEMERIKSAAN_FAIL,
  UPDATE_DATA_PEMERIKSAAN_SUCCESS,
  UPDATE_DATA_PEMERIKSAAN_FAIL,
  DELETE_DATA_PEMERIKSAAN_SUCCESS,
  DELETE_DATA_PEMERIKSAAN_FAIL,
} from "../actions/types";

// Updated initial state to support pagination
const initialState = {
  records: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_PEMERIKSAAN_SUCCESS:
      return {
        ...datas,
        records: [...datas.records, payload]
      };

    case RETRIEVE_DATA_PEMERIKSAAN_SUCCESS:
      return {
        records: payload.records || payload,
        totalItems: payload.totalItems || 0,
        totalPages: payload.totalPages || 0,
        currentPage: payload.currentPage || 0
      };

    case RETRIEVE_DATA_PEMERIKSAAN_FAIL:
      return initialState;

    case UPDATE_DATA_PEMERIKSAAN_SUCCESS:
      return {
        ...datas,
        records: datas.records.map((data) => {
          if (data.uuid === payload.uuid) {
            return {
              ...data,
              ...payload,
            };
          } else {
            return data;
          }
        })
      };

    case DELETE_DATA_PEMERIKSAAN_SUCCESS:
      return {
        ...datas,
        records: datas.records.filter(({ uuid }) => uuid !== payload.uuid)
      };

    default:
      return datas;
  }
}

export default userReducer;