import {
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  RETRIEVE_USER_SUCCESS,
  RETRIEVE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(users = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_USER_SUCCESS:
      return [...users, payload];

    case RETRIEVE_USER_SUCCESS:
      return payload;

    case RETRIEVE_USER_FAIL:
      return [...users];

    case UPDATE_USER_SUCCESS:
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

    case DELETE_USER_SUCCESS:
      return users.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return users;
  }
}

export default userReducer;
