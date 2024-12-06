import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface TextTooltipProps {
  triggerText: React.ReactNode;
  tooltipText: React.ReactNode;
  className?: string;
  delayDuration?: number;
}

export const TextTooltip = ({
  triggerText,
  tooltipText,
  delayDuration = 100,
  className,
}: TextTooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("font-bold", className)}>{triggerText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="truncate">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
