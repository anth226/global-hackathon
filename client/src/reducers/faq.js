import {
  FETCH_FAQ_LIST,
  CREATE_FAQ,
  UPDATE_FAQ,
  DELETE_FAQ,
} from "../actions/types";

const INITIAL_STATE = {
  faqs: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FAQ_LIST:
      return { ...state, faqs: action.faqs || [] };
    case CREATE_FAQ:
      return { ...state, faqs: [...state.faqs, action.faq] };
    case DELETE_FAQ:
      let fqs = state.faqs;
      for (let i = fqs.length - 1; i >= 0; i--) {
        if (fqs[i]._id === action.id) fqs.splice(i, 1);
      }
      return { ...state, faqs: fqs };
    case UPDATE_FAQ:
      let ufqs = state.faqs;
      for (let i = 0; i < ufqs.length; i++) {
        if (ufqs[i]._id === action.faq._id) ufqs[i] = action.faq;
      }
      return {
        ...state,
        faqs: ufqs,
      };
    default:
      return state;
  }
}
