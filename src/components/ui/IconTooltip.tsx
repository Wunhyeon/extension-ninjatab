import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface IconTooltipProps {
  icon: React.ReactNode;
  tooltipText: string;
  className?: string;
  delayDuration?: number;
}

export const IconTooltip = ({
  icon,
  tooltipText,
  delayDuration = 100,
  className,
}: IconTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("inline-block border rounded-full", className)}>
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="truncate">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
