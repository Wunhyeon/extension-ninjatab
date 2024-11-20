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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
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
  const [isCloseThisTab, setIsCloseThisTab] = useState<string>("true");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcutKey = currentKeys.join("+");
    onSave({
      key: shortcutKey,
      closeThisTab: isCloseThisTab === "true",
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
        {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
        <RadioGroup
          defaultValue="true"
          className="flex"
          value={isCloseThisTab}
          onValueChange={setIsCloseThisTab}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="r1" />
            <Label htmlFor="r1" className="font-normal">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="r2" />
            <Label htmlFor="r2" className="font-normal">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>
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
