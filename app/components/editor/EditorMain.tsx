"use client";

import React, { useState, useRef, useCallback } from "react";
import AdjustPanel, {
  DEFAULT_ADJUSTMENTS,
  AdjustmentValues,
} from "@/app/components/tools/AdjustPanel";
import { CropTool } from "@/app/components/tools/CropTool";
import PassportTool from "@/app/components/tools/PassportTool";
import EmptyState from "@/app/components/image-editor/EmptyState";
import LoadingOverlay from "@/app/components/image-editor/LoadingOverlay";
import { Button } from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import {
  Crop,
  Sliders,
  Wand2,
  Download,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";

export type ToolType = "crop" | "adjust" | "filters" | "passport" | "none";

export interface EditorMainProps {
  initialImageSrc?: string | null;
  className?: string;
}

export default function EditorMain({ initialImageSrc = null, className = "" }: EditorMainProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImageSrc);
  const [originalImage, setOriginalImage] = useState<string | null>(initialImageSrc);
  const [history, setHistory] = useState<string[]>(initialImageSrc ? [initialImageSrc] : []);

  const [adjustments, setAdjustments] = useState<AdjustmentValues>(DEFAULT_ADJUSTMENTS);

  const [activeTool, setActiveTool] = useState<ToolType>("crop");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isExportSuccess, setIsExportSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterStyle = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) hue-rotate(${adjustments.hue}deg)`;

  const handleImageUpload = (file: File) => {
    setIsLoading(true);
    setLoadingMessage("Loading image into workspace...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCurrentImage(result);
        setOriginalImage(result);
        setHistory([result]);
        setAdjustments(DEFAULT_ADJUSTMENTS);
        setActiveTool("crop");
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      alert("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleCropApply = useCallback((croppedDataUrl: string) => {
    setIsLoading(true);
    setLoadingMessage("Applying crop transformation...");

    setTimeout(() => {
      setCurrentImage(croppedDataUrl);
      setHistory((prev) => [...prev, croppedDataUrl]);
      setIsLoading(false);
    }, 200);
  }, []);

  const handlePassportApply = (passportImageDataUrl: string) => {
    setIsLoading(true);
    setLoadingMessage("Creating passport photo...");

    setTimeout(() => {
      setCurrentImage(passportImageDataUrl);
      setHistory((prev) => [...prev, passportImageDataUrl]);
      setIsLoading(false);
    }, 200);
  };

  const handleResetToOriginal = () => {
    if (!originalImage) return;
    setIsLoading(true);
    setLoadingMessage("Resetting workspace to original image...");

    setTimeout(() => {
      setCurrentImage(originalImage);
      setHistory([originalImage]);
      setAdjustments(DEFAULT_ADJUSTMENTS);
      setIsLoading(false);
    }, 150);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousState = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentImage(previousState);
    }
  };

  const handleExport = () => {
    if (!currentImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.filter = filterStyle;
        ctx.drawImage(img, 0, 0);

        const link = document.createElement("a");
        link.download = `toolnova-edited-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        setIsExportSuccess(true);
        setTimeout(() => setIsExportSuccess(false), 3000);
      }
    };
  };

  if (!currentImage) {
    return (
      <div className={`w-full min-h-[600px] flex items-center justify-center p-4 font-sans antialiased ${className}`}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        <EmptyState
          onUploadClick={() => fileInputRef.current?.click()}
          onFileSelect={handleImageUpload}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col gap-4 w-full h-full bg-slate-950 text-slate-100 p-4 rounded-2xl border border-slate-800/80 shadow-2xl font-sans antialiased ${className}`}>
      
      <LoadingOverlay isVisible={isLoading} message={loadingMessage} />

      {/* Editor Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 backdrop-blur-md">
        
        {/* Left: Branding & Upload New */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white font-medium gap-1.5 h-8 text-[12px]"
            onClick={() => {
              if (confirm("Replace current image? Unsaved changes will be lost.")) {
                fileInputRef.current?.click();
              }
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            New Image
          </Button>

          <div className="w-px h-4 bg-slate-800/80" />

          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-[13px] font-semibold text-slate-200 tracking-wide">
              ToolNova Workspace
            </span>
          </div>
        </div>

        {/* Center: Tool Selection Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800/80 gap-1 overflow-x-auto">
          <Button
            size="sm"
            variant={activeTool === "crop" ? "secondary" : "ghost"}
            className={`h-7 px-3 text-[12px] font-medium gap-1.5 ${
              activeTool === "crop" ? "bg-cyan-950/90 text-cyan-200 border border-cyan-800/60" : "text-slate-400"
            }`}
            onClick={() => setActiveTool("crop")}
          >
            <Crop className="w-3.5 h-3.5" />
            Crop V2
          </Button>

          <Button
            size="sm"
            variant={activeTool === "adjust" ? "secondary" : "ghost"}
            className={`h-7 px-3 text-[12px] font-medium gap-1.5 ${
              activeTool === "adjust" ? "bg-cyan-950/90 text-cyan-200 border border-cyan-800/60" : "text-slate-400"
            }`}
            onClick={() => setActiveTool("adjust")}
          >
            <Sliders className="w-3.5 h-3.5" />
            Adjustments
          </Button>

          <Button
            size="sm"
            variant={activeTool === "passport" ? "secondary" : "ghost"}
            className={`h-7 px-3 text-[12px] font-medium gap-1.5 ${
              activeTool === "passport" ? "bg-cyan-950/90 text-cyan-200 border border-cyan-800/60" : "text-slate-400"
            }`}
            onClick={() => setActiveTool("passport")}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Passport Photo
          </Button>

          <Button
            size="sm"
            variant={activeTool === "filters" ? "secondary" : "ghost"}
            className={`h-7 px-3 text-[12px] font-medium gap-1.5 ${
              activeTool === "filters" ? "bg-cyan-950/90 text-cyan-200 border border-cyan-800/60" : "text-slate-400"
            }`}
            onClick={() => setActiveTool("filters")}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Filters
          </Button>
        </div>

        {/* Right: History & Export Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={history.length <= 1}
            className="h-8 text-[12px] font-medium bg-slate-900 border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 gap-1"
            onClick={handleUndo}
            title="Undo last change"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[12px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            onClick={handleResetToOriginal}
          >
            Reset
          </Button>

          <Button
            size="sm"
            className={`h-8 px-4 text-[12px] font-semibold tracking-wide gap-1.5 transition-all shadow-md ${
              isExportSuccess
                ? "bg-emerald-600 text-white"
                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950"
            }`}
            onClick={handleExport}
          >
            {isExportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Export Image
              </>
            )}
          </Button>
        </div>

      </div>

      {/* Main Active Canvas / Tool Display Area */}
      <div className="flex-1 min-h-[550px] w-full">
        {activeTool === "crop" && (
          <CropTool
            imageSrc={currentImage}
            onApply={handleCropApply}
          />
        )}

        {activeTool === "adjust" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[500px]">
            <Card className="md:col-span-2 bg-slate-900/60 border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={currentImage}
                alt="Live Preview"
                style={{ filter: filterStyle }}
                className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg transition-all duration-75"
              />
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 p-2 overflow-y-auto">
              <AdjustPanel
                adjustments={adjustments}
                onChange={setAdjustments}
                onReset={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
              />
            </Card>
          </div>
        )}

        {activeTool === "passport" && (
          <PassportTool
            imageSrc={currentImage}
            onApply={handlePassportApply}
          />
        )}

        {activeTool === "filters" && (
          <Card className="w-full h-full min-h-[500px] bg-slate-900/60 border-slate-800 flex flex-col items-center justify-center p-8 text-center">
            <Wand2 className="w-12 h-12 text-cyan-400/50 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">AI Filters & Presets</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              One-click color LUTs, Vintage, Grayscale, and Cinematic presets coming soon.
            </p>
          </Card>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
      />

    </div>
  );
}