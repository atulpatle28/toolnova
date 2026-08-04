"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
  const [currentDisplaySrc, setCurrentDisplaySrc] = useState<string | null>(imageSrc || null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const imgRef = useRef<HTMLImageElement>(null);

  // Sync prop image on upload
  useEffect(() => {
    if (imageSrc) {
      setCurrentDisplaySrc(imageSrc);
    }
  }, [imageSrc]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 85,
        },
        aspect || width / height,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  // Helper to physically bake rotation into image source
  const rotateImageSource = (degrees: number) => {
    if (!currentDisplaySrc) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = currentDisplaySrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rotRad = (degrees * Math.PI) / 180;
      const isQuarterRotated = Math.abs(degrees % 180) === 90;

      canvas.width = isQuarterRotated ? image.naturalHeight : image.naturalWidth;
      canvas.height = isQuarterRotated ? image.naturalWidth : image.naturalHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotRad);
      ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

      const rotatedDataUrl = canvas.toDataURL("image/png");
      setCurrentDisplaySrc(rotatedDataUrl);
    };
  };

  // Helper to physically flip image source
  const flipImageSource = (horizontal: boolean) => {
    if (!currentDisplaySrc) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = currentDisplaySrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
      ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

      const flippedDataUrl = canvas.toDataURL("image/png");
      setCurrentDisplaySrc(flippedDataUrl);
    };
  };

  // Direct 1:1 Crop Execution
  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current || !onApply) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const croppedDataUrl = canvas.toDataURL("image/png");
    onApply(croppedDataUrl);
  };

  if (!currentDisplaySrc) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800/80 text-slate-400 text-sm font-medium backdrop-blur-md antialiased">
        No image loaded to crop. Please upload an image first.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full font-sans antialiased">
      {/* Workspace Interactive Area */}
      <div className="relative flex-1 min-h-[500px] bg-slate-950/90 rounded-2xl border border-slate-800/80 flex items-center justify-center overflow-auto p-6 shadow-2xl backdrop-blur-xl">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          className="max-h-[480px] max-w-full rounded-xl shadow-2xl overflow-hidden"
        >
          <img
            ref={imgRef}
            src={currentDisplaySrc}
            alt="Crop Target"
            onLoad={onImageLoad}
            className="max-h-[480px] max-w-full object-contain select-none"
          />
        </ReactCrop>
      </div>

      {/* Studio Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-xl">
        
        {/* Aspect Ratio Selectors */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-[12px] font-semibold tracking-wide text-slate-300 uppercase mr-2 flex items-center gap-1.5">
            <CropIcon className="w-3.5 h-3.5 text-cyan-400" /> Ratio
          </span>
          {ASPECT_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setAspect(preset.value)}
              className={`text-[12px] font-medium tracking-tight px-3 py-1.5 rounded-lg border transition-all ${
                aspect === preset.value
                  ? "bg-cyan-950/90 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-950"
                  : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-100 hover:border-slate-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Rotation & Flip Actions */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotateImageSource(-90)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
            title="Rotate Left 90°"
          >
            <RotateLeftIcon className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotateImageSource(90)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
            title="Rotate Right 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-4 bg-slate-800/80 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => flipImageSource(true)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => flipImageSource(false)}
            className="h-7 w-7 p-0 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
            title="Flip Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Reset & Apply */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (imageSrc) setCurrentDisplaySrc(imageSrc);
            }}
            className="h-8 text-[12px] font-medium text-slate-400 hover:text-slate-100 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={handleApplyCrop}
            disabled={!completedCrop?.width || !completedCrop?.height}
            className="h-8 text-[12px] font-semibold tracking-wide bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5 px-4 shadow-lg shadow-cyan-950/50 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            Crop & Apply
          </Button>
        </div>

      </div>
    </div>
  );
}

export default CropTool;