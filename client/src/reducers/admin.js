import {
  FETCH_ADMIN_PARTICIPANTS,
  FETCH_PROJECT_CREATORS,
  FETCH_REPORTS,
  UPDATE_ROLE,
  FETCH_ADMIN_PARTICIPANT,
} from "../actions/types";

const INITIAL_STATE = {
  participants: [],
  creators: [],
  reports: [],
  participant: {},
  organization: {},
  challenge: {},
  project: {},
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADMIN_PARTICIPANTS:
      return {
        ...state,
        participants: action.participants,
      };
    case FETCH_PROJECT_CREATORS:
      return {
        ...state,
        creators: action.creators,
      };
    case FETCH_REPORTS:
      return {
        ...state,
        reports: action.reports,
      };
    case UPDATE_ROLE:
      let pts = state.participants;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i]._id === action.user._id) pts[i].role = action.user.role;
      }
      return {
        ...state,
        participants: pts,
      };
    case FETCH_ADMIN_PARTICIPANT:
      return {
        ...state,
        participant: action.user,
      };
    default:
      return state;
  }
}
