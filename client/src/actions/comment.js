import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { FETCH_PROJECT_COMMENTS, FETCH_CHALLENGE_COMMENTS } from "./types";

//= ===============================
// Comment actions
//= ===============================
export function createComment(projectId, content, parent) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/comment`, {
        projectId,
        content,
        parent,
      });
      return res.data.comment;
    } catch (err) {
      createNotification("Add Comment", errorMessage(err));
    }
  };
}

export function createChallengeComment(challengeId, content, parent) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/comment/challenge`, {
        challengeId,
        content,
        parent,
      });
      return res.data.comment;
    } catch (err) {
      createNotification("Add Comment", errorMessage(err));
    }
  };
}

export function updateComment(_id, content) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.put(`${API_URL}/comment`, { _id, content });
      return res.data.comment;
    } catch (err) {
      createNotification("Update Comment", errorMessage(err));
    }
  };
}

export function listComment(projectId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/comment/${projectId}`);
      dispatch({ type: FETCH_PROJECT_COMMENTS, comments: res.data.comments });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listChallengeComment(challengeId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/comment/challenge/${challengeId}`);
      dispatch({ type: FETCH_CHALLENGE_COMMENTS, comments: res.data.comments });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteComment(commentId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.delete(`${API_URL}/comment/${commentId}`);
      return res.data.comment;
    } catch (err) {
      createNotification("Delete Comment", errorMessage(err));
    }
  };
}

export function likeComment(commentId, like) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/comment/like/${commentId}`, {
        like,
      });
      return res.data.comment;
    } catch (err) {
      createNotification("Like Comment", errorMessage(err));
    }
  };
}
