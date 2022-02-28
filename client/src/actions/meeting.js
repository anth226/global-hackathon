import { API_URL } from "./index";
import { FETCH_MEETING_INFO } from "./types";
import Client from "./api";

//= ===============================
// Meeting actions
//= ===============================
export function getMeetingInfo(token) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/meeting/${token}`);
      dispatch({
        type: FETCH_MEETING_INFO,
        meeting: res.data.meeting,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
