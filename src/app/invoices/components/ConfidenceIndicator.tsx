"use client"

import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

interface ConfidenceIndicatorProps {
  value: number
}

// Confidence indicator component to show confidence levels
export function ConfidenceIndicator({ value }: ConfidenceIndicatorProps) {
  // Determine color based on confidence value
  const getColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getColor(value)} rounded-full`} 
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{value}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nível de confiança: {value}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}