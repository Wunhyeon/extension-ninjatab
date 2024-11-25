// import React from "react";

import { MuteIcon } from "@/lib/svgToTs/MuteIcon";
import { ShortcutListProps } from "../lib/interface";
import { IconTooltip } from "./ui/IconTooltip";
import { XCircleIcon } from "@/lib/svgToTs/XCircleIcon";
import { ArrowRightCircleIcon } from "@/lib/svgToTs/ArrowRightCircleIcon";
import { FolderPlusIcon } from "@/lib/svgToTs/FolderPlusIcon";
import { useNavigate } from "react-router-dom";
import { CogwheelIcon } from "@/lib/svgToTs/Cogwheellcon";
import { TrashIcon } from "@/lib/svgToTs/TrashIcon";

function ShortcutList({ shortcuts }: ShortcutListProps) {
  const navigate = useNavigate();

  return (
    <ul className="space-y-2">
      {Object.entries(shortcuts).map(([key, shortcut]) => (
        <li
          key={key}
          className="border p-2 rounded flex flex-wrap items-center gap-2"
        >
          <strong className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {key}
          </strong>
          {" : "}
          <div className="flex gap-2">
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
          </div>
          {/* Buttons (Aligned to the Right) */}
          <div className="ml-auto flex gap-2">
            <button
              className="bg-gray-100 text-gray-700 border p-1   rounded-full hover:bg-gray-200"
              onClick={() => navigate(`/edit/${key}`)}
            >
              <CogwheelIcon />
            </button>
            <button className="bg-red-100 text-red-700 border p-1  rounded-full hover:bg-red-200">
              <TrashIcon />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ShortcutList;
