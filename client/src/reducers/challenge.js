import {
  CREATE_CHALLENGE,
  UPDATE_CHALLENGE,
  FETCH_CHALLENGELIST,
  DELETE_CHALLENGE,
  SET_CURRENT_CHALLENGE,
  CHALLENGE_ERROR,
  FETCH_ALL_CHALLENGELIST,
  FETCH_CHALLENGE_SEARCH_LIST,
  FETCH_ADMIN_CHL_LIST,
  FETCH_CHALLENGE_COMMENTS,
} from "../actions/types";

const INITIAL_STATE = {
  challenges: [],
  allChallenges: [],
  adminChallenges: [],
  currentChallenge: {},
  searchTxt: "",
  total: 0,
  comments: [],
};

export default function (state = INITIAL_STATE, action) {
  let challenge;
  switch (action.type) {
    case CREATE_CHALLENGE:
      return {
        ...state,
        challenges: [...state.challenges, action.challenge],
        allChallenges:
          state.allChallenges.length > 0
            ? [...state.allChallenges, action.challenge]
            : [],
        currentChallenge: action.challenge,
      };
    case UPDATE_CHALLENGE:
      challenge = action.challenge;
      let chls = state.challenges;
      for (let i = 0; i < chls.length; i++) {
        if (chls[i]._id === challenge._id) {
          chls[i] = challenge;
        }
      }
      return {
        ...state,
        challenges: chls,
        currentChallenge: challenge,
      };
    case FETCH_CHALLENGELIST:
      return { ...state, challenges: action.challenges || [] };
    case FETCH_ALL_CHALLENGELIST:
      return {
        ...state,
        allChallenges: [...state.allChallenges, ...action.challenges],
        total: action.total,
      };
    case DELETE_CHALLENGE:
      challenge = action.challenge;
      for (let i = state.challenges.length - 1; i >= 0; i--) {
        if (state.challenges[i]._id === challenge._id) {
          state.challenges.splice(i, 1);
        }
      }
      return { ...state, challenges: state.challenges };
    case SET_CURRENT_CHALLENGE:
      return { ...state, currentChallenge: action.challenge };
    case CHALLENGE_ERROR:
      return { ...state, error: action.payload };
    case FETCH_CHALLENGE_SEARCH_LIST:
      return {
        ...state,
        allChallenges: action.challenges,
        searchTxt: action.searchTxt,
      };
    case FETCH_CHALLENGE_COMMENTS:
      return { ...state, comments: action.comments };
    case FETCH_ADMIN_CHL_LIST:
      return {
        ...state,
        adminChallenges: action.challenges,
      };
    default:
      return state;
  }
}
