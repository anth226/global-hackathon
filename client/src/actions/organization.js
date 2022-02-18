import {
  getData,
  deleteData,
  createNotification,
  API_URL,
  errorMessage,
} from "./index";
import {
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  ORGANIZATION_ERROR,
  FETCH_ORGANIZATION,
  FETCH_ORGANIZATIONLIST,
  DELETE_ORGANIZATION,
  SET_CURRENT_ORGANIZATION,
  FETCH_ORG_SEARCH_LIST,
  FETCH_SIMPLE_ORG,
  FETCH_ADMIN_ORG_LIST,
} from "./types";
import Client from "./api";
import history from "../history";
import { message } from "antd";

export function createOrganization(orgData) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/organization`, orgData);
      dispatch({
        type: CREATE_ORGANIZATION,
        organization: res.data.organization,
      });
      message.success("Organization has been created successfully");
    } catch (err) {
      createNotification("Create Organization", errorMessage(err));
    }
  };
}

export function updateOrganization(orgData) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.put(`${API_URL}/organization`, orgData);
      dispatch({
        type: UPDATE_ORGANIZATION,
        organization: res.data.organization,
      });
      message.success("Organization has been updated successfully");
    } catch (err) {
      createNotification("Update Organization", errorMessage(err));
    }
  };
}

export function getOrganization(org_id) {
  if (!org_id) return;
  const url = `/organization/${org_id}`;
  return (dispatch) =>
    getData(FETCH_ORGANIZATION, ORGANIZATION_ERROR, false, url, dispatch);
}

export function listOrganization(count, filters) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(
        `${API_URL}/organization/list/${count}`,
        filters
      );
      dispatch({
        type: FETCH_ORGANIZATIONLIST,
        organizations: res.data.organizations,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function listSimpleOrg() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/list-simple/0`);
      dispatch({ type: FETCH_SIMPLE_ORG, simpleOrgs: res.data.organizations });
    } catch (err) {
      console.log(err);
    }
  };
}

export function deleteOrganization(org_id) {
  const url = `/organization/${org_id}`;
  return (dispatch) =>
    deleteData(DELETE_ORGANIZATION, ORGANIZATION_ERROR, false, url, dispatch);
}

export function setCurrentOrganization(org) {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_ORGANIZATION, organization: org });
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_ORG_SEARCH_LIST, organizations: [], searchTxt: "" });
  };
}

// admin
export function listOrgReport() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/admin/report`);
      dispatch({
        type: FETCH_ADMIN_ORG_LIST,
        organizations: res.data.organizations,
      });
    } catch (err) {
      createNotification("List Organization", errorMessage(err));
    }
  };
}

export function listOrgUserReport() {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/organization/admin/user-report`);
      dispatch({
        type: FETCH_ADMIN_ORG_LIST,
        organizations: res.data.organizations,
      });
    } catch (err) {
      createNotification("List Organization", errorMessage(err));
    }
  };
}

export function contactOrg({ id, email, phone, gallery, message }) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/organization/contact/${id}`, {
        email,
        phone,
        gallery,
        message,
      });
      createNotification(
        "Contact organization",
        "Contact information submitted successfully"
      );
    } catch (err) {
      createNotification("Contact organization", errorMessage(err));
    }
  };
}

export function orgInviteVerify(token, password) {
  return async (dispatch) => {
    const client = Client();
    const data = { token, password };
    try {
      await client.post(`${API_URL}/user/invite/verify`, data);
      history.push("/login");
    } catch (err) {
      createNotification("User Invitation", errorMessage(err));
    }
  };
}
