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
      <path d="M10 12.6l.7.7 1.6-1.6 1.6 1.6.8-.7L13 11l1.7-1.6-.8-.8-1.6 1.7-1.6-1.7-.7.8 1.6 1.6-1.6 1.6zM1 4h14V3H1v1zm0 3h14V6H1v1zm8 2.5V9H1v1h8v-.5zM9 13v-1H1v1h8z" />
    </svg>

    // <svg
    //   width="800px"
    //   height="800px"
    //   viewBox="0 0 16 16"
    //   xmlns="http://www.w3.org/2000/svg"
    //   fill="#000000"
    // >
    //   <path d="M10 12.6l.7.7 1.6-1.6 1.6 1.6.8-.7L13 11l1.7-1.6-.8-.8-1.6 1.7-1.6-1.7-.7.8 1.6 1.6-1.6 1.6zM1 4h14V3H1v1zm0 3h14V6H1v1zm8 2.5V9H1v1h8v-.5zM9 13v-1H1v1h8z" />
    // </svg>
  );
};
