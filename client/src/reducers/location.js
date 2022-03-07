import {
  FETCH_LOCATION_LIST,
  FETCH_PENDING_LOCATIONS,
  SET_INVITE_LOCATION,
  FETCH_HOSTED_USERS,
  ADD_SPONSOR_TO_LOCATION,
  REMOVE_SPONSOR_FROM_LOCATION,
} from "../actions/types";

const INITIAL_STATE = {
  locations: [],
  pendingLocations: [],
  inv_locaton: null,
  hosted_users: [],
  status: "",
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
    case ADD_SPONSOR_TO_LOCATION:
      return {
        ...state,
        status: "success",
        message: "Sponsor added to location",
      };
    case REMOVE_SPONSOR_FROM_LOCATION:
      return {
        ...state,
        status: "success",
        message: "Sponsor removed from location",
      };

    default:
      return state;
  }
}
