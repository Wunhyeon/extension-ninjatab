import React, { useEffect, useState } from "react";
import { ShortcutInput } from "../components/ShortcutInput";

// import { Shortcut } from "../lib/interface";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import DynamicInputList from "../components/DynamicInputList";
import { useNavigate, useParams } from "react-router-dom";
import { Shortcuts } from "@/lib/interface";

export const Edit = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
    useState(false);
  const [currentKeys, setCurrentKeys] = useState<string[]>(
    key && key.length > 0 ? key.split("+") : []
  );
  // const [isCloseCurrentTab, setIsCloseCurrentTab] = useState<string>("true");
  const [isCloseCurrentTab, setIsCloseCurrentTab] = useState<string>("true");
  const [isMuteCurrentTab, setIsMuteCurrentTab] = useState<string>("true");
  const [moveCurrentTabUrl, setMoveCurrentTabUrl] = useState<string>("");
  const [openTabUrls, setOpenTabUrls] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.sync.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
      // console.log("init - data : ", data);
      if (!key || key === "") {
        // 이게 작동되지는 않는데, 그냥 넣어놈.
        console.log(
          "something long. 수정페이지라서 반드시 key를 params로 받아와야 함."
        );
        return (
          <div>
            <h1>Shortcut Not found</h1>
          </div>
        );
      }
      console.log("init - data.shortcuts : ", data.shortcuts);
      console.log(data.shortcuts[key]);
      // setIsCloseCurrentTab(value => {data.shortcuts[key].})
      const shortcutInfo = data.shortcuts[key];
      if (!shortcutInfo.closeCurrentTab) {
        setIsCloseCurrentTab("false");
      }
      if (!shortcutInfo.muteCurrentTab) {
        setIsMuteCurrentTab("false");
      }
      if (shortcutInfo.moveCurrentTab) {
        setMoveCurrentTabUrl(shortcutInfo.moveCurrentTab);
      }
      if (shortcutInfo.openTabs.length > 0) {
        setOpenTabUrls(shortcutInfo.openTabs);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const shortcutKey = currentKeys.join("+");
    // // 현재 탭 닫기가 트루이면 현재탭을 다른 url로 옮기는거 없게
    // if (isCloseThisTab === "true") {
    //   setMoveCurrentTabUrl("");
    // }
  };

  // ShortcutInput Modal Open
  const handleShortcutInputOpen = () => {
    setIsShortcutInputModalOpen(true);
  };

  const handleShortcutInputClose = () => {
    setIsShortcutInputModalOpen(false);
  };

  return (
    <div className="p-4 w-72">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-base">Shortcut Key:</label>
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
          <label className="block font-medium text-base">
            Close Current tab
          </label>
          {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
          <RadioGroup
            defaultValue="true"
            className="flex"
            value={isCloseCurrentTab}
            onValueChange={setIsCloseCurrentTab}
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
        {isCloseCurrentTab === "true" ? (
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
          <label className="block font-medium text-base">
            Mute Current tab
          </label>
          {/* onValueChange={setIsCloseThisTab} 이건 onValueChange={(newValue) => {setIsCloseThisTab(newValue)}} 와 같은 의미이다. */}
          <RadioGroup
            defaultValue="true"
            className="flex"
            value={isMuteCurrentTab}
            onValueChange={setIsMuteCurrentTab}
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
            onClick={() => {
              goToHome();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
