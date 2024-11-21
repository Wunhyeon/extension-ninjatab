// ShortcutInput.tsx
import { useEffect, useState } from "react";
import { getShortcutKeyCombo } from "@/lib/utils";

interface ShortcutInputProps {
  closeModal: () => void;
  onSave?: (shortcut: string) => void;
  currentKeys: string[];
  setCurrentKeys: (keys: string[]) => void;
}

export const ShortcutInput = ({
  closeModal,
  //   onSave,
  currentKeys,
  setCurrentKeys,
}: ShortcutInputProps) => {
  const [recording, setRecording] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    if (!recording) {
      setRecording(true);
    }

    // code를 사용하여 실제 키 값 얻기

    const newKeys = getShortcutKeyCombo(e);

    setCurrentKeys(Array.from(newKeys));
  };

  const handleKeyUp = () => {
    // if (e.key === "Enter" && recording) {
    //   const shortcut = currentKeys.join("+");
    //   onSave?.(shortcut);
    //   closeModal();
    // } else if (e.key === "Escape") {
    //   closeModal();
    // }
  };

  const handleCancel = () => {
    setCurrentKeys([]);
    closeModal();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [recording]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-sm">
      <div className="bg-white rounded-lg p-6 min-w-[300px]">
        <h3 className="font-bold text-lg mb-4">Keyboard Shortcut</h3>
        <div className="py-4">
          <p className="mb-4">
            Press desired key combination and then press ENTER.
          </p>
          <div className="border rounded p-1 text-center text-lg bg-gray-100">
            {currentKeys.length > 0
              ? currentKeys.join("+")
              : "Listening for keypress..."}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-green-300 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
