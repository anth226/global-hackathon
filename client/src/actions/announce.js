import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_ANNOUNCE_LIST,
  GET_RECENT_ANNOUNCE,
  CREATE_ANNOUNCE,
  UPDATE_ANNOUNCE,
  HIDE_ANNOUNCE
} from "./types";
import Client from "./api";
import { message } from "antd";

//= ===============================
// Announce actions
//= ===============================
export function createAnnounce(announce) {
  return async (dispatch, getState) => {
    try {
      if (!checkActiveAnnounce(announce, getState().announce.announces)) {
        createNotification(
          "Create Announcement",
          "There are already active announcements, please deactivate them first"
        );
        return
      }
      const client = Client(true);
      let res = await client.post(`${API_URL}/announce`, announce);
      dispatch({ type: CREATE_ANNOUNCE, announce: res.data.announce });
      message.success("New announcement created successfully!");
    } catch (err) {
      createNotification("Create Announcement", errorMessage(err));
    }
  };
}

export function updateAnnounce(announce) {
  return async (dispatch, getState) => {
    try {
      if (!checkActiveAnnounce(announce, getState().announce.announces)) {
        createNotification(
          "Create Announcement",
          "There are already active announcements, please deactivate them first"
        );
        return
      }
      const client = Client(true);
      let res = await client.put(`${API_URL}/announce`, announce);
      dispatch({ type: UPDATE_ANNOUNCE, announce: res.data.announce });
      message.success("Announcement updated successfully!");
    } catch (err) {
      createNotification("Update Announcement", errorMessage(err));
    }
  };
}

function checkActiveAnnounce(announce, announces) {
  if (!announce.active) return true;
  for (let i = 0; i < announces.length; i++) {
    if (!announces[i].active) continue;
    if (!announce._id) return false;
    if (announce._id && announces[i]._id !== announce._id) return false;
  }
  return true;
}

export function listAnnounces() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/announce/list/all`);
      dispatch({
        type: FETCH_ANNOUNCE_LIST,
        announces: res.data.announces,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function getAnnounce(id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.get(`${API_URL}/announce/${id}`);
      return res.data.announce;
    } catch (err) {
      console.log(err);
    }
  };
}

export function getRecentAnnounce() {
  return async (dispatch) => {
    try {
      const client = Client();
      let res = await client.get(`${API_URL}/announce/recent/one`);
      dispatch({ type: GET_RECENT_ANNOUNCE, announce: res.data.announce });
    } catch (err) {
      console.log(err);
    }
  };
}

export function hideAnnounce() {
  return (dispatch) => {
    dispatch({ type: HIDE_ANNOUNCE });
  }
}