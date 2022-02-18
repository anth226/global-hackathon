import { API_URL, createNotification, errorMessage } from "./index";
import {
  CREATE_CHALLENGE,
  UPDATE_CHALLENGE,
  FETCH_CHALLENGELIST,
  DELETE_CHALLENGE,
  SET_CURRENT_CHALLENGE,
  FETCH_ALL_CHALLENGELIST,
  FETCH_CHALLENGE_SEARCH_LIST,
  FETCH_ADMIN_CHL_LIST,
} from "./types";
import Client from "./api";

//= ===============================
// Challenge actions
//= ===============================

export function createChallenge(chlData) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/challenge`, chlData);
      dispatch({ type: CREATE_CHALLENGE, challenge: res.data.challenge });
    } catch (err) {
      createNotification("Create Challenge", errorMessage(err));
    }
  };
}

export function updateChallenge(chlData) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/challenge`, chlData);
      dispatch({ type: UPDATE_CHALLENGE, challenge: res.data.challenge });
    } catch (err) {
      createNotification("Update Challenge", errorMessage(err));
    }
  };
}

export function supportChallenge(id, support) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/challenge/support/${id}`, {
        support,
      });
      dispatch({ type: UPDATE_CHALLENGE, challenge: res.data.challenge });
    } catch (err) {
      createNotification("Support Challenge", errorMessage(err));
    }
  };
}

export function getSupportedChallenges(orgId) {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/challenge/support/${orgId}`);
      return res.data.challenges;
    } catch (err) {
      console.log(err);
    }
  };
}

export function upvoteChallenge(id, vote) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/challenge/upvote/${id}`, {
        vote,
      });
      dispatch({ type: UPDATE_CHALLENGE, challenge: res.data.challenge });
    } catch (err) {
      createNotification("Upvote Challenge", errorMessage(err));
    }
  };
}

export function getChallenge(chl_id) {
  return async (dispatch) => {
    const client = Client();
    try {
      let res = await client.get(`${API_URL}/challenge/${chl_id}`);
      return res.data.challenge;
    } catch (err) {
      console.log(err);
    }
  };
}

export function listChallenge(org_id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/challenge/org/${org_id}`);
      dispatch({
        type: FETCH_CHALLENGELIST,
        challenges: res.data.challenges,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listChallengeByUser(user_id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/challenge/user/${user_id}`);
      dispatch({
        type: FETCH_CHALLENGELIST,
        challenges: res.data.challenges,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listAllChallenge(count, filters) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(
        `${API_URL}/challenge/list/${count}`,
        filters
      );
      dispatch({
        type: FETCH_ALL_CHALLENGELIST,
        challenges: res.data.challenges,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteChallenge(chl_id) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.delete(`${API_URL}/challenge/${chl_id}`);
      dispatch({ type: DELETE_CHALLENGE, challenge: res.data.challenge });
    } catch (err) {
      console.log(err);
    }
  };
}

export function setCurrentChallenge(chl) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_CHALLENGE, challenge: chl });
  };
}

export function searchChallenges(text) {
  return async (dispatch) => {
    if (text && text.length < 3) {
      createNotification(
        "Search Challenge",
        "Search text should be at least 3 in length"
      );
      return;
    }
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/search/challenge/${text}`);
      dispatch({
        type: FETCH_CHALLENGE_SEARCH_LIST,
        challenges: res.data.challenges,
        searchTxt: text,
      });
    } catch (err) {
      createNotification("Search Challenge", errorMessage(err));
    }
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({
      type: FETCH_CHALLENGE_SEARCH_LIST,
      challenges: [],
    });
  };
}

// admin
export function adminListChallenge() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/challenge/admin/list`);
      dispatch({
        type: FETCH_ADMIN_CHL_LIST,
        challenges: res.data.challenges,
      });
    } catch (err) {
      createNotification("List Challenge", errorMessage(err));
    }
  };
}

export function adminPendingChallenge() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/challenge/admin/pending`);
      dispatch({
        type: FETCH_ADMIN_CHL_LIST,
        challenges: res.data.challenges,
      });
    } catch (err) {
      createNotification("List Challenge", errorMessage(err));
    }
  };
}

export function adminApproveChallenge(challenge_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/challenge/admin/approve/${challenge_id}`);
      return res.data.challenge
    } catch (err) {
      createNotification("Approve Challenge", errorMessage(err));
    }
  };
}
