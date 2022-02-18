import {
  FETCH_USER,
  ERROR_RESPONSE,
  FETCH_USER_LIST,
  FETCH_USER_SEARCH_LIST,
  FETCH_JUDGE_LIST,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
} from "../actions/types";

const INITIAL_STATE = {
  profile: {},
  participants: [],
  judges: [],
  message: "",
  searchTxt: "",
  error: "",
  total: 0,
  judgeTotal: 0,
  isAdmin: false,
  isSuper: false,
  isJudge: false,
};

export default function (state = INITIAL_STATE, action) {
  let nProfile;
  switch (action.type) {
    case FETCH_USER:
      const profile = action.payload;
      localStorage.setItem("userId", profile._id);
      let isAdmin = profile.role.includes("Admin");
      let isSuper = profile.role === "SAdmin";
      let isJudge = profile.role === "judge";
      return { ...state, profile, isAdmin, isSuper, isJudge };
    case FETCH_USER_LIST:
      return {
        ...state,
        participants: [...state.participants, ...action.participants],
        total: action.total,
      };
    case FETCH_JUDGE_LIST:
      return {
        ...state,
        judges: [...state.judges, ...action.judges],
        judgeTotal: action.total,
      };
    case FETCH_USER_SEARCH_LIST:
      return {
        ...state,
        participants: action.participants,
        searchTxt: action.searchTxt,
      };
    case CREATE_ORGANIZATION:
      nProfile = state.profile;
      nProfile.profile.org = action.organization;
      nProfile.profile.org_role = "Owner";
      return {
        ...state,
        profile: nProfile,
      };
    case UPDATE_ORGANIZATION:
      nProfile = state.profile;
      nProfile.profile.org = action.organization;
      return {
        ...state,
        profile: nProfile,
      };
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
