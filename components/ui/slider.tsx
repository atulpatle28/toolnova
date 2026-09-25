"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Inlined Utility (Zero external dependency needed)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SliderProps extends SliderPrimitive.Root.Props {
  className?: string;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center data-horizontal:w-full data-vertical:h-full data-vertical:flex-col",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        {/* Slider Rail Track */}
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-slate-800 select-none data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
        >
          {/* Active Fill Range */}
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-emerald-500 select-none data-horizontal:h-full data-vertical:w-full transition-all"
          />
        </SliderPrimitive.Track>

        {/* Interactive Thumbs */}
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className="relative block size-4.5 shrink-0 rounded-full border-2 border-emerald-400 bg-slate-950 shadow-md shadow-emerald-500/20 transition-all select-none cursor-grab active:cursor-grabbing hover:scale-110 hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
export default Slider;