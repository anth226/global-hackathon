import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";

//= ===============================
// Search actions
//= ===============================

export function totalSearch(searchTxt) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/search/total/${searchTxt}`);
      return res.data;
    } catch (err) {
      createNotification("Search Total", errorMessage(err));
    }
  };
}
