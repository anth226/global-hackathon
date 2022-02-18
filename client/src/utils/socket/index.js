import io from "socket.io-client";
import { fetchNotifications } from "../../actions/notification";
import {
  fetchNewMessage,
  fetchConversations,
  refreshMessage,
} from "../../actions/message";
import { createNotification } from "../../actions";
let endpoint = process.env.REACT_APP_API_HOST;
endpoint = endpoint.slice(0, -3);

export const socket = io(endpoint);

export const configureSocket = (dispatch, getState) => {
  socket.on("connected", () => {
    console.log("connected");
  });

  socket.on("close", () => {
    setTimeout(10000, function () {
      socket.connect();
    });
  });

  socket.on("NEW_MESSAGE", (data) => {
    let authProfile = {};
    if (data.message.author && data.message.author.profile) {
      authProfile = data.message.author.profile;
    }
    createNotification(
      `New message from ${authProfile.first_name} ${authProfile.last_name}`,
      data.message.body.length > 35
        ? data.message.body.slice(0, 35) + "..."
        : data.message.body
    );
    fetchNewMessage(data.message)(dispatch, getState);
  });

  socket.on("CREATE_CONVERSATION", (data) => {
    createNotification("New message", data.message.body.slice(0, 35) + "...");
    dispatch(fetchConversations());
  });

  socket.on("UPDATE_MESSAGE", (data) => {
    refreshMessage(data.message)(dispatch, getState);
  });

  socket.on("NEW_NOTIFICATION", (data) => {
    dispatch(fetchNotifications());
  });

  return socket;
};
