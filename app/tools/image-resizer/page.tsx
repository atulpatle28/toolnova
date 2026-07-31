"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, Download, ShieldCheck, Upload, RefreshCw, Sliders, CheckCircle2 
} from "lucide-react";

type UnitType = "px" | "cm" | "mm" | "in";

function ImageResizerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Dimension States
  const [unit, setUnit] = useState<UnitType>("px");
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(150);
  const [dpi, setDpi] = useState<number>(300);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(false);

  // Size Target States
  const [targetKb, setTargetKb] = useState<number>(50);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedSizeKb, setResizedSizeKb] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert Units to Pixels
  const getPixels = (val: number, u: UnitType, currentDpi: number): number => {
    if (u === "px") return val;
    if (u === "in") return Math.round(val * currentDpi);
    if (u === "cm") return Math.round((val / 2.54) * currentDpi);
    if (u === "mm") return Math.round((val / 25.4) * currentDpi);
    return val;
  };

  // Preset Handler
  const applyPreset = (pWidth: number, pHeight: number, pUnit: UnitType, pTargetKb: number) => {
    setUnit(pUnit);
    setWidth(pWidth);
    setHeight(pHeight);
    setTargetKb(pTargetKb);
  };

  // Process Resize and KB Limit
  const handleApplyResize = async () => {
    if (!imageSrc) return;
    setIsCompressing(true);

    const targetPxWidth = getPixels(width, unit, dpi);
    const targetPxHeight = getPixels(height, unit, dpi);

    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetPxWidth;
      canvas.height = targetPxHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Smooth Scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetPxWidth, targetPxHeight);

      // Compression loop to fit target KB limit
      let quality = 0.95;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      let blobSizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);

      // Reduce quality if file size exceeds target KB limit
      while (blobSizeKb > targetKb && quality > 0.1) {
        quality -= 0.05;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        blobSizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);
      }

      setPreviewUrl(dataUrl);
      setResizedSizeKb(blobSizeKb);
      setIsCompressing(false);
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1300px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft Image Resizer
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Govt Form & Custom Image Resizer</h1>
          <p className="text-xs text-slate-400">
            Resize images in PX, CM, MM, Inches & Set File Size Limit (KB) for SSC, UPSC, Bank Forms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Display / Preview Box */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[420px]">
            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-emerald-500 bg-slate-900 p-12 rounded-2xl text-center cursor-pointer transition space-y-3"
              >
                <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-200">Select Image to Resize</p>
                  <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP files</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="border border-slate-800 bg-slate-950 p-3 rounded-2xl max-h-[380px] flex items-center justify-center overflow-hidden">
                  <img
                    ref={imgRef}
                    src={previewUrl || imageSrc}
                    alt="Preview"
                    className="max-h-[340px] w-auto object-contain rounded-lg"
                  />
                </div>

                {resizedSizeKb && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/50 px-4 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Ready Size: {resizedSizeKb} KB
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
                  >
                    Change Image
                  </button>
                  <a
                    href={previewUrl || imageSrc}
                    download="toolkraft-resized-image.jpg"
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                  >
                    <Download className="w-4 h-4" /> Download Image
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Controls Sidebar Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            {/* Quick Presets */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Exam Form Presets
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => applyPreset(3.5, 4.5, "cm", 50)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200"
                >
                  SSC Photo
                  <span className="block text-[10px] text-slate-400 font-normal">3.5 x 4.5 cm (50KB)</span>
                </button>
                <button
                  onClick={() => applyPreset(4.0, 2.0, "cm", 20)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200"
                >
                  SSC Signature
                  <span className="block text-[10px] text-slate-400 font-normal">4.0 x 2.0 cm (20KB)</span>
                </button>
                <button
                  onClick={() => applyPreset(350, 350, "px", 300)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200"
                >
                  UPSC Square
                  <span className="block text-[10px] text-slate-400 font-normal">350 x 350 px</span>
                </button>
                <button
                  onClick={() => applyPreset(200, 230, "px", 50)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-bold text-slate-200"
                >
                  IBPS / Bank
                  <span className="block text-[10px] text-slate-400 font-normal">200 x 230 px</span>
                </button>
              </div>
            </div>

            {/* Units Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Dimension Unit</label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(["px", "cm", "mm", "in"] as UnitType[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`py-1.5 rounded-lg font-bold uppercase transition ${
                      unit === u ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Width and Height Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold mb-1 block">Width ({unit})</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold mb-1 block">Height ({unit})</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Target File Size (KB Limit) */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <label className="text-slate-300 font-bold">Max File Size Limit</label>
                <span className="text-emerald-400 font-bold">{targetKb} KB</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={targetKb}
                onChange={(e) => setTargetKb(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyResize}
              disabled={!imageSrc || isCompressing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isCompressing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Apply Dimensions & Limit KB"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImageResizerPage), { ssr: false });