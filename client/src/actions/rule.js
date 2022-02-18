import { API_URL } from "./index";
import Client from "./api";

//= ===============================
// Rule actions
//= ===============================
export function createRule(user_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      await client.post(`${API_URL}/rules`, { user_id });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listRules() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/rules/list/all`);
      return res.data.rules;
    } catch (err) {
      console.log(err);
    }
  };
}

export function getRule(user_id) {
  return async (dispatch) => {
    try {
      const client = Client(true);
      let res = await client.get(`${API_URL}/rules/${user_id}`);
      return res.data.rule;
    } catch (err) {
      console.log(err);
    }
  };
}
