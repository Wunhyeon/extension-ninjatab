export interface Shortcut {
  key: string;
  closeThisTab: boolean;
  muteThisTab: boolean;
  moveThisTab: string;
  openTabs: string[];
}

export interface Shortcuts {
  [key: string]: Shortcut;
}

export interface ShortcutListProps {
  shortcuts: { [key: string]: Shortcut };
}
