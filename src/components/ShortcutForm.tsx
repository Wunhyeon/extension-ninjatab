import React, { useState } from "react";
import { ShortcutInput } from "./ShortcutInput";
// import { ShortcutInput } from "./ShortcutInput";

interface Shortcut {
  key: string;
  action: "OPEN_URL" | "OPEN_MULTIPLE_URLS" | "CLOSE_AND_OPEN";
  url?: string;
  urls?: string[];
}

interface ShortcutFormProps {
  onSave: (shortcut: Shortcut) => void;
  onCancel: () => void;
}

function ShortcutForm({ onSave, onCancel }: ShortcutFormProps) {
  const [key, _setKey] = useState("");
  const [action, setAction] = useState<Shortcut["action"]>("OPEN_URL");
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState("");

  const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
    useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      key,
      action,
      url: action === "OPEN_MULTIPLE_URLS" ? undefined : url,
      urls:
        action === "OPEN_MULTIPLE_URLS"
          ? urls.split(",").map((u) => u.trim())
          : undefined,
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
        <label className="block">Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as Shortcut["action"])}
          className="border p-2 w-full"
        >
          <option value="OPEN_URL">Open URL</option>
          <option value="OPEN_MULTIPLE_URLS">Open Multiple URLs</option>
          <option value="CLOSE_AND_OPEN">Close Current and Open URL(s)</option>
        </select>
      </div>
      {action !== "OPEN_MULTIPLE_URLS" ? (
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
      )}

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
