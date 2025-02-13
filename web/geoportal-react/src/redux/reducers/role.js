import { RETRIEVE_ROLE_SUCCESS, RETRIEVE_ROLE_FAIL } from "../actions/types";

const initialState = [];

function roleReducer(roles = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_ROLE_SUCCESS:
      return payload;

    case RETRIEVE_ROLE_FAIL:
      return [...roles];

    default:
      return roles;
  }
}

export default roleReducer;
