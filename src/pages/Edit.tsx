import React, { useEffect, useState } from "react";
import { ShortcutInput } from "../components/ShortcutInput";

// import { Shortcut } from "../lib/interface";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import DynamicInputList from "../components/DynamicInputList";
import { useNavigate, useParams } from "react-router-dom";
import { Shortcuts } from "@/lib/interface";
import {
  shortcutDuplicateCheck,
  validateOpenNewTabsEmpty,
  validateShortcutEmpty,
} from "@/lib/utils";
import {
  DOMAIN_URL_MUST_START_WITH,
  EXIST_SHORTCUT_CONFIRM,
  SAVE_SHORTCUT,
  URL_MUST_START_WITH,
} from "@/lib/constant";
import { TextTooltip } from "@/components/ui/TextTooltip";

export const Edit = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };
  const [shortcuts, setShortcuts] = useState<Shortcuts>({});
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
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [isCloseOtherTabs, setIsCloseOtherTabs] = useState<string>("false");
  const [isMuteAllTabs, setIsMuteAllTabs] = useState<string>("false");
  const [closeExceptUrls, setCloseExceptUrls] = useState<string[]>([]);
  //validate
  const [isShortcutFilled, setIsShortcutFilled] = useState<boolean>(true);
  const [isOpentabUrlFilled, setIsOpentabUrlFilled] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcutKey = currentKeys.join("+");
    // 현재 탭 닫기가 트루이면 현재탭을 다른 url로 옮기는거 없게
    if (isCloseCurrentTab === "true") {
      setMoveCurrentTabUrl("");
    }
    if (!validateShortcutEmpty(shortcutKey)) {
      setIsShortcutFilled(false);
      return;
    } else {
      setIsShortcutFilled(true);
    }

    if (!validateOpenNewTabsEmpty(openTabUrls)) {
      setIsOpentabUrlFilled(false);
      return;
    } else {
      setIsOpentabUrlFilled(true);
    }

    const isDuplicated = !shortcutDuplicateCheck(shortcuts, shortcutKey);
    let duplicatedButContinue = true;
    if (key !== shortcutKey && isDuplicated) {
      duplicatedButContinue = confirm(EXIST_SHORTCUT_CONFIRM);
    }
    if (!duplicatedButContinue) {
      return;
    }
    const updatedShortcuts = {
      ...shortcuts,
      [shortcutKey]: {
        // key: shortcutKey,
        // closeCurrentTab: isCloseCurrentTab === "true",
        // muteCurrentTab: isMuteCurrentTab === "true",
        // moveCurrentTab: isCloseCurrentTab === "true" ? "" : moveCurrentTabUrl,
        // openTabs: openTabUrls,
        key: shortcutKey,
        closeCurrentTab: isCloseCurrentTab === "true",
        muteCurrentTab: isMuteCurrentTab === "true",
        moveCurrentTab: isCloseCurrentTab === "true" ? "" : moveCurrentTabUrl,
        openTabs: openTabUrls,
        closeOtherTabs: isCloseOtherTabs === "true",
        closeOtherExceptUrl: isCloseOtherTabs === "true" ? closeExceptUrls : [],
        muteAllTabs: isMuteAllTabs === "true",
      },
    };

    let finalShortcuts = { ...updatedShortcuts };
    if (key !== shortcutKey) {
      const { [key!]: removedKey, ...rest } = finalShortcuts;
      finalShortcuts = rest;
    }

    chrome.runtime
      .sendMessage({
        type: SAVE_SHORTCUT,
        shortcuts: finalShortcuts,
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log("error : ", error);
        alert("Something wrong. please try again");
      });
  };

  // ShortcutInput Modal Open
  const handleShortcutInputOpen = () => {
    setIsShortcutInputModalOpen(true);
  };

  const handleShortcutInputClose = () => {
    setIsShortcutInputModalOpen(false);
  };

  useEffect(() => {
    chrome.storage.local.get("shortcuts", (data: { shortcuts: Shortcuts }) => {
      // console.log("init - data : ", data);
      setShortcuts(data.shortcuts || {});
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
      if (shortcutInfo.openTabs && shortcutInfo.openTabs.length > 0) {
        setOpenTabUrls(shortcutInfo.openTabs);
      }
      if (shortcutInfo.closeOtherTabs) {
        setIsCloseOtherTabs("true");
      }
      if (
        shortcutInfo.closeOtherExceptUrl &&
        shortcutInfo.closeOtherExceptUrl.length > 0
      ) {
        setCloseExceptUrls(shortcutInfo.closeOtherExceptUrl);
      }
      if (shortcutInfo.muteAllTabs) {
        setIsMuteAllTabs("true");
      }
    });
  }, []);

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

  return (
    <div className="p-4">
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
            isInputDomain={false}
          />
        </div>
        {/* Open New Tabs -------------- */}
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
                  <TextTooltip
                    className="underline"
                    triggerText="Domain"
                    tooltipText={`Domain is a origin name. ex) In https://google.com/path?search=1
                  Domain is https://google.com
                  `}
                  />{" "}
                  to exclude
                </label>
                <p>{DOMAIN_URL_MUST_START_WITH}</p>
                {/* validate */}
                {!isOpentabUrlFilled && (
                  <p className="text-red-500">
                    Please do not leave the Domain URL input field empty.
                  </p>
                )}
                <DynamicInputList
                  stringArr={closeExceptUrls}
                  setStringArr={setCloseExceptUrls}
                  isInputDomain={true}
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
            onClick={() => {
              // shortcuts
              console.log("shortcuts : ", shortcuts);
            }}
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
