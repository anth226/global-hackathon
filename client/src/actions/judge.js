import { API_URL, createNotification, errorMessage } from "./index";
import Client from "./api";
import { message } from "antd";
import history from "../history";
import { FETCH_JUDGE_LIST } from "./types";

export function sendJudgeInvite(email) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      await client.post(`${API_URL}/judge/invite`, { email });
      message.success("Invite has been sent successfully!");
    } catch (err) {
      createNotification("Send Invite", errorMessage(err));
    }
  };
}

export function judgeRegister(values) {
  return async (dispatch) => {
    let vrf = {};
    const client = Client();
    try {
      const response = await client.post(`${API_URL}/judge/register`, values);
      let user = response.data.user;
      vrf = {
        _id: user._id,
        name: `${user.profile.first_name} ${user.profile.last_name} `,
        email: user.email,
      };
      localStorage.setItem("vrf", JSON.stringify(vrf));
      history.push("/resend");
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
    }
  };
}

export function listJudges(count, filter) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/judge/list/${count}`, filter);
      dispatch({
        type: FETCH_JUDGE_LIST,
        judges: res.data.participants,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
