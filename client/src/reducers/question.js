import { FETCH_QUESTIONS, FETCH_SECURITY_QUESTION } from "../actions/types";

const INITIAL_STATE = {
  questions: [],
  securityquestion: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_QUESTIONS:
      return {
        ...state,
        questions: action.questions || [],
      };
    case FETCH_SECURITY_QUESTION:
      return {
        ...state,
        securityquestion: action.securityquestion || {},
      };
    default:
      return state;
  }
}
