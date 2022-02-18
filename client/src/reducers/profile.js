import {
  FETCH_FIELD_DATA,
  CREATE_FIELD_DATA,
  DELETE_FIELD_DATA,
  ADMIN_SET_MENTOR,
  ADMIN_SET_SUMMARY,
  ADMIN_UPDATE_FIELD,
} from "../actions/types";

const INITIAL_STATE = {
  fieldData: [],
  mentor: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FIELD_DATA:
      let mentor = false;
      for (let f of action.fieldData) {
        if (f.field === "mentor") {
          mentor = f.value === "true";
        }
      }
      return { ...state, fieldData: action.fieldData, mentor };
    case CREATE_FIELD_DATA:
      return { ...state, fieldData: [...state.fieldData, action.fieldData] };
    case DELETE_FIELD_DATA:
      let fds = state.fieldData;
      for (let i = fds.length - 1; i >= 0; i--) {
        if (fds[i]._id === action.id) fds.splice(i, 1);
      }
      return { ...state, fieldData: fds };
    case ADMIN_SET_MENTOR:
      let afds = state.fieldData;
      for (let i = 0; i < afds.length; i++) {
        if (afds[i]._id === action.mentor._id) afds[i] = action.mentor;
      }
      return {
        ...state,
        fieldData: afds,
        mentor: action.mentor.value === "true",
      };
    case ADMIN_SET_SUMMARY:
      let sfds = state.fieldData;
      for (let i = 0; i < sfds.length; i++) {
        if (sfds[i].field === "summary") sfds[i] = action.summary;
      }
      return {
        ...state,
        fieldData: sfds,
      };
    case ADMIN_UPDATE_FIELD:
      let cfds = state.fieldData;
      for (let i = 0; i < cfds.length; i++) {
        if (cfds[i].field === action.field.field) cfds[i] = action.field;
      }
      return {
        ...state,
        fieldData: cfds,
      };
    default:
      return state;
  }
}
