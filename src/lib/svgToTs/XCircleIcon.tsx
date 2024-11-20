import React from "react";
import { IconProps } from "../type";
import { cn } from "../utils";

export const XCircleIcon: React.FC<IconProps> = ({
  className = "size-6",
  strokeWidth = 1.5,
  strokeColor = "currentColor",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke={strokeColor}
      className={cn("size-6", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
};
