import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { message } from "antd";

export function restrictUser(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/user/restrict/${userId}`);
      message.success("User is restricted successfully");
      return res.data.user;
    } catch (err) {
      createNotification("Restrict User", errorMessage(err));
    }
  };
}

export function blockUser(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/user/block/${userId}`);
      message.success("User is blocked successfully");
      return res.data.user;
    } catch (err) {
      createNotification("Block User", errorMessage(err));
    }
  };
}

export function reportUser(userId, text) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/report/participant/${userId}`, {
        text,
      });
      message.success("User reported successfully");
      return res.data.report;
    } catch (err) {
      createNotification("Report User", errorMessage(err));
    }
  };
}

export function resolveUserReport(reportId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.put(`${API_URL}/report/${reportId}`);
      message.success("User report resoved successfully");
      return res.data.report;
    } catch (err) {
      createNotification("Resolve Report", errorMessage(err));
    }
  };
}

export function allSimpleUsers() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/simple-user/list`);
      return res.data.participants;
    } catch (err) {
      createNotification("Get Participant List", errorMessage(err));
    }
  };
}