import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";

export function listOrgInvite(org_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/orgmember/${org_id}`);
      return res.data.orgInvites;
    } catch (err) {
      console.log(err);
      return [];
    }
  };
}

export function createOrgInvite(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/orgmember/invite`, values);
      message.success("Invitation has been created successfully!");
      return res.data.orgInvite;
    } catch (err) {
      createNotification("Send Invite", errorMessage(err));
    }
  };
}

export function deleteOrgInvite(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/orgmember/${id}`);
      message.success("Invitation has been cancelled");
    } catch (err) {
      createNotification("Cancel Invite", errorMessage(err));
    }
  };
}

export function updateOrgInvite(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/orgmember/update`, values);
      message.success("Invitation has been updated successfully!");
      return res.data.orgInvite;
    } catch (err) {
      createNotification("Update Invite", errorMessage(err));
    }
  };
}

export function resendOrgInvite(inv_id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/orgmember/resend`, { inv_id });
      message.success("Invitation has been resent successfully!");
      return res.data.orgInvite;
    } catch (err) {
      createNotification("Resend Invite", errorMessage(err));
    }
  };
}
