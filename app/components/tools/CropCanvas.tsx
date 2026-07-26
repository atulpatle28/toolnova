"use client";

import React, { useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  Cropper,
  CropperRef,
  RectangleStencil,
  CircleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Square,
  Circle,
  RefreshCw,
  Check,
  Ratio,
} from "lucide-react";

// Aspect Ratio Preset Definition
export interface AspectRatioOption {
  label: string;
  value: number | null; // null for Free form
  icon?: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: "Free", value: null },
  { label: "1:1 Square", value: 1 / 1 },
  { label: "16:9 Landscape", value: 16 / 9 },
  { label: "9:16 Portrait", value: 9 / 16 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "3:2 Classic", value: 3 / 2 },
  { label: "2:3 Vertical", value: 2 / 3 },
];

export interface CropCanvasRef {
  getCroppedCanvas: () => HTMLCanvasElement | null;
  getCroppedDataUrl: () => string | null;
  reset: () => void;
  rotate: (angle: number) => void;
  flip: (horizontal: boolean, vertical: boolean) => void;
  zoom: (factor: number) => void;
}

export interface CropCanvasProps {
  imageSrc: string;
  onCropApply?: (croppedDataUrl: string, croppedCanvas: HTMLCanvasElement) => void;
  onCancel?: () => void;
  className?: string;
}

export const CropCanvas = forwardRef<CropCanvasRef, CropCanvasProps>(
  ({ imageSrc, onCropApply, onCancel, className = "" }, ref) => {
    const cropperRef = useRef<CropperRef>(null);

    // Crop State Management
    const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
    const [stencilType, setStencilType] = useState<"rectangle" | "circle">("rectangle");
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
    const [isFlippedV, setIsFlippedV] = useState<boolean>(false);
    const [cropDimensions, setCropDimensions] = useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    });

    // Handle Cropper State Change
    const handleCropperChange = useCallback((cropper: CropperRef) => {
      const coordinates = cropper.getCoordinates();
      if (coordinates) {
        setCropDimensions({
          width: Math.round(coordinates.width),
          height: Math.round(coordinates.height),
        });
      }
    }, []);

    // Rotate Image
    const handleRotate = useCallback((angle: number) => {
      if (cropperRef.current) {
        cropperRef.current.rotateImage(angle);
      }
    }, []);

    // Flip Image
    const handleFlipHorizontal = useCallback(() => {
      if (cropperRef.current) {
        const nextH = !isFlippedH;
        cropperRef.current.flipImage(nextH, isFlippedV);
        setIsFlippedH(nextH);
      }
    }, [isFlippedH, isFlippedV]);

    const handleFlipVertical = useCallback(() => {
      if (cropperRef.current) {
        const nextV = !isFlippedV;
        cropperRef.current.flipImage(isFlippedH, nextV);
        setIsFlippedV(nextV);
      }
    }, [isFlippedH, isFlippedV]);

    // Zoom Controls
    const handleZoom = useCallback((factor: number) => {
      if (cropperRef.current) {
        cropperRef.current.zoomImage(factor);
        setZoomLevel((prev) => Math.min(Math.max(Number((prev * factor).toFixed(2)), 0.2), 5));
      }
    }, []);

    // Slider Zoom with type safety for single numbers & array values
    const handleSliderZoom = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value: any) => {
        const valArray = Array.isArray(value) ? value : [value];
        const targetZoom = Number(valArray[0]);
        if (cropperRef.current && !isNaN(targetZoom) && targetZoom > 0) {
          const factor = targetZoom / zoomLevel;
          cropperRef.current.zoomImage(factor);
          setZoomLevel(targetZoom);
        }
      },
      [zoomLevel]
    );

    // Reset All Transformations
    const handleReset = useCallback(() => {
      if (cropperRef.current) {
        cropperRef.current.reset();
        setSelectedRatio(null);
        setStencilType("rectangle");
        setZoomLevel(1);
        setIsFlippedH(false);
        setIsFlippedV(false);
      }
    }, []);

    // Apply Crop
    const handleApply = useCallback(() => {
      if (!cropperRef.current) return;
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        onCropApply?.(dataUrl, canvas);
      }
    }, [onCropApply]);

    // Expose Ref Methods to Parent
    useImperativeHandle(ref, () => ({
      getCroppedCanvas: () => cropperRef.current?.getCanvas() || null,
      getCroppedDataUrl: () => cropperRef.current?.getCanvas()?.toDataURL("image/png") || null,
      reset: handleReset,
      rotate: handleRotate,
      flip: (h: boolean, v: boolean) => {
        cropperRef.current?.flipImage(h, v);
        setIsFlippedH(h);
        setIsFlippedV(v);
      },
      zoom: handleZoom,
    }));

    return (
      <div className={`flex flex-col h-full w-full bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl ${className}`}>
        
        {/* Top Bar / Metadata & Stencil Mode */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-cyan-500/40 text-cyan-400 bg-cyan-950/30">
              Crop Tool V2
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {cropDimensions.width > 0 && `${cropDimensions.width} × ${cropDimensions.height} px`}
            </span>
          </div>

          {/* Shape Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Button
              size="sm"
              variant={stencilType === "rectangle" ? "secondary" : "ghost"}
              className="h-7 px-2.5 text-xs gap-1.5"
              title="Rectangle Stencil"
              onClick={() => {
                setStencilType("rectangle");
              }}
            >
              <Square className="w-3.5 h-3.5" />
              Rectangle
            </Button>

            <Button
              size="sm"
              variant={stencilType === "circle" ? "secondary" : "ghost"}
              className="h-7 px-2.5 text-xs gap-1.5"
              title="Circle Mask Stencil"
              onClick={() => {
                setStencilType("circle");
                setSelectedRatio(1); // Circle requires 1:1 aspect ratio
              }}
            >
              <Circle className="w-3.5 h-3.5" />
              Circle
            </Button>
          </div>
        </div>

        {/* Main Interactive Canvas Area */}
        <div className="relative flex-1 min-h-[420px] bg-slate-950/80 flex items-center justify-center p-4 overflow-hidden">
          <Cropper
            ref={cropperRef}
            src={imageSrc}
            onChange={handleCropperChange}
            stencilComponent={stencilType === "circle" ? CircleStencil : RectangleStencil}
            stencilProps={{
              aspectRatio: selectedRatio ?? undefined,
              movable: true,
              resizable: true,
              lines: true,
              handlers: true,
            }}
            className="w-full h-full max-h-[600px] rounded-lg overflow-hidden border border-slate-800/60 shadow-inner"
            backgroundClassName="bg-slate-900/50"
          />
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Ratio className="w-3.5 h-3.5 text-cyan-400" />
            Ratio:
          </span>
          {ASPECT_RATIOS.map((ratio) => {
            const isActive = selectedRatio === ratio.value && stencilType === "rectangle";
            return (
              <Button
                key={ratio.label}
                size="sm"
                variant={isActive ? "default" : "outline"}
                disabled={stencilType === "circle" && ratio.value !== 1}
                className={`h-7 px-2.5 text-xs rounded-full shrink-0 transition-all ${
                  isActive
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500 shadow-sm"
                    : "bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
                onClick={() => {
                  if (stencilType === "circle") setStencilType("rectangle");
                  setSelectedRatio(ratio.value);
                }}
              >
                {ratio.label}
              </Button>
            );
          })}
        </div>

        {/* Controls Bottom Bar (Transformations, Zoom, Actions) */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Transformations Group */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
              title="Rotate Left (-90°)"
              onClick={() => handleRotate(-90)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
              title="Rotate Right (+90°)"
              onClick={() => handleRotate(90)}
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <div className="w-px h-4 bg-slate-800 mx-1" />

            <Button
              size="icon"
              variant={isFlippedH ? "secondary" : "ghost"}
              className="h-8 w-8 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
              title="Flip Horizontal"
              onClick={handleFlipHorizontal}
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant={isFlippedV ? "secondary" : "ghost"}
              className="h-8 w-8 text-slate-300 hover:text-cyan-400 hover:bg-slate-900"
              title="Flip Vertical"
              onClick={handleFlipVertical}
            >
              <FlipVertical className="w-4 h-4" />
            </Button>

            <div className="w-px h-4 bg-slate-800 mx-1" />

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-300 hover:text-rose-400 hover:bg-slate-900"
              title="Reset Canvas"
              onClick={handleReset}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 min-w-[200px]">
            <ZoomOut
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => handleZoom(0.8)}
            />
            <Slider
              value={[zoomLevel]}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={handleSliderZoom}
              className="w-24 cursor-pointer"
            />
            <ZoomIn
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => handleZoom(1.25)}
            />
            <span className="text-xs font-mono text-slate-400 w-9 text-right">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Apply / Cancel Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 gap-1.5 shadow-lg shadow-cyan-950"
            >
              <Check className="w-4 h-4" />
              Apply Crop
            </Button>
          </div>

        </div>
      </div>
    );
  }
);

CropCanvas.displayName = "CropCanvas";