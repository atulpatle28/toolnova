"use client";

import React from "react";
import { Button } from "@/app/components/ui/Button";
import { RotateCcw, Sliders } from "lucide-react";

export interface AdjustmentValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentValues = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hue: 0,
};

export interface AdjustPanelProps {
  adjustments: AdjustmentValues;
  onChange: (newAdjustments: AdjustmentValues) => void;
  onReset: () => void;
}

export default function AdjustPanel({ adjustments, onChange, onReset }: AdjustPanelProps) {
  const handleSliderChange = (key: keyof AdjustmentValues, value: number) => {
    onChange({ ...adjustments, [key]: value });
  };

  const sliders = [
    { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
    { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
    { key: "saturation", label: "Saturation", min: 0, max: 200, unit: "%" },
    { key: "blur", label: "Blur", min: 0, max: 10, unit: "px" },
    { key: "hue", label: "Hue Rotate", min: 0, max: 360, unit: "deg" },
  ] as const;

  return (
    <div className="flex flex-col gap-4 p-4 h-full text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Adjustments</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-[11px] text-slate-400 hover:text-white gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </Button>
      </div>

      <div className="space-y-4">
        {sliders.map((s) => (
          <div key={s.key} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>{s.label}</span>
              <span className="font-mono text-cyan-400">
                {adjustments[s.key]}
                {s.unit}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={adjustments[s.key]}
              onChange={(e) => handleSliderChange(s.key, parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}