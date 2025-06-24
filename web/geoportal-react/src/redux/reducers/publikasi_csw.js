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

const initialState = {
  records: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PUBLIKASI_CSW_SUCCESS:
      return {
        ...datas,
        records: [...datas.records, payload]
      };

      case RETRIEVE_PUBLIKASI_CSW_SUCCESS:
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

    case RETRIEVE_PUBLIKASI_CSW_FAIL:
      return [...datas];

      case UPDATE_PUBLIKASI_CSW_SUCCESS:
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
  
      case DELETE_PUBLIKASI_CSW_SUCCESS:
        return {
          ...datas,
          records: datas.records.filter(({ uuid }) => uuid !== payload.uuid)
        };

    default:
      return datas;
  }
}

export default Reducer;
