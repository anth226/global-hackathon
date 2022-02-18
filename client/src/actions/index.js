import axios from "axios";
import cookie from "react-cookies";
import history from "../history";
import { notification } from "antd";
import { FETCH_USER, UNAUTH_USER } from "./types";
import Client from "./api";

export const CLIENT_ROOT_URL = process.env.REACT_APP_API_HOST;
export const API_URL = process.env.REACT_APP_API_HOST;
//= ===============================
// Utility actions
//= ===============================

export function fetchUser(uid) {
  return function (dispatch) {
    axios
      .get(`${API_URL}/user/${uid}`, {
        headers: { Authorization: cookie.load("token") },
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function updateUserProfile(data) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/user`, {
        headers: { Authorization: cookie.load("token") },
        data,
      })
      .then((response) => {
        dispatch({
          type: FETCH_USER,
          payload: response.data.user,
        });
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function deleteUser(uid) {
  return function (dispatch) {
    const client = Client(true);
    client
      .post(`${API_URL}/user/block/${uid}`)
      .then((response) => {
        dispatch({ type: UNAUTH_USER, payload: "" });
        cookie.remove("token", { path: "/" });
        cookie.remove("user", { path: "/" });
        history.push(`/`);
      })
      .catch((response) => dispatch(errorHandler(response.data.error)));
  };
}

export function errorHandler(dispatch, error, type) {
  console.log("Error type: ", type);
  console.log(error);

  if (!error) return;
  let errorMessage = error.status ? error.data : error;
  if (errorMessage.message) {
    errorMessage = errorMessage.message;
  }
  if (errorMessage.error) {
    errorMessage = errorMessage.error;
  }
  // NOT AUTHENTICATED ERROR
  if (
    error.status === 401 ||
    (error.response && error.response.status === 401)
  ) {
    errorMessage = "Email and Password combination not found";
    // return dispatch(logoutUser(errorMessage));
  }

  dispatch({
    type,
    payload: errorMessage,
  });
}

// Post Request
export function postData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .post(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Get Request
export function getData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .get(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Put Request
export function putData(action, errorType, isAuthReq, url, dispatch, data) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .put(requestUrl, data, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

// Delete Request
export function deleteData(action, errorType, isAuthReq, url, dispatch) {
  const requestUrl = API_URL + url;
  let headers = {};

  if (isAuthReq) {
    headers = { headers: { Authorization: cookie.load("token") } };
  }

  axios
    .delete(requestUrl, headers)
    .then((response) => {
      dispatch({
        type: action,
        payload: response.data,
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, errorType);
    });
}

export function createNotification(message, description) {
  notification.info({
    message,
    description,
    placement: "topRight",
  });
}

export function errorMessage(err) {
  if (!err.response) return err.message;
  if (err.response.data && err.response.data.error) {
    return err.response.data.error;
  }
  return err.message;
}
