import {
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  SET_ON_MESSAGE,
  SET_CHANNEL,
  SET_DECRYPT,
} from "../actions/types";

const initialMessageData = {
  conversations: [],
  messages: [],
  onMessage: false,
  channelId: "",
  unread: 0,
  decrypt: false,
};

const message = (state = initialMessageData, action) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS:
      return {
        ...state,
        conversations: action.conversations,
        unread: action.unread,
      };
    case FETCH_MESSAGES:
      let conversations = state.conversations;
      let unread = state.unread;
      for (let i = 0; i < conversations.length; i++) {
        if (conversations[i]._id === action.conversationId) {
          unread -= conversations[i].unread;
          conversations[i].unread = 0;
        }
      }
      return { ...state, messages: action.messages, conversations, unread };
    case SET_ON_MESSAGE:
      return { ...state, onMessage: action.onMessage };
    case SET_CHANNEL:
      return { ...state, channelId: action.channelId };
    case SET_DECRYPT:
      return { ...state, decrypt: action.decrypt };
    default:
      return state;
  }
};

export default message;
