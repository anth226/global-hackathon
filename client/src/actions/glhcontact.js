import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";

export function unsubscribe(email) {
  const client = Client();
  return async (dispatch) => {
    try {
      await client.post(`${API_URL}/contact/unsubscribe`, { email });
      message.success("Unsubscribed successfully!");
    } catch (err) {
      createNotification("Unsubscribe Fail", errorMessage(err));
    }
  };
}
