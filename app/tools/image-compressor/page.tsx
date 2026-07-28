"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  originalSizeKB: number;
  compressedSizeKB?: number;
  compressedUrl?: string;
  previewUrl: string;
}

function ImageCompressorPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (files: FileList | null) => {
    if (!files) return;
    const items: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          originalSizeKB: Math.round(file.size / 1024),
          previewUrl: URL.createObjectURL(file),
        });
      }
    }
    setImages((prev) => [...prev, ...items]);
  };

  const handleCompress = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      const img = new Image();
      img.src = item.previewUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", quality / 100)
      );

      item.compressedSizeKB = Math.round(blob.size / 1024);
      item.compressedUrl = URL.createObjectURL(blob);
    }

    setImages(updated);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Image Compressor
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Compress Images</h1>
          <p className="text-xs sm:text-sm text-slate-500">Reduce image file size instantly without visible quality loss.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-emerald-500/5 transition-all space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="text-base font-extrabold">Select Images</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleSelect(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold">Compression Quality: {quality}%</span>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-emerald-600 cursor-pointer w-1/2"
                />
                <Button onClick={handleCompress} disabled={isProcessing} className="bg-emerald-600 text-white font-bold text-xs px-5 py-2 rounded-xl">
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Compress All"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                    <button onClick={() => setImages(images.filter((i) => i.id !== img.id))} className="absolute top-2 right-2 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <img src={img.previewUrl} alt="Preview" className="h-28 mx-auto object-contain rounded-md" />
                    <p className="text-xs font-bold truncate">{img.file.name}</p>
                    <div className="text-[11px] font-mono font-bold">
                      <span className="text-slate-400">{img.originalSizeKB} KB</span>
                      {img.compressedSizeKB && <span className="text-emerald-500 ml-2">→ {img.compressedSizeKB} KB</span>}
                    </div>
                    {img.compressedUrl && (
                      <a href={img.compressedUrl} download={`compressed-${img.file.name}`} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 pt-1">
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImageCompressorPage), { ssr: false });