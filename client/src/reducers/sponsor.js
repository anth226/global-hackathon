import {
  FETCH_SPONSORS_LIST,
  FETCH_SPONSORS_LIST_FAILED,
  CLEAR_FETCH_SPONSORS_LIST,
  UPDATE_SPONSORS,
  UPDATE_SPONSORS_FAILED,
  CLEAR_UPDATE_SPONSORS,
  FETCH_SPONSOR,
  FETCH_SPONSOR_FAILED,
  CLEAR,
  CLEAR_FETCH_SPONSOR,
  ADD_SPONSOR,
  ADD_SPONSOR_FAILED,
} from "../actions/types";

const INITIAL_STATE = {
  status: "",
  sponsors: [],
  message: "",
  sponsor: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SPONSORS_LIST:
      return { ...state, status: "success", sponsors: action.sponsors };
    case FETCH_SPONSORS_LIST_FAILED:
      return { ...state, status: "error", error: action.error };
    case CLEAR_FETCH_SPONSORS_LIST:
      return { ...INITIAL_STATE, status: "clear" };
    case UPDATE_SPONSORS:
      return { ...state, status: "success", message: action.message };
    case UPDATE_SPONSORS_FAILED:
      return { ...state, status: "error", error: action.error };
    case CLEAR_UPDATE_SPONSORS:
      return { ...INITIAL_STATE, status: "clear" };
    case FETCH_SPONSOR:
      return { ...state, status: "success", sponsor: action.sponsor };
    case FETCH_SPONSOR_FAILED:
      return { ...state, status: "error", error: action.error };
    case CLEAR_FETCH_SPONSOR:
      return { ...INITIAL_STATE, status: "clear" };
    case ADD_SPONSOR:
      return { ...state, status: "success" };
    case ADD_SPONSOR_FAILED:
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
}
