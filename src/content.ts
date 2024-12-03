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
  // 작성중이던 글
  const activeElement = document.activeElement;
  let wasWritingNote = "";
  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    wasWritingNote = activeElement.value;
    console.log("inputValue : ", wasWritingNote);
  } else if (
    activeElement instanceof HTMLElement &&
    activeElement.isContentEditable // contenteditable 요소인지 확인
  ) {
    // contenteditable 요소의 텍스트 가져오기
    wasWritingNote = activeElement.innerText; // 또는 textContent
    console.log("Contenteditable value:", wasWritingNote);
  }
  // const wasWritingNote = getWasWritingNote();
  chrome.runtime.sendMessage({
    type: "KEY_DOWN",
    key: {
      code: event.code,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
    },
    wasWritingNote,
    // activeTabId,
  });
});
