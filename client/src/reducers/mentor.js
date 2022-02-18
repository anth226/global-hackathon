import { FETCH_MENTOR_LIST } from "../actions/types";

const INITIAL_STATE = {
  participants: [],
  searchTxt: "",
  total: 0,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MENTOR_LIST:
      return {
        ...state,
        participants: action.participants || [],
        total: action.total || 0,
        searchTxt: action.searchTxt || "",
      };
    default:
      return state;
  }
}
