import {
  RETRIEVE_SITE_SETTINGS,
  RETRIEVE_PUBLIC_SITE_SETTINGS,
  UPDATE_SITE_SETTINGS,
  UPLOAD_CHUNK_START,
  UPLOAD_CHUNK_PROGRESS,
  UPLOAD_CHUNK_SUCCESS,
  UPLOAD_CHUNK_FAILURE
} from "./types";

import Service from "src/services/siteSetting.service";
import EventBus from "src/utils/EventBus";

export const retrieveSiteSettings = () => async (dispatch) => {
  try {
    const res = await Service.getSettings();

    dispatch({
      type: RETRIEVE_SITE_SETTINGS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const updateSiteSettings = (uuid, data) => async (dispatch) => {
  try {
    const res = await Service.update(uuid, data);

    dispatch({
      type: UPDATE_SITE_SETTINGS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrievePublicSiteSettings = () => async (dispatch) => {
  try {
    const res = await Service.getPublicSettings();

    dispatch({
      type: RETRIEVE_PUBLIC_SITE_SETTINGS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

// New action for handling chunked file uploads
export const uploadFileChunks = (file, fieldname, uuid) => async (dispatch) => {
  if (!file) return null;
  
  // For small files, no need for chunking
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
  if (file.size <= CHUNK_SIZE) {
    return null; // Will be handled by the regular form submission
  }
  
  dispatch({
    type: UPLOAD_CHUNK_START,
    payload: { fieldname }
  });
  
  try {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    for (let chunkId = 0; chunkId < totalChunks; chunkId++) {
      const start = chunkId * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);
      
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("chunkId", chunkId);
      formData.append("totalChunks", totalChunks);
      formData.append("originalFilename", file.name);
      formData.append("fieldname", fieldname);
      formData.append("uuid", uuid);
      formData.append("isChunkedUpload", "true");
      
      const response = await Service.uploadChunk(formData);
      
      // Update progress
      const progress = ((chunkId + 1) / totalChunks) * 100;
      dispatch({
        type: UPLOAD_CHUNK_PROGRESS,
        payload: { progress, fieldname }
      });
      
      // If this was the last chunk and merge was successful
      if (response.filename && chunkId === totalChunks - 1) {
        dispatch({
          type: UPLOAD_CHUNK_SUCCESS,
          payload: { fieldname, filename: response.filename }
        });
        return response.filename;
      }
    }
    
    return null;
  } catch (error) {
    dispatch({
      type: UPLOAD_CHUNK_FAILURE,
      payload: { 
        fieldname, 
        error: error.response?.data?.message || error.message 
      }
    });
    console.error("Error uploading file chunks:", error);
    return null;
  }
};