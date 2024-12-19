// import { IconTooltip } from "@/components/ui/IconTooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LAST_CLOSED,
  PLEASE_SUBSCRIBE,
  SUBSCRIBE_URL,
  UNMUTE_ALL_TAB,
  UNMUTE_CURRENT_TAB,
} from "@/lib/constant";
import { TextTooltip } from "@/components/ui/TextTooltip";
import { useUser } from "@/lib/store/user";
import { SpeakerWaveIcon } from "@/lib/svgToTs/SpeakerWaveIcon";
import { GetLastClosed } from "@/lib/type";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

export const Restore = () => {
  const user = useUser((state) => state.user);
  const [isSubscribe, setIsSubscribe] = useState<boolean>(false);
  /*
    currentClosed: {
        currentClosedTabUrl: string;
        wasWritingNote: string;
    };
    closedOtherTabsUrls: string[];
  */
  const [currentClosedTabUrl, setCurrentClosedTabUrl] =
    useState<string>(SUBSCRIBE_URL);
  const [wasWritingNote, setWasWritingNote] = useState<string>(SUBSCRIBE_URL);
  const [closedTabUrls, setClosedTabUrls] = useState<string[]>([SUBSCRIBE_URL]);

  const unmuteCurrentTab = () => {
    if (!isSubscribe) {
      alert(PLEASE_SUBSCRIBE);
      return;
    }
    chrome.runtime.sendMessage(
      { type: UNMUTE_CURRENT_TAB },
      (response: { success: boolean; message?: string }) => {
        if (response.message) {
          alert(response.message);
        }
      }
    );
  };

  const unmuteAllTab = () => {
    if (!isSubscribe) {
      alert(PLEASE_SUBSCRIBE);
      return;
    }

    chrome.runtime.sendMessage(
      { type: UNMUTE_ALL_TAB },
      (response: { success: boolean; messsage?: string }) => {
        if (response.messsage) {
          alert(response.messsage);
        }
      }
    );
  };

  useEffect(() => {
    // chrome.runtime.sendMessage({type : })
    if (
      user &&
      user.subscriptions &&
      user.subscriptions.length > 0 &&
      user.subscriptions[0].status !== "expired"
    ) {
      setIsSubscribe(true);

      chrome.runtime.sendMessage(
        { type: LAST_CLOSED },
        (response: { success: boolean; getLastClosed: GetLastClosed }) => {
          console.log("restore - last - response : ", response);
          setCurrentClosedTabUrl(
            response.getLastClosed.currentClosed?.currentClosedTabUrl
              ? response.getLastClosed.currentClosed.currentClosedTabUrl
              : ""
          );
          setWasWritingNote(
            response.getLastClosed.currentClosed?.wasWritingNote || ""
          );
          setClosedTabUrls(response.getLastClosed.closedOtherTabsUrls || []);
        }
      );
    }
  }, [user]);

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Restore</h1>
      <p>Restore by Ninja Tab</p>
      <h2 className="text-xl">
        Unmute Tab(Pro){" "}
        <TextTooltip
          triggerText={"⚡️"}
          tooltipText={
            <>
              Enable this feature by signing up for a premium account.
              <br />
              <a
                href={SUBSCRIBE_URL}
                target="_blank"
                className="text-blue-300 underline"
              >
                Subscribe
              </a>
            </>
          }
        />{" "}
      </h2>
      <div className="flex justify-around">
        {/* <IconTooltip
        icon={<SpeakerWaveIcon />}
        tooltipText={`${
          user && isSubscribe ? "Unmute Current Tab" : "Subscription Please"
        }`}
      /> */}
        <button
          className="border p-2 w-24 flex flex-col items-center rounded-lg hover:bg-zinc-100"
          onClick={() => {
            unmuteCurrentTab();
          }}
        >
          <SpeakerWaveIcon /> Current Tab
        </button>
        <button
          className="border p-2 w-24  flex flex-col items-center rounded-lg hover:bg-zinc-100"
          onClick={() => {
            unmuteAllTab();
          }}
        >
          <SpeakerWaveIcon />
          All Tab
        </button>
      </div>
      <div>
        <div>
          <h2 className="text-xl">
            {/* <TextTooltip
              triggerText="Last Closed Tab ⚡️"
              tooltipText="By Ninja Tab Keyboard Shortcut"
            /> */}
            Last Closed Tab(Pro){" "}
            <TextTooltip
              triggerText={"⚡️"}
              tooltipText={
                <>
                  Enable this feature by signing up for a premium account.
                  <br />
                  <a
                    href={SUBSCRIBE_URL}
                    target="_blank"
                    className="text-blue-300 underline"
                  >
                    Subscribe
                  </a>
                </>
              }
            />
          </h2>
          <p>Last Closed Tab By Ninja Tab Keyboard Shortcut</p>
          {/* Focussed Closed Tab */}
          <div className="p-2">
            <h3 className="text-lg">Focussed Closed Tab</h3>
            <div>
              <h4 className="text-base">URL</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  className={`
            border rounded focus:outline-none focus:ring-2 text-ellipsis flex-1
            ${user && isSubscribe ? "" : "blur-[1px]"}`}
                  value={`${
                    user && isSubscribe
                      ? currentClosedTabUrl
                      : "Please Subscribe"
                  }`}
                />
                <div className="flex gap-2">
                  <CopyButton text={currentClosedTabUrl} />

                  <a
                    target="_blank"
                    className="border rounded"
                    href={currentClosedTabUrl}
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-base">Last Edited Text</h4>
              <textarea
                readOnly
                className={`
            border rounded focus:outline-none focus:ring-2 text-ellipsis resize-none w-full
            ${user && isSubscribe ? "" : "blur-[1px]"}`}
                value={`${
                  user && isSubscribe ? wasWritingNote : "Please Subscribe"
                }`}
              />

              <CopyButton text={wasWritingNote} />
            </div>
          </div>
          {/* Closed other tabs */}
          <div className="p-2">
            <div className="flex justify-around">
              <h3 className="text-lg inline">Last Closed Other Tabs</h3>
              <button
                className="rounded border px-2"
                onClick={() => {
                  if (user && isSubscribe) {
                    for (let i = 0; i < closedTabUrls.length; i++) {
                      chrome.tabs.create({ url: closedTabUrls[i] });
                    }
                  } else {
                    chrome.tabs.create({ url: SUBSCRIBE_URL });
                  }
                }}
              >
                Open All
              </button>
            </div>
            <ScrollArea className="h-16 p-1" type="auto">
              {user && isSubscribe ? (
                closedTabUrls && closedTabUrls.length > 0 ? (
                  closedTabUrls.map((value, index) => (
                    <div key={index} className="flex gap-2 mb-1">
                      <input
                        className="border rounded focus:outline-none focus:ring-2 text-ellipsis"
                        readOnly
                        type="text"
                        value={value}
                      />
                      <CopyButton text={value} />
                      <a
                        href={value}
                        target="_blank"
                        className="border rounded"
                      >
                        Open
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2 mb-1">
                    <input
                      className="border rounded focus:outline-none focus:ring-2 text-ellipsis"
                      readOnly
                      type="text"
                      value={""}
                    />
                    <CopyButton text={SUBSCRIBE_URL} />
                    <a
                      href={SUBSCRIBE_URL}
                      target="_blank"
                      className="border rounded"
                    >
                      Open
                    </a>
                  </div>
                )
              ) : (
                <div className="flex gap-2 mb-1">
                  <input
                    className="border rounded focus:outline-none focus:ring-2 text-ellipsis"
                    readOnly
                    type="text"
                    value={"Please Subscribe"}
                  />
                  <CopyButton text={SUBSCRIBE_URL} />
                  <a
                    href={SUBSCRIBE_URL}
                    target="_blank"
                    className="border rounded"
                  >
                    Open
                  </a>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};
