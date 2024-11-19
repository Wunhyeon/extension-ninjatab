// // ShortcutInput.tsx
// import React, { useEffect, useState } from "react";

// interface ShortcutInputProps {
//   closeModal: () => void;
//   onSave?: (shortcut: string) => void;
// }

// export const ShortcutInput = ({ closeModal, onSave }: ShortcutInputProps) => {
//   const [currentKeys, setCurrentKeys] = useState<string[]>([]);
//   const [recording, setRecording] = useState(false);

//   const handleKeyDown = (e: KeyboardEvent) => {
//     e.preventDefault();

//     if (!recording) {
//       setRecording(true);
//     }

//     const key = e.key.toLowerCase();

//     // Special keys mapping
//     const specialKeys: Record<string, string> = {
//       " ": "space",
//       control: "ctrl",
//       meta: "cmd",
//       arrowup: "↑",
//       arrowdown: "↓",
//       arrowleft: "←",
//       arrowright: "→",
//     };

//     // Add modifier keys first
//     const newKeys = new Set<string>();
//     if (e.ctrlKey) newKeys.add("ctrl");
//     if (e.metaKey) newKeys.add("cmd");
//     if (e.altKey) newKeys.add("alt");
//     if (e.shiftKey) newKeys.add("shift");

//     // Add the actual key if it's not a modifier
//     if (!["control", "shift", "alt", "meta"].includes(key)) {
//       newKeys.add(specialKeys[key] || key);
//     }

//     setCurrentKeys(Array.from(newKeys));
//   };

//   const handleKeyUp = (e: KeyboardEvent) => {
//     if (e.key === "Enter" && recording) {
//       const shortcut = currentKeys.join("+");
//       onSave?.(shortcut);
//       closeModal();
//     } else if (e.key === "Escape") {
//       closeModal();
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [recording]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 min-w-[300px]">
//         <h3 className="font-bold text-lg mb-4">Keyboard Shortcut</h3>
//         <div className="py-4">
//           <p className="mb-4">
//             Press desired key combination and then press ENTER.
//           </p>
//           <div className="border rounded p-3 text-center text-lg bg-gray-100">
//             {currentKeys.length > 0
//               ? currentKeys.join("+")
//               : "Listening for keypress..."}
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={closeModal}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 사용하는 컴포넌트
// const YourComponent = () => {
//   const [key, setKey] = useState("");
//   const [isShortcutInputModalOpen, setIsShortcutInputModalOpen] =
//     useState(false);

//   const handleShortcutInputOpen = () => {
//     setIsShortcutInputModalOpen(true);
//   };

//   const handleShortcutInputClose = () => {
//     setIsShortcutInputModalOpen(false);
//   };

//   const handleSave = (newShortcut: string) => {
//     setKey(newShortcut);
//     // localStorage나 chrome.storage에 저장
//     chrome.storage.local.set({ shortcut: newShortcut });
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={key}
//         onClick={handleShortcutInputOpen}
//         className="border p-2 w-full cursor-pointer"
//         placeholder="e.g., Ctrl+Shift+1"
//         readOnly
//         required
//       />

//       {isShortcutInputModalOpen && (
//         <ShortcutInput
//           closeModal={handleShortcutInputClose}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// };
