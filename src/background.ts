interface Shortcut {
  key: string;
  closeCurrentTab: boolean;
  moveCurrentTab: string;
  muteCurrentTab: boolean;
  openTabs: string[];
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

// FUNCTION ****************************************
const executeShortcut = async (func: Shortcut) => {
  // chrome.storage.sync.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
  //   const shortcut = data.shortcuts[shortcutKey];
  //   if (shortcut) {
  //     switch (shortcut.action) {
  //       case "OPEN_URL":
  //         if (shortcut.url) chrome.tabs.create({ url: shortcut.url });
  //         break;
  //       case "OPEN_MULTIPLE_URLS":
  //         if (shortcut.urls)
  //           shortcut.urls.forEach((url) => chrome.tabs.create({ url }));
  //         break;
  //       case "CLOSE_AND_OPEN":
  //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //           if (tabs[0].id) chrome.tabs.remove(tabs[0].id);
  //           if (shortcut.urls) {
  //             shortcut.urls.forEach((url) => chrome.tabs.create({ url }));
  //           } else if (shortcut.url) {
  //             chrome.tabs.create({ url: shortcut.url });
  //           }
  //         });
  //         break;
  //     }
  //   }
  // });
  //   if (shortcutKey) {
  //     return true;
  //   }

  // if(func.closeCurrentTab){
  // chrome.tabs.
  // }

  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  console.log("currentTab : ", currentTab);
  const currentTabId = currentTab.id;

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
};

let shortcuts: Shortcuts;

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(["shortcuts"], (result) => {
    // result.userSettings에 저장된 데이터 사용
    shortcuts = result.shortcuts;
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("onINstalled");

  // chrome.storage.sync.set({ shortcuts: {} as Shortcuts });
});

chrome.runtime.onMessage.addListener(
  async (request: RequestType, _sender, sendResponse) => {
    // SAVE
    if (request.type === "SAVE_SHORTCUT") {
      await chrome.storage.sync.set({
        shortcuts: request.shortcuts ? request.shortcuts : {},
      });

      sendResponse({ success: true });
    }

    // EXECUTE FROM EXTENSION
    if (request.type === "EXECUTE_SHORTCUT") {
      console.log("request : ", request);
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

        executeShortcut(shortcuts[shortcutKey]);
      }
    }
  }
);

// function executeShortcut(shortcutKey: string) {
// chrome.storage.sync.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
//   const shortcut = data.shortcuts[shortcutKey];
//   if (shortcut) {
//     switch (shortcut.action) {
//       case "OPEN_URL":
//         if (shortcut.url) chrome.tabs.create({ url: shortcut.url });
//         break;
//       case "OPEN_MULTIPLE_URLS":
//         if (shortcut.urls)
//           shortcut.urls.forEach((url) => chrome.tabs.create({ url }));
//         break;
//       case "CLOSE_AND_OPEN":
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           if (tabs[0].id) chrome.tabs.remove(tabs[0].id);
//           if (shortcut.urls) {
//             shortcut.urls.forEach((url) => chrome.tabs.create({ url }));
//           } else if (shortcut.url) {
//             chrome.tabs.create({ url: shortcut.url });
//           }
//         });
//         break;
//     }
//   }
// });
//   if (shortcutKey) {
//     return true;
//   }
// }
