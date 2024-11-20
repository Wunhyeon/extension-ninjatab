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
import DynamicInputList from "./DynamicInputList";
interface ShortcutFormProps {
  onSave: (shortcut: Shortcut) => void;
  onCancel: () => void;
}

function ShortcutForm({ onSave, onCancel }: ShortcutFormProps) {
  const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
    useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const [isCloseThisTab, setIsCloseThisTab] = useState<string>("true");
  const [isMuteThisTab, setIsMuteThisTab] = useState<string>("true");
  const [moveCurrentTabUrl, setMoveCurrentTabUrl] = useState<string>("");
  const [openTabUrls, setOpenTabUrls] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcutKey = currentKeys.join("+");
    // 현재 탭 닫기가 트루이면 현재탭을 다른 url로 옮기는거 없게
    if (isCloseThisTab === "true") {
      setMoveCurrentTabUrl("");
    }
    onSave({
      key: shortcutKey,
      closeCurrentTab: isCloseThisTab === "true",
      muteCurrentTab: isMuteThisTab === "true",
      moveCurrentTab: isCloseThisTab === "true" ? "" : moveCurrentTabUrl,
      openTabs: openTabUrls,
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
      {/* Close Current Tab ----------- */}
      <div>
        <label className="block font-medium text-base">Close Current tab</label>
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
      {/* Close Current Tab ----------------- */}
      {/* Move Current Tab */}
      {isCloseThisTab === "true" ? (
        <></>
      ) : (
        <div>
          <label className="block font-medium text-base">
            Move Current Tab To
          </label>
          <span>
            If you do not wish to move, please leave this field blank.
          </span>
          <input
            type="url"
            value={moveCurrentTabUrl}
            onChange={(e) => {
              setMoveCurrentTabUrl(e.target.value);
            }}
            className="border p-2 w-full"
          />
        </div>
      )}
      {/* Mute Current Tab ---------------- */}
      <div>
        <label className="block font-medium text-base">Mute Current tab</label>
        {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
        <RadioGroup
          defaultValue="true"
          className="flex"
          value={isMuteThisTab}
          onValueChange={setIsMuteThisTab}
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
      {/* Mute Current Tab ---------------- */}
      {/* Open New Tabs ------------------ */}
      <div>
        <label className="block font-medium text-base">Open New Tabs</label>
        <DynamicInputList
          stringArr={openTabUrls}
          setStringArr={setOpenTabUrls}
        />
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
