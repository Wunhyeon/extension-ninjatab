export interface Shortcut {
  key: string;
  closeCurrentTab: boolean;
  muteCurrentTab: boolean;
  moveCurrentTab: string;
  openTabs: string[];
}

export interface Shortcuts {
  [key: string]: Shortcut;
}

export interface ShortcutListProps {
  shortcuts: { [key: string]: Shortcut };
}
