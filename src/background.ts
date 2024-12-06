// import { createClient } from "@supabase/supabase-js";
import { supabaseClient } from "./lib/client";
import {
  ADD_EXCLUDE_CLOSE_OTHER_TABS,
  ADD_OPEN_NEW_TABS,
  DO_NOT_SUBSCRIBE_ERROR,
  EXECUTE_SHORTCUT_BY_CLICK,
  GET_USER_AND_SUBSCRIPTION_ERROR,
  GET_USER_ID_ERROR,
  LAST_CLOSED,
  LOGIN,
  LOGOUT,
  SAVE_SHORTCUT,
  UNMUTE_ALL_TAB,
  UNMUTE_CURRENT_TAB,
  USER_STATE,
} from "./lib/constant";
import { GetLastClosed } from "./lib/type";
// import {
//   DO_NOT_SUBSCRIBE_ERROR,
//   GET_USER_AND_SUBSCRIPTION_ERROR,
//   GET_USER_ID_ERROR,
//   GET_USER_STATE_AND_RESPONSE_ERROR,
// } from "./lib/constant";
// import { GetCurrentClosed } from "./lib/type";

interface Shortcut {
  key: string;
  closeCurrentTab: boolean;
  moveCurrentTab: string;
  muteCurrentTab: boolean;
  openTabs: string[];
  closeOtherTabs: boolean;
  closeOtherExceptUrl: string[];
  muteAllTabs: boolean;
  wasWritingNote?: string;
}

interface Shortcuts {
  [key: string]: Shortcut;
}

type KeyType = {
  code: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

type RequestType = {
  type: string;
  key: KeyType;
  shortcuts?: Shortcuts;
  shortcut?: Shortcut;
  wasWritingNote?: string;
};

const codeToKey: Record<string, string> = {
  // 숫자 키
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Digit0: "0",

  // 문자 키
  KeyA: "a",
  KeyB: "b",
  KeyC: "c",
  // ... 다른 알파벳들도 같은 패턴
  keyD: "d",
  keyE: "e",
  keyF: "f",
  keyG: "g",
  keyH: "h",
  keyI: "i",
  keyJ: "j",
  keyK: "k",
  keyL: "l",
  keyM: "m",
  keyN: "n",
  keyO: "o",
  keyP: "p",
  keyQ: "q",
  keyR: "r",
  keyS: "s",
  keyT: "t",
  keyU: "u",
  keyV: "v",
  keyW: "w",
  keyX: "x",
  keyY: "y",
  KeyZ: "z",

  // 특수 키
  Space: "space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Enter: "enter",
  Escape: "esc",
  Tab: "tab",
  Backspace: "backspace",
  Delete: "delete",
  Home: "home",
  End: "end",
  PageUp: "pageup",
  PageDown: "pagedown",

  // 기능 키
  F1: "f1",
  F2: "f2",
  // ... 다른 F 키들
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F8: "f8",
  F9: "f9",
  F10: "f10",
  F11: "f11",
  F12: "f12",

  // 기타
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Backquote: "₩",
  Semicolon: ";",
  Quote: " ' ",
  Comma: " , ",
  Period: " . ",
  Slash: "/",
};

const getShortcutKeyCombo = (e: KeyType) => {
  // code를 사용하여 실제 키 값 얻기
  const keyCode = e.code;

  const newKeys = new Set<string>();

  // 수식키 추가
  if (e.ctrlKey) newKeys.add("ctrl");
  if (e.metaKey) newKeys.add("cmd");
  if (e.altKey) newKeys.add("alt");
  if (e.shiftKey) newKeys.add("shift");

  // 수식키가 아닌 경우에만 키 추가
  if (
    ![
      "ControlLeft",
      "ControlRight",
      "ShiftLeft",
      "ShiftRight",
      "AltLeft",
      "AltRight",
      "MetaLeft",
      "MetaRight",
    ].includes(keyCode)
  ) {
    // 매핑된 키 값이 있으면 그 값을 사용하고, 없으면 원래 코드의 마지막 부분을 사용
    const keyValue =
      codeToKey[keyCode] || keyCode.replace(/^(Key|Digit)/, "").toLowerCase();
    newKeys.add(keyValue);
  }

  // setCurrentKeys(Array.from(newKeys));
  return Array.from(newKeys);
};

// ***********************************************

const supabase = supabaseClient();

// FUNCTION ****************************************
const executeShortcut = async (func: Shortcut, wasWritingNote?: string) => {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const otherTabs = await chrome.tabs.query({
    active: false,
    currentWindow: true,
  });

  console.log("currentTab : ", currentTab);
  console.log("other tabs : ", otherTabs);
  const currentTabId = currentTab.id;
  let currentClosedTabUrl = "";
  // let closedOtherTabs: string[] = [];

  if (currentTabId && (func.closeCurrentTab || func.moveCurrentTab)) {
    currentClosedTabUrl = currentTab.url || "";
    console.log("closedCurrentTabUrl : ", currentClosedTabUrl);
    chrome.storage.sync.set({
      currentClosed: { currentClosedTabUrl, wasWritingNote },
    });
  }

  if (func.closeCurrentTab && currentTabId) {
    chrome.tabs.remove(currentTabId);
  }

  if (!func.closeCurrentTab && currentTabId && func.moveCurrentTab) {
    chrome.tabs.update(currentTabId, { url: func.moveCurrentTab });
  }

  if (!func.closeCurrentTab && currentTabId && func.muteCurrentTab) {
    /*await*/ chrome.tabs.update(currentTabId, { muted: true });
  }

  if (func.openTabs && func.openTabs.length > 0) {
    for (let i = 0; i < func.openTabs.length; i++) {
      chrome.tabs.create({ url: func.openTabs[i] });
    }
  }

  if (func.closeOtherTabs && otherTabs.length > 0) {
    const filtertedCloseTabs = otherTabs.filter((tab) => {
      if (!tab.url) {
        return;
      }
      const domain = new URL(tab.url).origin;
      return !func.closeOtherExceptUrl.includes(domain);
    });

    console.log("filteredCloseTabs : ", filtertedCloseTabs);
    const closedOtherTabsUrls: string[] = [];
    for (let i = 0; i < filtertedCloseTabs.length; i++) {
      const tabId = filtertedCloseTabs[i].id;
      const tabUrl = filtertedCloseTabs[i].url;
      if (tabId) {
        chrome.tabs.remove(tabId);
      }
      if (tabId && tabUrl) {
        closedOtherTabsUrls.push(tabUrl);
      }
    }

    chrome.storage.sync.set({ closedOtherTabsUrls });
    chrome.storage.sync.get("closedOtherTabsUrls", (item) => {
      console.log("other tabs : ", item);
    });
  }
};

const getUserId = async () => {
  // let userId = undefined;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    // userId = data.user.id;
    return data.user.id;
  } catch (error) {
    console.log("err in getUserId : ", error);
    throw new Error(GET_USER_ID_ERROR);
  }
};

const getUserAndSubscription = async () => {
  let userInfo:
    | {
        email: string;
        subscriptions: {
          status: string;
          created_at: string;
        }[];
      }[]
    | null = null;
  try {
    const userId = await getUserId();

    const { data, error } = await supabase
      .from("users")
      .select("email,subscriptions(status, created_at)")
      .order("created_at", {
        referencedTable: "subscriptions",
        ascending: false,
      })
      .eq("id", userId);
    userInfo = data;
    if (error) {
      throw new Error(GET_USER_AND_SUBSCRIPTION_ERROR);
    }
  } catch (error) {
    console.log("err in getUserAndSubscription : ", error);
    throw new Error(GET_USER_AND_SUBSCRIPTION_ERROR);
  }
  return userInfo;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCurrentClosed = async (sendResponse: (response: any) => void) => {
  // 최근에 닫힌 currentTab, currentTab안의 input, otherTabs
  try {
    const userInfo = await getUserAndSubscription();
    if (!userInfo || userInfo.length < 1) {
      // 로그인이 안되어있을 때(세션등이 없을때)
      sendResponse({ success: false, error: GET_USER_ID_ERROR });
      return;
    } else if (
      !userInfo[0].subscriptions ||
      userInfo[0].subscriptions.length < 1 ||
      userInfo[0].subscriptions[0].status === "expired"
    ) {
      sendResponse({ success: false, error: DO_NOT_SUBSCRIBE_ERROR });
    }
    chrome.storage.sync.get(
      ["currentClosed", "closedOtherTabsUrls"],
      (response: GetLastClosed) => {
        console.log("Last Close response : ", response);
        sendResponse({ success: true, getLastClosed: response });
      }
    );
  } catch (error) {
    sendResponse({ success: false, error: error });
  }
};

const getUserStateAndResponse = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (response?: any) => void
) => {
  try {
    const userInfo = await getUserAndSubscription();

    sendResponse({ success: true, user: userInfo });
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
};

const getIsSubscribe = async () => {
  const userInfo = await getUserAndSubscription();
  if (
    !userInfo ||
    userInfo.length < 1 ||
    !userInfo[0].subscriptions ||
    userInfo[0].subscriptions.length < 1 ||
    userInfo[0].subscriptions[0].status === "expired"
  ) {
    return false;
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unmuteCurrentTab = async (sendResponse: (response?: any) => void) => {
  try {
    const isSubscribe = await getIsSubscribe();
    if (!isSubscribe) {
      throw new Error(DO_NOT_SUBSCRIBE_ERROR);
    }
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currentTabId = currentTab.id;

    if (currentTabId) {
      chrome.tabs.update(currentTabId, { muted: false }, () => {
        sendResponse({ success: true });
      });
    }
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unmuteAllTab = async (sendResponse: (response?: any) => void) => {
  try {
    const isSubscribe = await getIsSubscribe();
    if (!isSubscribe) {
      throw new Error(DO_NOT_SUBSCRIBE_ERROR);
    }
    const tabs = await chrome.tabs.query({
      currentWindow: true,
    });

    for (let i = 0; i < tabs.length; i++) {
      const tabId = tabs[i].id;
      if (tabId) {
        chrome.tabs.update(tabId, { muted: false });
      }
    }

    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
};

// Function END *************

let shortcuts: Shortcuts;
const contextMenuKeyId: string[] = [];

// chrome.cookies.get(
//   { url: "http://localhost:3000", name: "ninjatab-auth-token" },
//   (cookie) => {
//     console.log("cookie : ", cookie);
//   }
// );

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(["shortcuts"], (result) => {
    // result.userSettings에 저장된 데이터 사용
    shortcuts = result.shortcuts;
  });
  console.log("onStartup - shortcuts :  ", shortcuts);
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("onINstalled");
  console.log("chrome.runtime.id : ", chrome.runtime.id);

  chrome.contextMenus.create({
    id: "example",
    title: "Always Visible",
    type: "normal",
    contexts: ["all"], // 항상 표시
  });

  // chrome.storage.sync.set({ shortcuts: {} as Shortcuts });
  chrome.storage.sync.get(["shortcuts"], (result) => {
    // result.userSettings에 저장된 데이터 사용
    shortcuts = result.shortcuts ? result.shortcuts : {};
    console.log("shortcuts : ", shortcuts);

    chrome.contextMenus.create({
      id: ADD_OPEN_NEW_TABS,
      title: "Add Open New Tabs Url",
      type: "normal",
      contexts: ["all"], // 항상 표시
    });

    chrome.contextMenus.create({
      id: ADD_EXCLUDE_CLOSE_OTHER_TABS, // domain
      title: "Add Close Other Tabs Domain",
      type: "normal",
      contexts: ["all"], // 항상 표시
    });

    for (const [key, _value] of Object.entries(shortcuts)) {
      chrome.contextMenus.create({
        id: `${ADD_OPEN_NEW_TABS}:${key}`,
        parentId: ADD_OPEN_NEW_TABS,
        title: key,
        type: "normal",
        contexts: ["page"],
      });

      chrome.contextMenus.create({
        id: `${ADD_EXCLUDE_CLOSE_OTHER_TABS}:${key}`,
        parentId: ADD_EXCLUDE_CLOSE_OTHER_TABS,
        title: key,
        type: "normal",
        contexts: ["page"],
      });
      contextMenuKeyId.push(key);
    }
  });
});

// context menu 실행
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("info : ", info);
  console.log("tab : ", tab);

  const menuItemId = info.menuItemId; // ADD_EXCLUDE_CLOSE_OTHER_TABS:shift+1 이런식으로 저장함.
  const extractKey = menuItemId.toString().split(":")[1];
  const parentId = info.parentMenuItemId;

  if (parentId && parentId === ADD_OPEN_NEW_TABS && tab?.url) {
    shortcuts[extractKey].openTabs.push(tab.url);
  }

  if (parentId && parentId === ADD_EXCLUDE_CLOSE_OTHER_TABS && tab?.url) {
    shortcuts[extractKey].closeOtherTabs = true;
    // URL 객체를 생성하여 호스트만 반환
    const { origin } = new URL(tab.url);
    shortcuts[extractKey].closeOtherExceptUrl.push(origin);
  }

  chrome.storage.sync.set({ shortcuts });
});

// OAuth2

chrome.runtime.onMessage.addListener(
  (request: RequestType, _sender, sendResponse) => {
    // SAVE
    if (request.type === SAVE_SHORTCUT) {
      chrome.storage.sync.set(
        {
          shortcuts: request.shortcuts ? request.shortcuts : {},
        },
        () => {
          for (const [key, _value] of Object.entries(shortcuts)) {
            if (contextMenuKeyId.indexOf(key) !== -1) {
              continue;
            }
            chrome.contextMenus.create({
              id: `${ADD_OPEN_NEW_TABS}:${key}`,
              parentId: ADD_OPEN_NEW_TABS,
              title: key,
              type: "normal",
              contexts: ["page"],
            });

            chrome.contextMenus.create({
              id: `${ADD_EXCLUDE_CLOSE_OTHER_TABS}:${key}`,
              parentId: ADD_EXCLUDE_CLOSE_OTHER_TABS,
              title: key,
              type: "normal",
              contexts: ["page"],
            });
          }

          sendResponse({ success: true });
        }
      );
      shortcuts = request.shortcuts ? request.shortcuts : {}; // 저장하고, 전역변수로 저장된 shortcuts 업데이트
      return true;
    }

    // EXECUTE FROM EXTENSION
    if (request.type === "EXECUTE_SHORTCUT") {
      console.log("request : ", request);
      if (request.shortcut) {
        executeShortcut(request.shortcut);
      }
    }

    // EXECUTE FROM CONTENT
    if (request.type === "KEY_DOWN") {
      console.log("KEY DOWN FROM CONTENT!! - request : ", request);
      console.log("shortcuts : ", shortcuts);

      const shortcutKey = getShortcutKeyCombo(request.key).join("+");
      console.log("shortcutKey : ", shortcutKey);
      console.log("shortcuts[shortcutKey] : ", shortcuts[shortcutKey]);

      if (shortcuts && shortcuts[shortcutKey]) {
        // event.preventDefault();
        console.log(
          "shortcut 발동! : shortcuts[shorcutKey] : ",
          shortcuts[shortcutKey]
        );

        executeShortcut(shortcuts[shortcutKey], request.wasWritingNote);
      }
    }

    // EXECUTE BY CLICK
    if (request.type === EXECUTE_SHORTCUT_BY_CLICK) {
      // const shortcuts = request
      // console.log("shortcuts : ", shortcuts);
      console.log("request : ", request.shortcut);
      if (request.shortcut) {
        executeShortcut(request.shortcut);
      }
    }

    // LOGIN (오ㅣ부 앱사이트에서)
    if (request.type === LOGIN) {
      console.log("LOGIN!!!");
      // console.log("url. : ", url.searchParams.get("redirect_uri"));
      const manifest = chrome.runtime.getManifest();

      const url = new URL("https://accounts.google.com/o/oauth2/auth");

      url.searchParams.set(
        "client_id",
        manifest.oauth2 ? manifest.oauth2.client_id : ""
      );
      url.searchParams.set("response_type", "id_token");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set(
        "redirect_uri",
        `https://${chrome.runtime.id}.chromiumapp.org`
      );
      url.searchParams.set(
        "scope",
        manifest.oauth2?.scopes ? manifest.oauth2.scopes.join(" ") : ""
      );

      chrome.identity.launchWebAuthFlow(
        {
          url: url.href,
          interactive: true,
        },
        async (redirectedTo) => {
          console.log("redirectedTo : ", redirectedTo);

          if (chrome.runtime.lastError) {
            // auth was not successful
            console.log(
              "auth not! - chrome.runtime.lastError : ",
              chrome.runtime.lastError
            );
            sendResponse({ message: "Login False TT" });
          } else {
            // auth was successful, extract the ID token from the redirectedTo URL
            const url = new URL(redirectedTo!);
            // const params = new URLSearchParams(url.hash);
            const params = new URLSearchParams(url.hash.replace("#", ""));
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: params.get("id_token")!,
            });

            console.log("data : ", data);
            console.log("error: ", error);

            // const user = await supabase.auth.getUser();
            // console.log("user : ", user);
            getUserStateAndResponse(sendResponse);
          }
        }
      );
      return true;
    }

    // USER STATE 유저 로그인 상태, 구독여부
    if (request.type === USER_STATE) {
      getUserStateAndResponse(sendResponse);
      // sendResponse({ success: true });
      return true;
    }

    // Last Focused
    if (request.type === LAST_CLOSED) {
      getCurrentClosed(sendResponse);
      // sendResponse({ success: true });
      return true;
    }

    // Logout
    if (request.type === LOGOUT) {
      supabase.auth.signOut();
    }

    // Unmute current tab
    if (request.type === UNMUTE_CURRENT_TAB) {
      unmuteCurrentTab(sendResponse);
      return true;
    }

    // Unmute All tab
    if (request.type === UNMUTE_ALL_TAB) {
      unmuteAllTab(sendResponse);
      return true;
    }

    // return true;
  }
);
