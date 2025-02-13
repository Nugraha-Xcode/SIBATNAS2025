import {
  CREATE_TEMATIK_SUCCESS,
  CREATE_TEMATIK_FAIL,
  RETRIEVE_TEMATIK_SUCCESS,
  RETRIEVE_TEMATIK_FAIL,
  UPDATE_TEMATIK_SUCCESS,
  UPDATE_TEMATIK_FAIL,
  DELETE_TEMATIK_SUCCESS,
  DELETE_TEMATIK_FAIL,
} from "../actions/types";

const initialState = [];

function userReducer(users = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_TEMATIK_SUCCESS:
      return [...users, payload];

    case RETRIEVE_TEMATIK_SUCCESS:
      return payload;

    case RETRIEVE_TEMATIK_FAIL:
      return [...users];

    case UPDATE_TEMATIK_SUCCESS:
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

    case DELETE_TEMATIK_SUCCESS:
      return users.filter(({ uuid }) => uuid !== payload.uuid);

    default:
      return users;
  }
}

export default userReducer;
