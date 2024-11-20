/*
const dir = {
  closeChrone : false,
  closeThisTab : false,
  muteThisTab : false,
  moveThisTab : 'https://url.com',
  openTab : 'https://1.com','https://2.com'
}
*/

import React, { useState } from "react";
import { ShortcutInput } from "./ShortcutInput";

import { Shortcut } from "../lib/interface";
// import { ShortcutInput } from "./ShortcutInput";

// const dir = {
//   closeChrone : false,
//   closeThisTab : false,
//   muteThisTab : false,
//   moveThisTab : 'https://url.com',
//   openTab : 'https://1.com','https://2.com'
// }

interface ShortcutFormProps {
  onSave: (shortcut: Shortcut) => void;
  onCancel: () => void;
}

function ShortcutForm({ onSave, onCancel }: ShortcutFormProps) {
  const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
    useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  // const [isCloseThisTab, setIsCloseThisTab] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcutKey = currentKeys.join("+");
    onSave({
      key: shortcutKey,
      closeThisTab: false,
      muteThisTab: false,
      moveThisTab: "",
      openTabs: [],
    });
  };

  // ShortcutInput Modal Open
  const handleShortcutInputOpen = () => {
    setIsShortcutInputModalOpen(true);
  };

  const handleShortcutInputClose = () => {
    setIsShortcutInputModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Shortcut Key:</label>
        <input
          type="text"
          value={
            currentKeys.length > 0
              ? currentKeys.join("+")
              : "Listening for keypress..."
          }
          onClick={() => {
            handleShortcutInputOpen();
          }}
          className="border p-2 w-full"
          placeholder="e.g., Ctrl+Shift+1"
          readOnly={true}
          required
        />
        {/* Modal Start -----*/}
        {isShortcutInputModalOpen && (
          <ShortcutInput
            closeModal={handleShortcutInputClose}
            currentKeys={currentKeys}
            setCurrentKeys={setCurrentKeys}
            // onSave={handleSave}
          />
        )}
        {/* Modal end ------ */}
      </div>
      <div>
        <label className="block">Close Current tab</label>
      </div>
      {/* {action !== "OPEN_MULTIPLE_URLS" ? (
        <div>
          <label className="block">URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block">URLs (comma-separated):</label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
      )} */}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ShortcutForm;
