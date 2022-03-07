//= =====================
// Auth Actions
//= =====================
export const AUTH_USER = "auth_user",
  UNAUTH_USER = "unauth_user",
  AUTH_ERROR = "auth_error",
  FORGOT_PASSWORD_REQUEST = "forgot_password_request",
  RESET_PASSWORD_REQUEST = "reset_password_request",
  SET_KEY_DATA = "set_key_data",
  SET_SHOW_INSTRUCT = "set_show_instruct",
  PROTECTED_TEST = "protected_test";

//= =====================
// User Profile Actions
//= =====================
export const FETCH_USER = "fetch_user",
  FETCH_USER_LIST = "fetch_user_list",
  FETCH_USER_SEARCH_LIST = "fetch_user_search_list",
  FETCH_MENTOR_LIST = "fetch_mentor_list",
  FETCH_JUDGE_LIST = "featch_judge_list",
  UPDATE_USER_PROFILE = "update_user_profile";
export const ERROR_RESPONSE = "error_response";

//= =====================
// Challenge Actions
//= =====================
export const FETCH_CHALLENGE = "fetch_challenge",
  FETCH_CHALLENGELIST = "fetch_challenge_list",
  FETCH_ALL_CHALLENGELIST = "fetch_all_challenge_list",
  UPDATE_CHALLENGE = "update_challenge",
  CREATE_CHALLENGE = "create_challenge",
  DELETE_CHALLENGE = "delete_challenge",
  CHALLENGE_ERROR = "challenge_error",
  FETCH_CHALLENGE_PROJECT_COUNT = "fetch_challenge_project_count",
  FETCH_CHALLENGE_SEARCH_LIST = "fetch_challenge_search_list",
  SET_CURRENT_CHALLENGE = "set_current_challenge",
  FETCH_CHALLENGE_COMMENTS = "fetch_challenge_comments";

//= =====================
// Organization Actions
//= =====================
export const FETCH_ORGANIZATION = "fetch_organization",
  AUTH_ORGANIZATION = "auth_organization",
  FETCH_ORGANIZATIONLIST = "fetch_organization_list",
  UPDATE_ORGANIZATION = "update_organization",
  CREATE_ORGANIZATION = "create_organization",
  DELETE_ORGANIZATION = "delete_organization",
  ORGANIZATION_ERROR = "organization_error",
  FETCH_ORG_SEARCH_LIST = "fetch_org_seaerch_list",
  FETCH_SIMPLE_ORG = "fetch_simple_org",
  SET_CURRENT_ORGANIZATION = "set_current_organization";

//= =====================
// Project Actions
//= =====================
export const FETCH_PROJECT_LIST = "fetch_project_list",
  FETCH_PROJECT = "fetch_project",
  FETCH_PROJECT_PARTICIPANTS = "fetch_project_participants",
  FETCH_PROJECT_DETAIL_LIST = "fetch_project_detail_list",
  FETCH_PROJECT_SEARCH_LIST = "fetch_project_search_list",
  FETCH_REVIEW_PROJECT_LIST = "fetch_review_project_list",
  CREAT_PROJECT_VOTE = "create_project_vote",
  UPDATE_PROJECT_VOTE = "update_project_vote",
  FETCH_PROJECT_COMMENTS = "fetch_project_comments";

//= =====================
// Field data Actions
//= =====================
export const FETCH_FIELD_DATA = "fetch_field_data",
  CREATE_FIELD_DATA = "create_field_data",
  DELETE_FIELD_DATA = "delete_field_data",
  ADMIN_SET_MENTOR = "admin_set_mentor",
  ADMIN_SET_SUMMARY = "admin_set_summary",
  ADMIN_UPDATE_FIELD = "admin_set_column";

//= =====================
// Messaging Actions
//= =====================
export const FETCH_CONVERSATIONS = "fetch_conversations",
  SET_ON_MESSAGE = "set_on_message",
  SET_CHANNEL = "set_channel",
  SET_DECRYPT = "set_decrypt",
  FETCH_MESSAGES = "fetch_messages";

//= =====================
// Notification Actions
//= =====================
export const FETCH_NOTIFICATIONS = "fetch_notifications",
  READ_ONE_NOTIFICATION = "read_one_notification";

//= =====================
// Security Question Actions
//= =====================
export const FETCH_QUESTIONS = "fetch_questions",
  FETCH_SECURITY_QUESTION = "fetch_security_question";

//= =====================
// Gallery Actions
//= =====================
export const FETCH_GALLERYLIST = "fetch_gallery_list",
  SET_CURRENT_GALLERY = "set_currency_gallery",
  FETCH_ADMIN_GALLERYLIST = "fetch_admin_gallery_list",
  FETCH_GALLERY_SEARCH_LIST = "fetch_gallery_search_list";

//= =====================
// Announce Actions
//= =====================
export const FETCH_ANNOUNCE_LIST = "fetch_announce_list",
  GET_RECENT_ANNOUNCE = "get_recent_announce",
  CREATE_ANNOUNCE = "create_announce",
  UPDATE_ANNOUNCE = "update_announce",
  HIDE_ANNOUNCE = "hide_announce";

//= =====================
// HelpDoc Actions
//= =====================
export const FETCH_HELPDOC_LIST = "fetch_helpdoc_list",
  CREATE_HELPDOC = "create_helpdoc",
  UPDATE_HELPDOC = "update_helpdoc",
  DELETE_HELPDOC = "delete_helpdoc";

//= =====================
// Label Actions
//= =====================
export const FETCH_LABEL = "fetch_label";

//= =====================
// Admin Actions
//= =====================
export const FETCH_ADMIN_PARTICIPANTS = "fetch_admin_participants",
  FETCH_REPORTS = "fetch_reports",
  UPDATE_ROLE = "update_role",
  FETCH_ADMIN_PARTICIPANT = "fetch_admin_participant",
  FETCH_ADMIN_ORG_LIST = "fetch_admin_org_list",
  FETCH_ADMIN_CHL_LIST = "fetch_admin_chl_list",
  FETCH_PROJECT_CREATORS = "fetch_project_creators";

//= =====================
// Resource Actions
//= =====================
export const FETCH_RESOURCE_LIST = "fetch_resource_list",
  CREATE_RESOURCE = "create_resource",
  DELETE_RESOURCE = "delete_resource",
  UPDATE_RESOURCE = "update_resource";

//= =====================
// Faq Actions
//= =====================
export const FETCH_FAQ_LIST = "fetch_faq_list",
  CREATE_FAQ = "create_faq",
  DELETE_FAQ = "delete_faq",
  UPDATE_FAQ = "update_faq";

//= =====================
// Location Actions
//= =====================
export const FETCH_LOCATION_LIST = "fetch_location_list",
  FETCH_PENDING_LOCATIONS = "fetch_pending_locations",
  FETCH_HOSTED_USERS = "fetch_hosted_users",
  SET_INVITE_LOCATION = "set_invite_location";

//= =====================
// Meeting Actions
//= =====================
export const FETCH_MEETING_INFO = "fetch_meeting_info";

//= =====================
// Sponsors Actions
//= =====================
export const FETCH_SPONSORS_LIST = "fetch_sponsors_list";
export const FETCH_SPONSORS_LIST_FAILED = "fetch_sponsors_list_failed";
export const CLEAR_FETCH_SPONSORS_LIST = "clear_fetch_sponsors_list";
export const UPDATE_SPONSORS = "update_sponsors";
export const UPDATE_SPONSORS_FAILED = "update_sponsors_failed";
export const CLEAR_UPDATE_SPONSORS = "clear_update_sponsors";
export const FETCH_SPONSOR = "fetch_sponsor";
export const FETCH_SPONSOR_FAILED = "fetch_sponsor_failed";
export const CLEAR_FETCH_SPONSOR = "clear_fetch_sponsor";
export const ADD_SPONSOR = "add_sponsor";
export const ADD_SPONSOR_FAILED = "add_sponsor_failed";
export const ADD_SPONSOR_TO_LOCATION = "add_sponsor_to_location";
export const REMOVE_SPONSOR_FROM_LOCATION = "remove_sponsor_from_location";
