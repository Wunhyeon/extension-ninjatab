import React from "react";
import { IconProps } from "../type";
import { cn } from "../utils";

export const ArrowRightCircleIcon: React.FC<IconProps> = ({
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
        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};
