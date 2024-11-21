// const images = document.querySelectorAll("img");

// images.forEach((image) => {
// image.src = "https://i.imgflip.com/5mmtwr.jpg";
// });

// // content-script.js
// let activeTabId: number | undefined;

// // activeTabId 변수에 저장
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   console.log("tabs : ", tabs);
//   chrome.runtime.sendMessage({
//     type: "TAB",
//     tabs,
//   });
//   activeTabId = tabs[0].id;
// });

document.addEventListener("keydown", (event: KeyboardEvent) => {
  // console.log("tab : ", activeTabId);

  chrome.runtime.sendMessage({
    type: "KEY_DOWN",
    key: {
      code: event.code,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
    },
    // activeTabId,
  });
});
