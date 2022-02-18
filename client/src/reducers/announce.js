import {
  FETCH_ANNOUNCE_LIST,
  GET_RECENT_ANNOUNCE,
  CREATE_ANNOUNCE,
  UPDATE_ANNOUNCE,
  HIDE_ANNOUNCE
} from "../actions/types";

const INITIAL_STATE = {
  announces: [],
  announce: {},
  show: true
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ANNOUNCE_LIST:
      return { ...state, announces: action.announces };
    case GET_RECENT_ANNOUNCE:
      return { ...state, announce: action.announce || {} };
    case CREATE_ANNOUNCE:
      return {
        ...state,
        announces: [...state.announces, action.announce],
      };
    case UPDATE_ANNOUNCE:
      let acs = state.announces;
      for (let i = 0; i < acs.length; i++) {
        if (acs[i]._id === action.announce._id) {
          acs[i] = action.announce;
        }
      }
      return {
        ...state,
        announces: acs,
      };
    case HIDE_ANNOUNCE:
      return { ...state, show: false };
    default:
      return state;
  }
}
