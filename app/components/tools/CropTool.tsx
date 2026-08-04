"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import {
  Check,
  RotateCcw,
  Crop as CropIcon,
  RotateCw,
  RotateCcw as RotateLeftIcon,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";

export interface CropToolProps {
  imageSrc?: string | null;
  onApply?: (croppedDataUrl: string) => void;
}

const ASPECT_PRESETS = [
  { label: "Freeform", value: undefined },
  { label: "1:1 Square", value: 1 },
  { label: "16:9 Landscape", value: 16 / 9 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "3:4 Portrait", value: 3 / 4 },
];

export function CropTool({ imageSrc, onApply }: CropToolProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(imageSrc || null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    if (imageSrc) {
      setCurrentImageSrc(imageSrc);
      setCropRect(null);
    }
  }, [imageSrc]);

  // Load and Draw Image on Interactive Canvas
  useEffect(() => {
    if (!currentImageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Default crop selection (80% box in center)
      if (!cropRect) {
        const defaultW = img.width * 0.8;
        const defaultH = aspect ? defaultW / aspect : img.height * 0.8;
        const defaultX = (img.width - defaultW) / 2;
        const defaultY = (img.height - defaultH) / 2;
        setCropRect({ x: defaultX, y: defaultY, w: defaultW, h: defaultH });
      }
    };
  }, [currentImageSrc]);

  // Redraw Selection Box over Image
  const redrawCanvas = () => {
    if (!currentImageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImageSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (cropRect) {
        // Darken outside selection
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clear selection area (Bright image preview)
        ctx.clearRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
        ctx.drawImage(
          img,
          cropRect.x, cropRect.y, cropRect.w, cropRect.h,
          cropRect.x, cropRect.y, cropRect.w, cropRect.h
        );

        // Selection Border
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = Math.max(2, canvas.width / 300);
        ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      }
    };
  };

  useEffect(() => {
    redrawCanvas();
  }, [cropRect]);

  // Physical Rotate Execution on Canvas Source
  const rotateImage = (degrees: number) => {
    if (!currentImageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isQuarterRotated = Math.abs(degrees % 180) === 90;
      canvas.width = isQuarterRotated ? img.height : img.width;
      canvas.height = isQuarterRotated ? img.width : img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedUrl = canvas.toDataURL("image/png");
      setCropRect(null); // Reset selection box for new rotation bounds
      setCurrentImageSrc(rotatedUrl);
    };
  };

  // Physical Flip Execution
  const flipImage = (horizontal: boolean) => {
    if (!currentImageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const flippedUrl = canvas.toDataURL("image/png");
      setCropRect(null);
      setCurrentImageSrc(flippedUrl);
    };
  };

  // Crop & Export Selection
  const handleApplyCrop = () => {
    if (!cropRect || !currentImageSrc || !onApply) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = cropRect.w;
      canvas.height = cropRect.h;

      ctx.drawImage(
        img,
        cropRect.x, cropRect.y, cropRect.w, cropRect.h,
        0, 0, cropRect.w, cropRect.h
      );

      onApply(canvas.toDataURL("image/png"));
    };
  };

  // Mouse Drag Selection Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    isDragging.current = true;
    startPos.current = { x: mouseX, y: mouseY };
    setCropRect({ x: mouseX, y: mouseY, w: 10, h: 10 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    let width = currentX - startPos.current.x;
    let height = aspect ? width / aspect : currentY - startPos.current.y;

    setCropRect({
      x: width < 0 ? currentX : startPos.current.x,
      y: height < 0 ? currentY : startPos.current.y,
      w: Math.abs(width),
      h: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  if (!currentImageSrc) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
        No image loaded to crop.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full font-sans antialiased">
      {/* Workspace Display */}
      <div className="relative flex-1 min-h-[500px] bg-slate-950/90 rounded-2xl border border-slate-800/80 flex items-center justify-center p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="max-h-[480px] max-w-full object-contain cursor-crosshair rounded-lg border border-slate-800"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-[12px] font-semibold text-slate-300 uppercase mr-2 flex items-center gap-1.5">
            <CropIcon className="w-3.5 h-3.5 text-cyan-400" /> Ratio
          </span>
          {ASPECT_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setAspect(preset.value);
                setCropRect(null);
              }}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
                aspect === preset.value
                  ? "bg-cyan-950 border-cyan-500 text-cyan-200"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotateImage(-90)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400"
          >
            <RotateLeftIcon className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotateImage(90)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => flipImage(true)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => flipImage(false)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (imageSrc) {
                setCurrentImageSrc(imageSrc);
                setCropRect(null);
              }
            }}
            className="h-8 text-[12px] text-slate-400 hover:text-white gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleApplyCrop}
            disabled={!cropRect}
            className="h-8 text-[12px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 px-4"
          >
            <Check className="w-3.5 h-3.5" /> Crop & Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CropTool;