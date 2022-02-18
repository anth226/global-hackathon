import {
  FETCH_HELPDOC_LIST,
  CREATE_HELPDOC,
  UPDATE_HELPDOC,
  DELETE_HELPDOC,
} from "../actions/types";

const INITIAL_STATE = {
  helpdocs: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_HELPDOC_LIST:
      return { ...state, helpdocs: action.helpdocs };
    case CREATE_HELPDOC:
      return { ...state, helpdocs: [...state.helpdocs, action.helpdoc] };
    case DELETE_HELPDOC:
      let hds = state.helpdocs;
      for (let i = hds.length - 1; i >= 0; i--) {
        if (hds[i]._id === action.id) hds.splice(i, 1);
      }
      return { ...state, helpdocs: hds };
    case UPDATE_HELPDOC:
      let ahds = state.helpdocs;
      for (let i = 0; i < ahds.length; i++) {
        if (ahds[i]._id === action.helpdoc._id) ahds[i] = action.helpdoc;
      }
      return {
        ...state,
        helpdocs: ahds,
      };
    default:
      return state;
  }
}
