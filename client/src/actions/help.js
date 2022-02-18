import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import {
  FETCH_HELPDOC_LIST,
  CREATE_HELPDOC,
  UPDATE_HELPDOC,
  DELETE_HELPDOC,
} from "./types";

export function listHelpDoc() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/help/list`);
      dispatch({
        type: FETCH_HELPDOC_LIST,
        helpdocs: res.data.helpdocs,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createHelpDoc(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/help/create`, values);
      dispatch({
        type: CREATE_HELPDOC,
        helpdoc: res.data.helpdoc,
      });
      message.success("New help document has been created successfully!");
    } catch (err) {
      createNotification("Create Help Document", errorMessage(err));
    }
  };
}

export function deleteHelpDoc(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/help/delete/${id}`);
      dispatch({
        type: DELETE_HELPDOC,
        id,
      });
    } catch (err) {
      createNotification("Delete Help Document", errorMessage(err));
    }
  };
}

export function updateHelpDoc(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/help/update`, values);
      dispatch({
        type: UPDATE_HELPDOC,
        helpdoc: res.data.helpdoc,
      });
      message.success("Help document has been updated successfully!");
    } catch (err) {
      createNotification("Update Help Document", errorMessage(err));
    }
  };
}
