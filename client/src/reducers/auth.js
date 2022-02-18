import {
  AUTH_USER,
  UNAUTH_USER,
  PROTECTED_TEST,
  SET_KEY_DATA,
  SET_SHOW_INSTRUCT
} from "../actions/types";

const INITIAL_STATE = {
  authenticated: false,
  keyData: {},
  pdfResult: "",
  passPhrase: "",
  show_instruct: false,
  instruct: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: true };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    case PROTECTED_TEST:
      return { ...state };
    case SET_KEY_DATA:
      return {
        ...state,
        pdfResult: action.pdfResult,
        passPhrase: action.passPhrase,
      };
    case SET_SHOW_INSTRUCT:
      return {
        ...state,
        show_instruct: action.value,
        instruct: action.instruct
      };
    default:
      return state;
  }
}
