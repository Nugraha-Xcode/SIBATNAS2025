import {
  CREATE_SETTING_SUCCESS,
  CREATE_SETTING_FAIL,
  RETRIEVE_SETTING_SUCCESS,
  RETRIEVE_SETTING_FAIL,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAIL,
  DELETE_SETTING_SUCCESS,
  DELETE_SETTING_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(users = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_SETTING_SUCCESS:
      return [...users, payload];

    case RETRIEVE_SETTING_SUCCESS:
      return payload;

    case RETRIEVE_SETTING_FAIL:
      return [...users];

    case UPDATE_SETTING_SUCCESS:
      return users.map((user) => {
        if (user.uuid === payload.uuid) {
          return {
            ...users,
            ...payload,
          };
        } else {
          return user;
        }
      });

    case DELETE_SETTING_SUCCESS:
      return users.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return users;
  }
}

export default userReducer;
