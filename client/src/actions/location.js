import { message } from "antd";
import Client from "./api";
import { API_URL, createNotification, errorMessage } from "./index";
import {
  FETCH_HOSTED_USERS,
  FETCH_LOCATION_LIST,
  FETCH_PENDING_LOCATIONS,
  SET_INVITE_LOCATION,
  ADD_SPONSOR_TO_LOCATION,
  REMOVE_SPONSOR_FROM_LOCATION,
} from "./types";

export function listLocation() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/location`);
      dispatch({
        type: FETCH_LOCATION_LIST,
        locations: res.data.locations,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listPendingLocation() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/location/pending`);
      dispatch({
        type: FETCH_PENDING_LOCATIONS,
        locations: res.data.locations,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createLocation(location, email) {
  const client = Client();
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/location`, { location, email });
      message.success(
        "Your location is created, We are reviewing your location submission!"
      );
      return true;
    } catch (err) {
      createNotification("Create Location", errorMessage(err));
      return false;
    }
  };
}

export function createOtherLocation(location, email) {
  const client = Client();
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/location/other`, { location, email });
      message.success(
        "Your location is created, We are reviewing your location submission!"
      );
      return true;
    } catch (err) {
      createNotification("Create Location", errorMessage(err));
      return false;
    }
  };
}

export function updateLocation(values) {
  const client = Client(true);
  return async (dispatch, getState) => {
    try {
      await client.put(`${API_URL}/location`, values);
      message.success("Location has been updated successfully!");
    } catch (err) {
      createNotification("Update Location", errorMessage(err));
    }
  };
}

export function adminListLocation() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/location/admin`);
      return res.data.locations;
    } catch (err) {
      console.log(err);
    }
  };
}

export function adminResolveLocation(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.put(`${API_URL}/location/admin`, values);
      message.success(`Location has been approved successfully!`);
    } catch (err) {
      createNotification("Resolve Location", errorMessage(err));
    }
  };
}

export function adminDeclineLocation(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/location/${id}`);
      message.success("Location has been declined successfully!");
    } catch (err) {
      createNotification("Decline Location", errorMessage(err));
    }
  };
}

export function setInviteLocation(loc_id) {
  return async (dispatch) => {
    if (!loc_id) return false;
    dispatch({
      type: SET_INVITE_LOCATION,
      location: loc_id,
    });
  };
}

export function listLocationUsers(location_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/user/location/${location_id}`);
      dispatch({
        type: FETCH_HOSTED_USERS,
        users: res.data.participants,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function hostVerifyUser(user_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/location/verify/${user_id}`);
    } catch (err) {
      createNotification("Approve User", errorMessage(err));
    }
  };
}

export function sendAllNotification(data) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      if (!data.title || !data.content) return;
      let res = await client.post(`${API_URL}/notification/location`, data);
      message.success(res.data.message);
    } catch (err) {
      createNotification("Broadcast Notification", errorMessage(err));
    }
  };
}

export function addSponsorToLocation(locationId, sponsorId) {
  return async (dispatch) => {
    try {
      const client = Client(true);

      let res = await client.put(
        `${API_URL}/location/${locationId}/add-sponsor`,
        { sponsorId }
      );
      dispatch({
        type: ADD_SPONSOR_TO_LOCATION,
        sponsor: res.data,
      });
      message.success("Sponsor added to location successfully");
    } catch (err) {
      createNotification("Add Sponsor To Location", errorMessage(err));
    }
  };
}
export function removeSponsorFromLocation(locationId, sponsorId) {
  return async (dispatch) => {
    try {
      const client = Client(true);

      let res = await client.put(
        `${API_URL}/location/${locationId}/remove-sponsor`,
        { sponsorId }
      );
      dispatch({
        type: REMOVE_SPONSOR_FROM_LOCATION,
        sponsor: res.data,
      });
      message.success("Sponsor removed from location successfully");
    } catch (err) {
      createNotification("Remove Sponsor From Location", errorMessage(err));
    }
  };
}
