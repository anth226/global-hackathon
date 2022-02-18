import { FETCH_NOTIFICATIONS, READ_ONE_NOTIFICATION } from "../actions/types";

const initialNotificaionData = {
  notifications: [],
  unread: 0,
};

const notification = (state = initialNotificaionData, action) => {
  let list = [];

  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
        unread: action.unread,
      };
    case READ_ONE_NOTIFICATION:
      list = state.notifications;
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id === action.notification._id) {
          list[i] = action.notification;
        }
      }
      return {
        ...state,
        notifications: list,
        unread: state.unread - 1,
      };
    default:
      return state;
  }
};

export default notification;
