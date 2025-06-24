import {
  CREATE_RECORD_SUCCESS,
  CREATE_RECORD_FAIL,
  RETRIEVE_RECORD_SUCCESS,
  RETRIEVE_RECORD_PAGINATED_SUCCESS,
  RETRIEVE_RECORD_FAIL,
  UPDATE_RECORD_SUCCESS,
  UPDATE_RECORD_FAIL,
  DELETE_RECORD_SUCCESS,
  DELETE_RECORD_FAIL,
} from "../actions/types";

const initialState = {
  allRecords: [],
  records: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_RECORD_SUCCESS:
      return [...datas, payload];

    case RETRIEVE_RECORD_PAGINATED_SUCCESS:
      // Check if the payload includes pagination metadata
      if (payload.records && payload.totalItems !== undefined) {
        return {
          ...datas,
          records: payload.records,
          totalItems: payload.totalItems,
          totalPages: payload.totalPages,
          currentPage: payload.currentPage
        };
      }
      // If it's the old format (just an array), maintain compatibility
      return {
        ...datas,
        records: payload,
        totalItems: payload.length,
        totalPages: 1,
        currentPage: 0
      };

    case RETRIEVE_RECORD_FAIL:
      return [...datas];

    case RETRIEVE_RECORD_SUCCESS:
      return {
        ...datas,
        allRecords: payload,
      };

    case UPDATE_RECORD_SUCCESS:
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

    case DELETE_RECORD_SUCCESS:
      return datas.filter(
        ({ identifier }) => identifier !== payload.identifier
      );

    default:
      return datas;
  }
}

export default Reducer;
