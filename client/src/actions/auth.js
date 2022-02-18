import axios from "axios";
import cookie from "react-cookies";
import { API_URL, createNotification, errorMessage } from "./index";
import {
  AUTH_USER,
  UNAUTH_USER,
  FETCH_USER,
  FETCH_USER_LIST,
  FETCH_USER_SEARCH_LIST,
  SET_KEY_DATA,
  SET_SHOW_INSTRUCT,
} from "./types";
import history from "../history";
import Client from "./api";
import { setMessageUserId } from "./message";
import { message } from "antd";
import { listPendingLocation } from "./location";
import { fetchNotifications } from "./notification";
import { fetchConversations } from "./message";

const INTEGRA_HOST = process.env.REACT_APP_INTEGRA_HOST;

//= ===============================
// Authentication actions
//= ===============================
export function loginUser({ email, password }) {
  return async (dispatch, getState) => {
    const client = Client();
    try {
      const response = await client.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      runBackgroundProgress(response, dispatch, getState);
      if (response.data.user) {
        history.push("/dashboard");
      }
    } catch (err) {
      createNotification("Login Failed", errorMessage(err));
    }
  };
}

export function registerUser(values) {
  return async (dispatch, getState) => {
    const client = Client();
    try {
      const response = await client.post(
        `${API_URL}/auth/user-register`,
        values
      );
      runBackgroundProgress(response, dispatch, getState);
      return true;
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
      return false;
    }
  };
}

export function checkIntegraId(integra_id) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/auth/checkid`, { integra_id });
      return true;
    } catch (err) {
      createNotification("Register Failed", errorMessage(err));
      return false;
    }
  };
}

export function verifyPassphrase(pdfData, passphrase) {
  return async (dispatch) => {
    if (!passphrase) return;
    try {
      let res = await axios.post(`${INTEGRA_HOST}/verifyPrivateKey`, {
        private_key: pdfData.private_key,
        pass_phrase: passphrase,
      });
      if (!res.data.verified) {
        message.error("Passphrase is not correct!");
        return false;
      }
      return res.data.verified;
    } catch (err) {
      message.error("Passphrase is not correct!");
      return false;
    }
  };
}

export function loginWithIdentity(pdfData) {
  return async (dispatch, getState) => {
    const client = Client();
    try {
      const response = await client.post(`${API_URL}/auth/analyze`, pdfData);
      runBackgroundProgress(response, dispatch, getState);
      if (response.data.user) {
        history.push("/dashboard");
      }
    } catch (err) {
      if (errorMessage(err) === "No user with the data") {
        createNotification(
          "Login Failed",
          "Please finish registration process"
        );
        history.push("register");
        return;
      }
      createNotification("Login Failed", errorMessage(err));
    }
  };
}

export function sendEmailIdentity(email, pdfData, filename) {
  return async (dispatch) => {
    const client = Client();
    try {
      var fd = new FormData();
      const file = new File([pdfData], filename, { type: "application/pdf" });
      fd.append("file", file);
      fd.append("email", email);
      await client.post(`${API_URL}/auth/identity/email`, fd);
      message.success("GLH Private Key has been sent successfully!");
    } catch (err) {
      createNotification("Email Failed", errorMessage(err));
    }
  };
}

export function sendUserInvitation(emails) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/auth/invite/user`, { emails });
      message.success("User invitation has been sent successfully!");
    } catch (err) {
      createNotification("Invite Failed", errorMessage(err));
    }
  };
}

export function updateUserLocation(locationId, email) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/user/location`, { locationId, email });
    } catch (err) {
      console.log(errorMessage(err));
    }
  };
}

export function updateUserAddress(country, city, email) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/user/address`, { country, city, email });
    } catch (err) {
      console.log(errorMessage(err));
    }
  };
}

export function confirmEmail({ token, mode }) {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_URL}/auth/verify`, { token, mode });
      const message = res.data.message;
      if (
        message &&
        (message.includes("verified successfully") ||
          message.includes("already been verified"))
      ) {
        localStorage.setItem("vrf", "");
      }
      return message;
    } catch (error) {
      createNotification("Confirm Email", errorMessage(error));
    }
  };
}

export function updateProfile({ profile }) {
  return function (dispatch) {
    const client = Client(true);
    client
      .post(`${API_URL}/user`, { profile })
      .then((response) => {
        dispatch({ type: FETCH_USER, payload: response.data.user });
      })
      .catch((error) => {
        createNotification("Update Profile", errorMessage(error));
      });
  };
}

export function logoutUser(error) {
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER, payload: error || "" });
    cookie.remove("token", { path: "/" });
    cookie.remove("user", { path: "/" });
    history.push(`/login`);
  };
}

export function adminResetPassword(email) {
  return async (dispatch) => {
    const client = Client();
    try {
      const res = await client.post(`${API_URL}/auth/respwdlink`, { email });
      return res.data.link;
    } catch (err) {
      createNotification("Failed to reset password", errorMessage(err));
      return "";
    }
  };
}

export function getForgotPasswordToken(email) {
  return async (dispatch) => {
    const client = Client();
    try {
      await client.post(`${API_URL}/auth/forgot-password`, { email });
      history.push("/");
      message.success("Forgot password request has been sent successfully");
    } catch (err) {
      createNotification("Forgot Password", errorMessage(err));
    }
  };
}

export function resetPassword(token, password, conf_password) {
  return function (dispatch) {
    if (password !== conf_password) {
      createNotification("Reset Password", "password doesn't match");
      return;
    }
    axios
      .post(`${API_URL}/auth/reset-password/${token}`, { password })
      .then((response) => {
        history.push("/login");
      })
      .catch((error) => {
        createNotification("Reset Password", errorMessage(error));
      });
  };
}

export function resetPasswordSecurity(userid, password, conf_password) {
  return function (dispatch) {
    if (password !== conf_password) {
      createNotification("Reset Password", "password doesn't match");
      return;
    }
    axios
      .post(`${API_URL}/auth/reset-password-security`, { userid, password })
      .then((response) => {
        history.push("/login");
      })
      .catch((error) => {
        createNotification("Reset Password", errorMessage(error));
      });
  };
}

export function protectedTest() {
  return async (dispatch, getState) => {
    try {
      let response = await axios.get(`${API_URL}/protected`, {
        headers: { Authorization: cookie.load("token") },
      });
      runBackgroundProgress(response, dispatch, getState);
    } catch (error) {
      dispatch({ type: UNAUTH_USER, payload: "" });
    }
  };
}

export function listAllParticipants(count, filter) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.post(`${API_URL}/user/list/${count}`, filter);
      dispatch({
        type: FETCH_USER_LIST,
        participants: res.data.participants,
        total: res.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export function getUser(userId) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/user/${userId}`);
      return res.data.user;
    } catch (err) {
      createNotification("GET User", errorMessage(err));
    }
  };
}

export function orgUsers(orgId) {
  return async (dispatch) => {
    try {
      let res = await axios.get(`${API_URL}/user/users/${orgId}`, {
        headers: { Authorization: cookie.load("token") },
      });
      return res.data.participants;
    } catch (err) {
      console.log(err);
    }
  };
}

export function resendVerification() {
  let vrf = localStorage.getItem("vrf");
  return (dispatch) => {
    if (!vrf) return;
    vrf = JSON.parse(vrf);
    axios.post(`${API_URL}/auth/resend`, vrf).catch((err) => {
      createNotification("Resend", errorMessage(err));
    });
  };
}

export function searchParticipants(text) {
  return async (dispatch) => {
    if (text.length < 3) {
      createNotification(
        "Search Participant",
        "Search text should be at least 3 in length"
      );
      return;
    }
    const client = Client(true);
    try {
      let res = await client.get(`${API_URL}/search/participant/${text}`);
      dispatch({
        type: FETCH_USER_SEARCH_LIST,
        participants: res.data.participants,
        searchTxt: text,
      });
    } catch (err) {
      createNotification("Search Participant", errorMessage(err));
    }
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_SEARCH_LIST, participants: [], searchTxt: "" });
  };
}

export function createIntegraWallet(values) {
  return async (dispatch) => {
    const client = Client(true);
    try {
      const options = {
        cartridge_type: "PrivateKey",
        meta_form: JSON.stringify({
          integra_cartridge_type: "PrivateKey",
          pass_phrase: values.passphrase,
        }),
        data_form: JSON.stringify({}),
        existingGuid: values.invId,
        ledger_type: "wallet",
      };
      let res = await client.post(
        `${INTEGRA_HOST}/pdf?type=glh&ledger_type=wallet`,
        options,
        {
          responseType: "blob",
        }
      );
      dispatch({
        type: SET_KEY_DATA,
        pdfResult: res.data,
        passPhrase: values.passphrase,
      });
    } catch (err) {
      createNotification("Creat Identity", errorMessage(err));
    }
  };
}

export function dropRegFile(file) {
  var formData = new FormData();
  formData.append("file", file);
  return async (dispatch) => {
    try {
      let res = await axios.post(`${INTEGRA_HOST}/analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        data: res.data,
        success: true,
      };
    } catch (err) {
      return {
        error: err,
        success: false,
      };
    }
  };
}

export function setShowInstruct(value, instruct) {
  return (dispatch) => {
    dispatch({
      type: SET_SHOW_INSTRUCT,
      value,
      instruct,
    });
  };
}

export function runBackgroundProgress(response, dispatch, getState) {
  if (!response.data || !response.data.user) return;
  if (response.data.token) {
    cookie.save("token", response.data.token, { path: "/" });
    cookie.save("user", response.data.user, { path: "/" });
  }
  dispatch({ type: AUTH_USER });
  dispatch({ type: FETCH_USER, payload: response.data.user });
  setMessageUserId({ userId: response.data.user._id })(dispatch);
  const role = response.data.user.role || "";
  if (role.toLowerCase().includes("admin")) {
    listPendingLocation()(dispatch);
  }
  fetchNotifications()(dispatch, getState);
  fetchConversations()(dispatch);
}
