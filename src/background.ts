interface Shortcut {
  action: "OPEN_URL" | "OPEN_MULTIPLE_URLS" | "CLOSE_AND_OPEN";
  url?: string;
  urls?: string[];
}

interface Shortcuts {
  [key: string]: Shortcut;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ shortcuts: {} as Shortcuts });
});

chrome.runtime.onMessage.addListener(
  (request: { type: string; shortcutKey: string }, _sender, _sendResponse) => {
    if (request.type === "EXECUTE_SHORTCUT") {
      console.log("request : ", request);

      executeShortcut(request.shortcutKey);
    }
  }
);

function executeShortcut(shortcutKey: string) {
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
  if (shortcutKey) {
    return true;
  }
}
