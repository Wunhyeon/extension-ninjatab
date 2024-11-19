import { useState, useEffect } from "react";
import ShortcutList from "./components/ShortcutList";
import ShortcutForm from "./components/ShortcutForm";

interface Shortcut {
  key: string;
  action: "OPEN_URL" | "OPEN_MULTIPLE_URLS" | "CLOSE_AND_OPEN";
  url?: string;
  urls?: string[];
}

interface Shortcuts {
  [key: string]: Shortcut;
}

function App() {
  const [shortcuts, setShortcuts] = useState<Shortcuts>({});
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
      console.log("init - data : ", data);

      setShortcuts(data.shortcuts || {});
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("keydown : ", event);

      const shortcutKey = `${event.ctrlKey ? "Ctrl+" : ""}${
        event.shiftKey ? "Shift+" : ""
      }${event.key.toUpperCase()}`;
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        chrome.runtime.sendMessage({ type: "EXECUTE_SHORTCUT", shortcutKey });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);

  const handleAddShortcut = (newShortcut: Shortcut) => {
    const updatedShortcuts = { ...shortcuts, [newShortcut.key]: newShortcut };
    chrome.storage.sync.set({ shortcuts: updatedShortcuts }, () => {
      setShortcuts(updatedShortcuts);
      setIsAddingShortcut(false);
    });
  };

  return (
    <div className="p-4 w-72">
      <h1 className="text-2xl font-bold mb-4">Shortcut Manager</h1>
      <ShortcutList shortcuts={shortcuts} />
      {isAddingShortcut ? (
        <ShortcutForm
          onSave={handleAddShortcut}
          onCancel={() => setIsAddingShortcut(false)}
        />
      ) : (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsAddingShortcut(true)}
        >
          Add Shortcut
        </button>
      )}
    </div>
  );
}

export default App;
