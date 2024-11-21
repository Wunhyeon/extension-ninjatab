import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { codeToKey } from "./codeToKey";

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
