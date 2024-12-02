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
import { validateOpenNewTabsEmpty, validateShortcutEmpty } from "@/lib/utils";
import { URL_MUST_START_WITH } from "@/lib/constant";
interface ShortcutFormProps {
  onSave: (shortcut: Shortcut) => void;
  onCancel: () => void;
}

function ShortcutForm({ onSave, onCancel }: ShortcutFormProps) {
  const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
    useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>([]);
  const [isCloseThisTab, setIsCloseThisTab] = useState<string>("true");
  const [isCloseOtherTabs, setIsCloseOtherTabs] = useState<string>("false");
  const [isMuteThisTab, setIsMuteThisTab] = useState<string>("true");
  const [isMuteAllTabs, setIsMuteAllTabs] = useState<string>("false");
  const [moveCurrentTabUrl, setMoveCurrentTabUrl] = useState<string>("");
  const [openTabUrls, setOpenTabUrls] = useState<string[]>([]);
  const [closeExceptUrls, setCloseExceptUrls] = useState<string[]>([]);
  const [isExpand, setIsExpand] = useState<boolean>(false);
  // validate
  const [isShortcutFilled, setIsShortcutFilled] = useState<boolean>(true);
  const [isOpentabUrlFilled, setIsOpentabUrlFilled] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcutKey = currentKeys.join("+");

    if (!validateShortcutEmpty(shortcutKey)) {
      setIsShortcutFilled(false);
      return;
    } else {
      setIsShortcutFilled(true);
    }
    console.log(
      "validateOpenNewTabsEmpty(openTabUrls) : ",
      validateOpenNewTabsEmpty(openTabUrls)
    );

    if (!validateOpenNewTabsEmpty(openTabUrls)) {
      setIsOpentabUrlFilled(false);
      return;
    } else {
      setIsOpentabUrlFilled(true);
    }

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
      closeOtherTabs: isCloseOtherTabs === "true", // 임시
      closeOtherExceptUrl: closeExceptUrls,
      muteAllTabs: isMuteAllTabs === "true",
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
        <label className="block font-medium text-base">➤ Shortcut Key:</label>
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
        {/* validate filled */}
        {!isShortcutFilled && (
          <p className="text-red-500">Please Fill the Shortcut</p>
        )}
      </div>
      {/* Close Current Tab ----------- */}
      <div>
        <label className="block font-medium text-base">
          ➤ Close Current tab
        </label>
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
        <div className="px-4">
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
            placeholder={URL_MUST_START_WITH}
          />
        </div>
      )}

      {/* Mute Current Tab ---------------- */}
      <div>
        <label className="block font-medium text-base">
          ➤ Mute Current tab
        </label>
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
        <label className="block font-medium text-base">➤ Open New Tabs</label>
        <p>{URL_MUST_START_WITH}</p>
        {/* validate */}
        {!isOpentabUrlFilled && (
          <p className="text-red-500">
            Please do not leave the URL input field empty.
          </p>
        )}
        <DynamicInputList
          stringArr={openTabUrls}
          setStringArr={setOpenTabUrls}
        />
      </div>
      {/* Open New Tabs ------------ */}
      {!isExpand ? (
        <p className="cursor-pointer" onClick={() => setIsExpand(true)}>
          See More Feature...
        </p>
      ) : (
        <>
          {/* Close Other Tabs ----------- */}
          <div>
            <label className="block font-medium text-base">
              ➤ Close other tabs (Other than the current tab)
            </label>
            {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
            <RadioGroup
              defaultValue="true"
              className="flex"
              value={isCloseOtherTabs}
              onValueChange={setIsCloseOtherTabs}
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
          {isCloseOtherTabs === "true" ? (
            <div className="px-4">
              <label className="block font-medium text-base">
                URL to exclude
              </label>
              <p>{URL_MUST_START_WITH}</p>
              {/* validate */}
              {!isOpentabUrlFilled && (
                <p className="text-red-500">
                  Please do not leave the URL input field empty.
                </p>
              )}
              <DynamicInputList
                stringArr={closeExceptUrls}
                setStringArr={setCloseExceptUrls}
              />
            </div>
          ) : (
            <></>
          )}
          {/* Close Other Tabs ----------------- */}
          {/* Mute Current Tab ---------------- */}
          <div>
            <label className="block font-medium text-base">
              ➤ Mute All tab
            </label>
            {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
            <RadioGroup
              defaultValue="true"
              className="flex"
              value={isMuteAllTabs}
              onValueChange={setIsMuteAllTabs}
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
          <p className="cursor-pointer" onClick={() => setIsExpand(false)}>
            See Less Feature
          </p>
        </>
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
