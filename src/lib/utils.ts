import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { codeToKey } from "./codeToKey";
import { Shortcuts } from "./interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getShortcutKeyCombo = (e: KeyboardEvent) => {
  e.preventDefault();

  // if (!recording) {
  //   setRecording(true);
  // }

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

// export const validateShortcut = (shortcuts: Shortcuts, shortcut: string) => {
//   return (
//     validateShortcutEmpty(shortcut) &&
//     shortcutDuplicateCheck(shortcuts, shortcut)
//   );
// };

// 단축키 입력했나 안했나(비었나, 안비었나). 입력했으면 true, 입력 안했으면 false
export const validateShortcutEmpty = (shortcut: string) => {
  if (!shortcut || shortcut === "") {
    return false;
  }
  return true;
};

// 중복확인 : 중복된게 있으면 return false. 없으면 return true
export const shortcutDuplicateCheck = (
  shortcuts: Shortcuts,
  shortcut: string
) => {
  if (shortcuts[shortcut]) {
    return false;
  }
  return true;
};

// open new tabs 빈칸확인. 빈게 있으면 return false, 없으면 return true;
export const validateOpenNewTabsEmpty = (opentabUrls: string[]) => {
  for (let i = 0; i < opentabUrls.length; i++) {
    if (!opentabUrls[i] || opentabUrls[i] === "") {
      return false;
    }
  }
  return true;
};

export const getWasWritingNote = () => {
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
  return wasWritingNote;
};
