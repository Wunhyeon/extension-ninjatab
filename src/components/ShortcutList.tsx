// import React from "react";

interface Shortcut {
  key: string;
  action: string;
  url?: string;
  urls?: string[];
}

interface ShortcutListProps {
  shortcuts: { [key: string]: Shortcut };
}

function ShortcutList({ shortcuts }: ShortcutListProps) {
  return (
    <ul className="space-y-2">
      {Object.entries(shortcuts).map(([key, shortcut]) => (
        <li key={key} className="border p-2 rounded">
          <strong>{key}:</strong> {shortcut.action} -{" "}
          {shortcut.url || shortcut.urls?.join(", ")}
        </li>
      ))}
    </ul>
  );
}

export default ShortcutList;
