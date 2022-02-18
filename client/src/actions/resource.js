import { API_URL, errorMessage, createNotification } from "./index";
import Client from "./api";
import { message } from "antd";
import {
  FETCH_RESOURCE_LIST,
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE,
} from "./types";

export function listResource() {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.get(`${API_URL}/resource`);
      dispatch({
        type: FETCH_RESOURCE_LIST,
        resources: res.data.resources,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function createResource(values) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.post(`${API_URL}/resource`, values);
      dispatch({
        type: CREATE_RESOURCE,
        resource: res.data.resource,
      });
      message.success("Resource has been created successfully!");
    } catch (err) {
      createNotification("Create Resource", errorMessage(err));
    }
  };
}

export function deleteResource(id) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      await client.delete(`${API_URL}/resource/${id}`);
      dispatch({
        type: DELETE_RESOURCE,
        id,
      });
      message.success("Resource has been deleted successfully!");
    } catch (err) {
      createNotification("Delete Resource", errorMessage(err));
    }
  };
}

export function updateResource(resource) {
  const client = Client(true);
  return async (dispatch) => {
    try {
      let res = await client.put(`${API_URL}/resource`, resource);
      dispatch({
        type: UPDATE_RESOURCE,
        resource: res.data.resource,
      });
      message.success("Resource has been updated successfully!");
    } catch (err) {
      createNotification("Update Resource", errorMessage(err));
    }
  };
}
