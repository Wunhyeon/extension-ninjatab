// import React from "react";

import { ShortcutListProps } from "../lib/interface";

function ShortcutList({ shortcuts }: ShortcutListProps) {
  return (
    <ul className="space-y-2">
      {Object.entries(shortcuts).map(([key, shortcut]) => (
        <li key={key} className="border p-2 rounded">
          <strong className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {key}
          </strong>
          {": "}
          {shortcut.closeThisTab ? <span>Close This Tab</span> : <></>}
        </li>
      ))}
    </ul>
  );
}

export default ShortcutList;
