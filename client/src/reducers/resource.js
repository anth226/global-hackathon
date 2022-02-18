import {
  FETCH_RESOURCE_LIST,
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE,
} from "../actions/types";

const INITIAL_STATE = {
  resources: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_RESOURCE_LIST:
      return { ...state, resources: action.resources || [] };
    case CREATE_RESOURCE:
      return { ...state, resources: [...state.resources, action.resource] };
    case DELETE_RESOURCE:
      let fds = state.resources;
      for (let i = fds.length - 1; i >= 0; i--) {
        if (fds[i]._id === action.id) fds.splice(i, 1);
      }
      return { ...state, resources: fds };
    case UPDATE_RESOURCE:
      let cfds = state.resources;
      for (let i = 0; i < cfds.length; i++) {
        if (cfds[i]._id === action.resource._id) cfds[i] = action.resource;
      }
      return {
        ...state,
        resources: cfds,
      };
    default:
      return state;
  }
}
