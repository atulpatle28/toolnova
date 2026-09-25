"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Inlined Utility (Zero external dependency needed)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SeparatorProps extends SeparatorPrimitive.Props {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-slate-800/80 transition-colors",
        orientation === "horizontal"
          ? "h-px w-full data-horizontal:h-px data-horizontal:w-full"
          : "w-px self-stretch data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
export default Separator;