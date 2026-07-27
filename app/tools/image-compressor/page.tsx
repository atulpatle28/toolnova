"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Crop,
  Download,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  RefreshCw,
  ImageIcon,
} from "lucide-react";

export default function TargetImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSizeKB, setCompressedSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const sizeKB = Math.round(selectedFile.size / 1024);
      setOriginalSizeKB(sizeKB);
      setTargetKB(Math.min(50, sizeKB)); // Default 50KB or smaller
      setImagePreview(URL.createObjectURL(selectedFile));
      setCompressedImage(null);
      setCompressedSizeKB(null);
    } else if (selectedFile) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
    }
  };

  const handleCompress = async () => {
    if (!file || !imagePreview) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = imagePreview;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // Iterative canvas quality compression to hit target KB limit
      let quality = 0.9;
      let dataUrl = "";
      let currentKB = originalSizeKB;

      canvas.width = width;
      canvas.height = height;

      for (let i = 0; i < 10; i++) {
        if (!ctx) break;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        dataUrl = canvas.toDataURL("image/jpeg", quality);
        const head = "data:image/jpeg;base64,";
        const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
        currentKB = Math.round(sizeInBytes / 1024);

        if (currentKB <= targetKB || quality <= 0.1) {
          break;
        }

        // Reduce quality & scale down dimensions if needed
        quality -= 0.15;
        if (quality < 0.3) {
          width = Math.round(width * 0.9);
          height = Math.round(height * 0.9);
          canvas.width = width;
          canvas.height = height;
        }
      }

      setCompressedImage(dataUrl);
      setCompressedSizeKB(currentKB);
    } catch (err) {
      console.error(err);
      alert("Error compressing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Browser Local Processing
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <Crop className="w-3.5 h-3.5" /> Target KB Optimizer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Compress Image to Target KB Size
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set exact KB requirements for online exam forms, passport uploads, and government portals (e.g. 20KB, 50KB, 100KB).
          </p>
        </div>

        {/* Workstation Container */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-500/60 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-amber-500/5 p-10 sm:p-14 rounded-2xl text-center cursor-pointer transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Select Image File (JPG, PNG, WEBP)
                </p>
                <p className="text-xs text-slate-500">
                  Click to browse or drag & drop image here
                </p>
              </div>

              <Button
                type="button"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-amber-600/20 pointer-events-none"
              >
                Choose Image
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Preview & Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                {/* Image Preview Box */}
                <div className="space-y-2 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Original Image ({originalSizeKB} KB)
                  </span>
                  {imagePreview && (
                    <div className="w-full h-44 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2">
                      <img
                        src={imagePreview}
                        alt="Source Preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Target Size Input */}
                <div className="space-y-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Target Max KB Limit:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max={originalSizeKB}
                        value={targetKB}
                        onChange={(e) => setTargetKB(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                      />
                      <span className="text-xs font-bold text-slate-400">KB</span>
                    </div>
                  </div>

                  {/* Preset Quick Buttons */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Presets:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {[20, 50, 100, 200].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setTargetKB(preset)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                            targetKB === preset
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {preset} KB
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Select Different Image
                </Button>

                <Button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md shadow-amber-600/20"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Optimizing Image...
                    </>
                  ) : (
                    "Compress Image Now"
                  )}
                </Button>
              </div>

              {/* Download Card */}
              {compressedImage && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" /> Image Compressed Successfully!
                  </div>

                  <p className="text-xs font-mono text-slate-600 dark:text-slate-300">
                    Compressed Size: <span className="font-bold text-emerald-600 dark:text-emerald-400">{compressedSizeKB} KB</span>
                  </p>

                  <a
                    href={compressedImage}
                    download={`compressed-${file.name}`}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download Compressed JPG
                  </a>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}