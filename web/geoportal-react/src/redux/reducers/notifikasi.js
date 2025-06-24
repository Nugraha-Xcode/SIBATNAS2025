import {
  CREATE_NOTIFIKASI_SUCCESS,
  CREATE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_SUCCESS,
  RETRIEVE_NOTIFIKASI_FAIL,
  RETRIEVE_NOTIFIKASI_UNREAD,
  UPDATE_NOTIFIKASI_SUCCESS,
  UPDATE_NOTIFIKASI_FAIL,
  DELETE_NOTIFIKASI_SUCCESS,
  DELETE_NOTIFIKASI_FAIL,
  UPDATE_NOTIFIKASI_READ_STATUS,
} from "../actions/types";

const initialState = {
  records: [],
  unreadRecords: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

function Reducer(datas = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_NOTIFIKASI_SUCCESS:
      return {
        ...datas,
        records: [...datas.records, payload]
      };

    case RETRIEVE_NOTIFIKASI_SUCCESS:
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

    case RETRIEVE_NOTIFIKASI_FAIL:
      return [...datas];

    case RETRIEVE_NOTIFIKASI_UNREAD:
      return {
        ...datas,
        unreadRecords: payload,
      };

      case UPDATE_NOTIFIKASI_READ_STATUS:
        return {
          ...datas,
          records: datas.records.map((data) => 
            data.uuid === payload.uuid
              ? { ...data, sudahBaca: true, waktuBaca: payload.waktuBaca }
              : data
          ),
          unreadRecords: datas.unreadRecords.map((data) => 
            data.uuid === payload.uuid
              ? { ...data, sudahBaca: true, waktuBaca: payload.waktuBaca }
              : data
          )
        };
      

    case DELETE_NOTIFIKASI_SUCCESS:
      return datas.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return datas;
  }
}

export default Reducer;
