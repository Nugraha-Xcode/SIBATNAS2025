import {
  RETRIEVE_SITE_SETTINGS,
  RETRIEVE_PUBLIC_SITE_SETTINGS,
  UPDATE_SITE_SETTINGS,
  UPLOAD_CHUNK_START,
  UPLOAD_CHUNK_PROGRESS,
  UPLOAD_CHUNK_SUCCESS,
  UPLOAD_CHUNK_FAILURE
} from "../actions/types";

const initialState = {
  // Site settings data
  uploadStatus: {
    isUploading: false,
    progress: 0,
    error: null,
    currentField: null
  }
};

function siteSettingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_SITE_SETTINGS:
      return {
        ...state,
        ...payload,
        uploadStatus: state.uploadStatus
      };

    case UPDATE_SITE_SETTINGS:
      return {
        ...state,
        ...payload,
        uploadStatus: state.uploadStatus
      };
      
    case RETRIEVE_PUBLIC_SITE_SETTINGS:
      return {
        ...state,
        ...payload,
        uploadStatus: state.uploadStatus
      };
    
    // New cases for handling chunked uploads
    case UPLOAD_CHUNK_START:
      return {
        ...state,
        uploadStatus: {
          isUploading: true,
          progress: 0,
          error: null,
          currentField: payload.fieldname
        }
      };
    
    case UPLOAD_CHUNK_PROGRESS:
      return {
        ...state,
        uploadStatus: {
          ...state.uploadStatus,
          progress: payload.progress
        }
      };
    
    case UPLOAD_CHUNK_SUCCESS:
      return {
        ...state,
        uploadStatus: {
          isUploading: false,
          progress: 100,
          error: null,
          currentField: null
        }
      };
    
    case UPLOAD_CHUNK_FAILURE:
      return {
        ...state,
        uploadStatus: {
          isUploading: false,
          progress: 0,
          error: payload.error,
          currentField: payload.fieldname
        }
      };

    default:
      return state;
  }
}

export default siteSettingReducer;