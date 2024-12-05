import { IconTooltip } from "@/components/ui/IconTooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { TextTooltip } from "@/components/ui/TextTooltip";
import { useUser } from "@/lib/store/user";
import { SpeakerWaveIcon } from "@/lib/svgToTs/SpeakerWaveIcon";
import { GetLastClosed } from "@/lib/type";
import { useEffect, useState } from "react";

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
  const [currentClosedTabUrl, setCurrentClosedTabUrl] = useState<string>("");
  const [wasWritingNote, setWasWritingNote] = useState<string>("");
  const [closedTabUrls, setClosedTabUrls] = useState<string[]>([]);

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
        { type: "LAST" },
        (response: { success: boolean; getLastClosed: GetLastClosed }) => {
          console.log("restore - last - response : ", response);
          setCurrentClosedTabUrl(
            response.getLastClosed.currentClosed.currentClosedTabUrl
          );
          setWasWritingNote(
            response.getLastClosed.currentClosed.wasWritingNote
          );
          setClosedTabUrls(response.getLastClosed.closedOtherTabsUrls);
        }
      );
    }
  }, [user]);
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4">Restore</h1>
      <h2 className="text-xl">Unmute Current Tab(Pro) ⚡️</h2>
      <IconTooltip
        icon={<SpeakerWaveIcon />}
        tooltipText={`${
          user && isSubscribe ? "Unmute Current Tab" : "Subscription Please"
        }`}
      />
      <div>
        <div>
          <h2 className="text-xl">
            {/* <TextTooltip
              triggerText="Last Closed Tab ⚡️"
              tooltipText="By Ninja Tab Keyboard Shortcut"
            /> */}
            Last Closed Tab(Pro) ⚡️
          </h2>
          <p>Last Closed Tab By Ninja Tab Keyboard Shortcut</p>
          {/* Focussed Closed Tab */}
          <div className="p-2">
            <h3 className="text-lg">Focussed Closed Tab</h3>
            <div>
              <h4>URL</h4>
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
                  <button className="border rounded">Copy</button>
                  <button className="border rounded">Move</button>
                </div>
              </div>
            </div>
            <div>
              <h4>Last Edited Text</h4>
              <textarea
                readOnly
                className={`
            border rounded focus:outline-none focus:ring-2 text-ellipsis resize-none w-full
            ${user && isSubscribe ? "" : "blur-[1px]"}`}
                value={`${
                  user && isSubscribe ? wasWritingNote : "Please Subscribe"
                }`}
              />
              <button className="border rounded">Copy</button>
            </div>
          </div>
          {/* Closed other tabs */}
          <div className="p-2">
            <h3 className="text-xl">Last Closed Other Tabs</h3>
            <ScrollArea className="h-16 p-1" type="auto">
              {user && isSubscribe ? (
                closedTabUrls.map((value, index) => (
                  <div key={index} className="flex gap-2 mb-1">
                    <input
                      className="border rounded focus:outline-none focus:ring-2 text-ellipsis"
                      readOnly
                      type="text"
                      value={value}
                    />
                    <button className="border">Copy</button>
                    <button className="border">Move</button>
                  </div>
                ))
              ) : (
                <input type="text" value={"Please Subscribe"} />
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};
