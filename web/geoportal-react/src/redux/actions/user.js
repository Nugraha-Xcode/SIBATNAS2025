import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  RETRIEVE_USER_SUCCESS,
  RESET_USER_SUCCESS,
  RETRIEVE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  SET_MESSAGE,
} from "./types";

import UserService from "src/services/user.service";
import EventBus from "src/utils/EventBus";

export const retrieveUser = () => async (dispatch) => {
  try {
    const res = await UserService.getAll();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserEksternal = () => async (dispatch) => {
  try {
    //const res = await UserService.getAllRole(uuid);
    const res = await UserService.getAllEksternal();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserBpkhtl = () => async (dispatch) => {
  try {
    //const res = await UserService.getAllRole(uuid);
    const res = await UserService.getAllBpkhtl();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserInternal = () => async (dispatch) => {
  try {
    //const res = await UserService.getAllRole(uuid);
    const res = await UserService.getAllInternal();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserProdusen = () => async (dispatch) => {
  try {
    //const res = await UserService.getAllRole(uuid);
    const res = await UserService.getAllProdusen();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserWalidata = () => async (dispatch) => {
  try {
    //const res = await UserService.getAllRole(uuid);
    const res = await UserService.getAllWalidata();

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const retrieveUserRole = (id) => async (dispatch) => {
  try {
    const res = await UserService.getAllRole(id);

    dispatch({
      type: RETRIEVE_USER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};

export const create =
  (username, email, password, roles) => async (dispatch) => {
    try {
      const res = await UserService.create({
        username,
        email,
        password,
        roles,
      });

      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: res.data,
      });

      return Promise.resolve(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        EventBus.dispatch("logout");
      }
      return Promise.reject(err);
    }
  };

export const updateUser = (uuid, data) => async (dispatch) => {
  try {
    const res = await UserService.update(uuid, data);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const updateProfile = (uuid, data) => async (dispatch) => {
  try {
    const res = await UserService.updateProfile(uuid, data);

    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};

export const resetPassword = (uuid) => async (dispatch) => {
  try {
    const res = await UserService.resetPassword(uuid);

    dispatch({
      type: RESET_USER_SUCCESS,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    return Promise.reject(err);
  }
};
export const deleteUser = (uuid) => async (dispatch) => {
  try {
    await UserService.remove(uuid);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: { uuid },
    });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      EventBus.dispatch("logout");
    }
    console.log(err);
  }
};
/*
export const create = (name) => (dispatch) => {
  return KategoriService.create({ name }).then(
    (response) => {
      dispatch({
        type: CREATE_KATEGORI_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CREATE_KATEGORI_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
*/
