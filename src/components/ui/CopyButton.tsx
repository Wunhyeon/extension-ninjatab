import { cn } from "@/lib/utils";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

export const CopyButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [copyState, setCopyButtonState] = useState<"default" | "copied">(
    "default"
  );

  const handleCopy = () => {
    setCopyButtonState("copied");
    setTimeout(() => {
      setCopyButtonState("default");
    }, 2000);
  };

  const copyButtonText = copyState === "default" ? "Copy" : "Copied!";
  const copyButtonClass =
    copyState === "default" ? "bg-zinc-100" : "bg-green-500 text-white";
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        handleCopy();
      }}
    >
      <button className={cn("border rounded w-14", copyButtonClass, className)}>
        {copyButtonText}
      </button>
    </CopyToClipboard>
  );
};
