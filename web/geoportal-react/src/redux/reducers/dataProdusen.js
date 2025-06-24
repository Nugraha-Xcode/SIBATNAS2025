import {
  CREATE_DATA_PRODUSEN_SUCCESS,
  CREATE_DATA_PRODUSEN_FAIL,
  RETRIEVE_DATA_PRODUSEN_SUCCESS,
  RETRIEVE_DATA_PRODUSEN_FAIL,
  UPDATE_DATA_PRODUSEN_SUCCESS,
  UPDATE_DATA_PRODUSEN_FAIL,
  DELETE_DATA_PRODUSEN_SUCCESS,
  DELETE_DATA_PRODUSEN_FAIL,
} from "../actions/types";

// Updated initial state untuk mendukung pagination
const initialState = {
  records: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function userReducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_DATA_PRODUSEN_SUCCESS:
      return {
        ...datas,
        records: [...datas.records, payload]
      };

    case RETRIEVE_DATA_PRODUSEN_SUCCESS:
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

    case RETRIEVE_DATA_PRODUSEN_FAIL:
      return initialState;

    case UPDATE_DATA_PRODUSEN_SUCCESS:
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

    case DELETE_DATA_PRODUSEN_SUCCESS:
      return {
        ...datas,
        records: datas.records.filter(({ uuid }) => uuid !== payload.uuid)
      };

    default:
      return datas;
  }
}

export default userReducer;