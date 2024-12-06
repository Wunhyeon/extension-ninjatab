export const SHORT_CUT_INPUT_MODAL = "shortCutInputModal";
export const IS_CLOSE_THIS_TAB_RADIO = "isCloseThisTabRadio";
export const EXECUTE_SHORTCUT_BY_CLICK = "EXECUTE_SHORTCUT_BY_CLICK";

// message type
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SAVE_SHORTCUT = "SAVE_SHORTCUT";
export const LAST_CLOSED = "LAST_CLOSED"; // Last closed current tab url, last edited text, other tabs url
export const USER_STATE = "USER_STATE"; // user의 로그인 상태, 구독 상태

// ment
export const EXIST_SHORTCUT_CONFIRM =
  "A shortcut already exists. Proceeding will overwrite it. Do you want to continue?";
export const IS_DELETE_SHORTCUT_CONFIRM =
  "Are you sure you want to delete this shortcut?";
export const URL_MUST_START_WITH =
  "The URL must start with http:// or https://";
export const DOMAIN_URL_MUST_START_WITH =
  "The Domain URL must start with http:// or https://";

//error
export const GET_USER_ID_ERROR = "Error in get User Id";
export const GET_USER_AND_SUBSCRIPTION_ERROR =
  "Error in get user and subscription";
export const GET_USER_STATE_AND_RESPONSE_ERROR =
  "Error in get User State And Response";
export const DO_NOT_SUBSCRIBE_ERROR = "do not subscribe";

// context menu (우클릭)
// 여러번 쓰이는 id (parentId로)
export const ADD_OPEN_NEW_TABS = "ADD_OPEN_NEW_TABS";
export const ADD_EXCLUDE_CLOSE_OTHER_TABS = "ADD_EXCLUDE_CLOSE_OTHER_TABS";
