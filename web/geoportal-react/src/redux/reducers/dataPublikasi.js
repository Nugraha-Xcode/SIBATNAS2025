import {
  CREATE_DATA_PUBLIKASI_SUCCESS,
  CREATE_DATA_PUBLIKASI_FAIL,
  RETRIEVE_DATA_PUBLIKASI_SUCCESS,
  RETRIEVE_DATA_PUBLIKASI_FAIL,
  RETRIEVE_DATA_PUBLIKASI_UNDUH_SUCCESS,
  UPDATE_DATA_PUBLIKASI_SUCCESS,
  UPDATE_DATA_PUBLIKASI_FAIL,
  UNPUBLISH_DATA_PUBLIKASI_SUCCESS,
  UNPUBLISH_DATA_PUBLIKASI_FAIL,
  DELETE_DATA_PUBLIKASI_SUCCESS,
  DELETE_DATA_PUBLIKASI_FAIL,
} from "../actions/types";

// Updated initial state untuk mendukung pagination
const initialState = {
  allRecords: [],
  records: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_PUBLIKASI_SUCCESS:
      return {
        ...datas,
        records: [...datas.records, payload]
      };

    case RETRIEVE_DATA_PUBLIKASI_SUCCESS:
      // Handle array atau objek pagination
      if (Array.isArray(payload)) {
        return {
          records: payload,
          totalItems: payload.length,
          totalPages: 1,
          currentPage: 0
        };
      } else {
        return {
          records: payload.records || [],
          totalItems: payload.totalItems || 0,
          totalPages: payload.totalPages || 0,
          currentPage: payload.currentPage || 0
        };
      }

    case RETRIEVE_DATA_PUBLIKASI_FAIL:
      return initialState;

    case RETRIEVE_DATA_PUBLIKASI_UNDUH_SUCCESS:
      return {
        ...datas,
        allRecords: payload,
      };

    case UPDATE_DATA_PUBLIKASI_SUCCESS:
    case UNPUBLISH_DATA_PUBLIKASI_SUCCESS:
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

    case DELETE_DATA_PUBLIKASI_SUCCESS:
      return {
        ...datas,
        records: datas.records.filter(({ uuid }) => uuid !== payload.uuid)
      };

    default:
      return datas;
  }
}

export default userReducer;