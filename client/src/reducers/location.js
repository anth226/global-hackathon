import {
  FETCH_LOCATION_LIST,
  FETCH_PENDING_LOCATIONS,
  SET_INVITE_LOCATION,
  FETCH_HOSTED_USERS
} from "../actions/types";

const INITIAL_STATE = {
  locations: [],
  pendingLocations: [],
  inv_locaton: null,
  hosted_users: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LOCATION_LIST:
      return { ...state, locations: action.locations || [] };
    case FETCH_PENDING_LOCATIONS:
      return { ...state, pendingLocations: action.locations || [] };
    case SET_INVITE_LOCATION:
      return { ...state, inv_locaton: action.location };
    case FETCH_HOSTED_USERS:
      return { ...state, hosted_users: action.users };
    default:
      return state;
  }
}
