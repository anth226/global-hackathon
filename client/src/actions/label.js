import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import { FETCH_LABEL } from "./types";

export function listLabel() {
  const client = Client();
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/label/list`);
      dispatch({
        type: FETCH_LABEL,
        label: res.data.label,
      });
    } catch (err) {
      console.log("failed to get labels");
    }
  };
}

export function updateLabel(label) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/label/update`, label);
      dispatch({
        type: FETCH_LABEL,
        label: res.data.label,
      });
      message.success("Label has been updated successfully");
    } catch (err) {
      createNotification("Update Label", errorMessage(err));
    }
  };
}
