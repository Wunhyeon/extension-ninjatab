import { useState, useEffect } from "react";
import ShortcutList from "../components/ShortcutList";
import ShortcutForm from "../components/ShortcutForm";
import { Shortcut, Shortcuts } from "../lib/interface";
import { getShortcutKeyCombo, shortcutDuplicateCheck } from "../lib/utils";
import { EXIST_SHORTCUT_CONFIRM, SAVE_SHORTCUT } from "@/lib/constant";

function Home() {
  const [shortcuts, setShortcuts] = useState<Shortcuts>({});
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
      // console.log("init - data : ", data);

      setShortcuts(data.shortcuts || {});
      console.log("init - data.shortcuts : ", data.shortcuts);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("keydown : ", event);
      // 현재 활성 요소를 가져옴
      const activeElement = document.activeElement;

      // // 입력 필드에서 발생한 이벤트는 무시. 어차피 popup에서만 적용되기때문에 괜춘할듯
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        return;
      }

      const shortcutKey = getShortcutKeyCombo(event).join("+");
      if (shortcuts && shortcuts[shortcutKey]) {
        event.preventDefault();
        console.log("shortcut 발동!");

        chrome.runtime.sendMessage({
          type: "EXECUTE_SHORTCUT",
          shortcut: shortcuts[shortcutKey],
        });
      } else {
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);

  const handleAddShortcut = (newShortcut: Shortcut) => {
    const updatedShortcuts = { ...shortcuts, [newShortcut.key]: newShortcut };
    console.log("updatedShortcuts : ", updatedShortcuts);

    // chrome.storage.sync.set({ shortcuts: updatedShortcuts }, () => {
    //   setShortcuts(updatedShortcuts);
    //   setIsAddingShortcut(false);
    // });

    // validateShortcutEmpty(newShortcut.key)
    const isDuplicated = !shortcutDuplicateCheck(shortcuts, newShortcut.key);
    let duplicatedButContinue = true;
    if (isDuplicated) {
      duplicatedButContinue = confirm(EXIST_SHORTCUT_CONFIRM);
    }
    if (!duplicatedButContinue) {
      return;
    }

    chrome.runtime.sendMessage({
      type: SAVE_SHORTCUT,
      shortcuts: updatedShortcuts,
    });
    setShortcuts(updatedShortcuts);
    setIsAddingShortcut(false);
  };

  return (
    <div className="p-4 w-96">
      <h1 className="text-2xl font-bold mb-4">Shortcut Manager</h1>

      {isAddingShortcut ? (
        <ShortcutForm
          onSave={handleAddShortcut}
          onCancel={() => setIsAddingShortcut(false)}
        />
      ) : (
        <div>
          <ShortcutList shortcuts={shortcuts} setShortcuts={setShortcuts} />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsAddingShortcut(true)}
          >
            Add Shortcut
          </button>
          <button
            onClick={() => {
              chrome.runtime.sendMessage({ type: "LOGIN" });
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
