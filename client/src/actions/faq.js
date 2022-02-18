import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import { FETCH_FAQ_LIST, CREATE_FAQ, UPDATE_FAQ, DELETE_FAQ } from "./types";

export function listFaq() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/faq`);
      dispatch({
        type: FETCH_FAQ_LIST,
        faqs: res.data.faqs,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createFaq(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/faq`, values);
      dispatch({
        type: CREATE_FAQ,
        faq: res.data.faq,
      });
      message.success("Q/A has been created successfully!");
    } catch (err) {
      createNotification("Create Faq", errorMessage(err));
    }
  };
}

export function deleteFaq(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/faq/${id}`);
      dispatch({
        type: DELETE_FAQ,
        id,
      });
      message.success("Q/A has been deleted successfully!");
    } catch (err) {
      createNotification("Delete Faq", errorMessage(err));
    }
  };
}

export function updateFaq(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/faq`, values);
      dispatch({
        type: UPDATE_FAQ,
        faq: res.data.faq,
      });
      message.success("Q/A has been updated successfully!");
    } catch (err) {
      createNotification("Update Faq", errorMessage(err));
    }
  };
}

export function bulkUpdateFaq(faqs) {
  const client = Client(true);
  let aqs = [];
  for (let fq of faqs) {
    if (fq.answer) aqs.push(fq);
  }
  return async (dispatch) => {
    try {
      client.put(`${API_URL}/faq/bulk/list`, { faqs: aqs });
      dispatch({
        type: FETCH_FAQ_LIST,
        faqs,
      });
    } catch (err) {
      createNotification("Update Faqs", errorMessage(err));
    }
  };
}
