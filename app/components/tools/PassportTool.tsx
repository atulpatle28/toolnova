"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Sparkles, Scissors, UserCheck, RefreshCw } from "lucide-react";

export interface PassportToolProps {
  imageSrc: string;
  onApply: (processedImageDataUrl: string) => void;
}

const PASSPORT_SIZES = [
  { id: "in-passport", label: "India Passport (35x45 mm)", ratio: 35 / 45 },
  { id: "us-visa", label: "US Visa / Passport (2x2 in)", ratio: 1 },
  { id: "custom", label: "Standard 3:4 Portrait", ratio: 3 / 4 },
];

const BACKGROUND_COLORS = [
  { id: "white", name: "Official White", value: "#FFFFFF" },
  { id: "light-blue", name: "Passport Blue", value: "#00A2E8" },
  { id: "grey", name: "Neutral Grey", value: "#E0E0E0" },
  { id: "dark-blue", name: "Navy Blue", value: "#002060" },
];

export function PassportTool({ imageSrc, onApply }: PassportToolProps) {
  const [selectedSize, setSelectedSize] = useState(PASSPORT_SIZES[0]);
  const [bgColor, setBgColor] = useState(BACKGROUND_COLORS[0].value);
  const [isCleaning, setIsCleaning] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processPassportPhoto = () => {
    setIsCleaning(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = 600;
      canvas.height = Math.round(600 / selectedSize.ratio);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgAspect = img.width / img.height;
      const targetAspect = selectedSize.ratio;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > targetAspect) {
        drawWidth = canvas.height * imgAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const dataUrl = canvas.toDataURL("image/png");
      setProcessedImage(dataUrl);
      setIsCleaning(false);
    };
  };

  useEffect(() => {
    processPassportPhoto();
  }, [selectedSize, bgColor, imageSrc]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-2">
      <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-950/80 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
        <div className="relative flex items-center justify-center max-h-[480px] aspect-[35/45] border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-2xl">
          {processedImage ? (
            <img
              src={processedImage}
              alt="Passport Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-500 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
            </div>
          )}

          <div className="absolute inset-x-8 top-12 bottom-20 border-2 border-dashed border-cyan-400/40 rounded-[50%] pointer-events-none flex items-center justify-center">
            <span className="text-[10px] text-cyan-400/60 bg-slate-950/80 px-2 py-0.5 rounded">
              Position Face Inside Frame
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          Standard passport framing applied automatically.
        </p>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Passport Maker Pro</h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">1. Select Photo Size</label>
            <div className="space-y-1.5">
              {PASSPORT_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                    selectedSize.id === size.id
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">2. Background Color</label>
            <div className="grid grid-cols-2 gap-2">
              {BACKGROUND_COLORS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgColor(bg.value)}
                  className={`flex items-center space-x-2 text-xs px-3 py-2 rounded-lg border transition-all ${
                    bgColor === bg.value
                      ? "border-cyan-500 bg-slate-950 text-white"
                      : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-600"
                    style={{ backgroundColor: bg.value }}
                  />
                  <span>{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            if (processedImage) onApply(processedImage);
          }}
          disabled={!processedImage || isCleaning}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs py-2.5 gap-2 shadow-lg shadow-cyan-950"
        >
          <Scissors className="w-4 h-4" />
          Apply Passport Photo
        </Button>
      </div>
    </div>
  );
}

export default PassportTool;