import { combineReducers } from "redux";
import authReducer from "./auth";
import userReducer from "./user";
import challengeReducer from "./challenge";
import organizationReducer from "./organization";
import profileReducer from "./profile";
import projectReducer from "./project";
import messageReducer from "./message";
import notificationReducer from "./notification";
import adminReducer from "./admin";
import galleryReducer from "./gallery";
import questionReducer from "./question";
import mentorReducer from "./mentor";
import announceReducer from "./announce";
import helpdocReducer from "./helpdoc";
import labelReducer from "./label";
import resourceReducer from "./resource";
import faqReducer from "./faq";
import locationReducer from "./location";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  challenge: challengeReducer,
  organization: organizationReducer,
  profile: profileReducer,
  project: projectReducer,
  message: messageReducer,
  notification: notificationReducer,
  admin: adminReducer,
  gallery: galleryReducer,
  question: questionReducer,
  mentor: mentorReducer,
  announce: announceReducer,
  helpdoc: helpdocReducer,
  label: labelReducer,
  resource: resourceReducer,
  faq: faqReducer,
  loc: locationReducer,
});

export default rootReducer;
