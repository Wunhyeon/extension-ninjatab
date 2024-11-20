// import React from "react";

import { MuteIcon } from "@/lib/svgToTs/MuteIcon";
import { ShortcutListProps } from "../lib/interface";
import { IconTooltip } from "./ui/IconTooltip";
import { XCircleIcon } from "@/lib/svgToTs/XCircleIcon";
import { ArrowRightCircleIcon } from "@/lib/svgToTs/ArrowRightCircleIcon";
import { FolderPlusIcon } from "@/lib/svgToTs/FolderPlusIcon";

function ShortcutList({ shortcuts }: ShortcutListProps) {
  return (
    <ul className="space-y-2">
      {Object.entries(shortcuts).map(([key, shortcut]) => (
        <li key={key} className="border p-2 rounded flex items-center gap-2">
          <strong className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {key}
          </strong>
          {" : "}
          {/* Close This Tab Icon */}
          {shortcut.closeCurrentTab ? (
            <IconTooltip
              icon={<XCircleIcon />}
              tooltipText="Close Current Tab"
            />
          ) : (
            <></>
          )}
          {/* Move Current Tab Icon */}
          {shortcut.moveCurrentTab ? (
            <IconTooltip
              icon={<ArrowRightCircleIcon />}
              tooltipText={`Move current Tab : 
                ${shortcut.moveCurrentTab}
                `}
            />
          ) : (
            <></>
          )}
          {/* Mute This Tab Icon */}
          {shortcut.muteCurrentTab ? (
            <IconTooltip icon={<MuteIcon />} tooltipText="Mute Current Tab" />
          ) : (
            <></>
          )}
          {/* Open Tabs */}
          {shortcut.openTabs.length > 0 ? (
            <IconTooltip
              icon={<FolderPlusIcon />}
              tooltipText={`${shortcut.openTabs.join(", ")}`}
            />
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ShortcutList;
