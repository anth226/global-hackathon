import Client from "./api";
import {
  CLEAR_FETCH_SPONSORS_LIST,
  FETCH_SPONSORS_LIST,
  UPDATE_SPONSORS,
  FETCH_SPONSOR,
  ADD_SPONSOR,
} from "./types";
import { API_URL, createNotification, errorMessage } from ".";
import { message } from "antd";

const client = Client(true);

export function listSponsors() {
  return async (dispatch) => {
    dispatch({ type: CLEAR_FETCH_SPONSORS_LIST });
    try {
      let res = await client.get(`${API_URL}/sponsors/all`);
      dispatch({
        type: FETCH_SPONSORS_LIST,
        sponsors: res.data,
      });
    } catch (err) {
      createNotification("Fetch sponsors", errorMessage(err));
    }
  };
}

export function updateSponsors(id, payload) {
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/sponsors/update/${id}`, payload);
      dispatch({
        type: UPDATE_SPONSORS,
        sponsor: res.data,
      });
      message.success("Sponsor updated successfully");
    } catch (err) {
      createNotification("Updated sponsor", errorMessage(err));
    }
  };
}

export function getSponsor(id) {
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/sponsors/${id}`);
      dispatch({
        type: FETCH_SPONSOR,
        sponsor: res.data,
      });
    } catch (err) {
      createNotification("Sponsor fetched successfully", errorMessage(err));
    }
  };
}

export function addSponsor(payload) {
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/sponsors/new`, payload);
      dispatch({
        type: ADD_SPONSOR,
        sponsor: res.data,
      });
      message.success("Sponsor has been created successfully");
    } catch (err) {
      createNotification("Create Sponsor", errorMessage(err));
    }
  };
}
