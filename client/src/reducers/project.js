import {
  FETCH_PROJECT_LIST,
  FETCH_PROJECT,
  FETCH_PROJECT_PARTICIPANTS,
  FETCH_PROJECT_COMMENTS,
  FETCH_PROJECT_SEARCH_LIST,
  FETCH_PROJECT_DETAIL_LIST,
  FETCH_REVIEW_PROJECT_LIST,
  CREAT_PROJECT_VOTE,
  UPDATE_PROJECT_VOTE,
} from "../actions/types";

const INITIAL_STATE = {
  projects: [],
  total: 0,
  reviewProjects: [],
  reviewTotal: 0,
  projectDetails: [],
  project: {},
  participants: [],
  comments: [],
  searchTxt: "",
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECT_LIST:
      return {
        ...state,
        projects: [...state.projects, ...action.projects],
        total: action.total,
      };
    case FETCH_REVIEW_PROJECT_LIST:
      return {
        ...state,
        reviewProjects: [...state.reviewProjects, ...action.projects],
        reviewTotal: action.total,
      };
    case FETCH_PROJECT:
      return { ...state, project: action.project };
    case FETCH_PROJECT_PARTICIPANTS:
      return { ...state, participants: action.participants };
    case FETCH_PROJECT_COMMENTS:
      return { ...state, comments: action.comments };
    case FETCH_PROJECT_SEARCH_LIST:
      return {
        ...state,
        projects: action.projects,
        reviewProjects: action.projects,
        searchTxt: action.searchTxt,
      };
    case FETCH_PROJECT_DETAIL_LIST:
      return { ...state, projectDetails: action.projectDetails };
    case CREAT_PROJECT_VOTE:
      let rps = state.reviewProjects;
      for (let i = 0; i < rps.length; i++) {
        if (rps[i]._id === action.projectVote.project) {
          if (!rps[i].pvs) rps[i].pvs = []
          rps[i].pvs = [...rps[i].pvs, action.projectVote];
        }
      }
      return {
        ...state,
        reviewProjects: rps,
      };
    case UPDATE_PROJECT_VOTE:
      let urps = state.reviewProjects;
      for (let i = 0; i < urps.length; i++) {
        if (urps[i]._id === action.projectVote.project) {
          for (let j = 0; j < urps[i].pvs.length; j++) {
            if (urps[i].pvs[j]._id === action.projectVote._id) {
              urps[i].pvs[j] = action.projectVote;
            }
          }
        }
      }
      return {
        ...state,
        reviewProjects: urps,
      };
    default:
      return state;
  }
}
