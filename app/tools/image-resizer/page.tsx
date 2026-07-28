"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Download, ShieldCheck, Maximize2 } from "lucide-react";

function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
    };
  };

  const handleResize = () => {
    if (!preview) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) setResizedUrl(URL.createObjectURL(blob));
      }, file?.type || "image/jpeg");
    };
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
            <ShieldCheck className="w-4 h-4" /> Image Resizer
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Resize Image Dimensions</h1>
          <p className="text-xs sm:text-sm text-slate-500">Change image width and height pixels easily.</p>
        </div>

        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-emerald-500/5 space-y-4"
            >
              <Maximize2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-base font-extrabold">Select Image to Resize</p>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleSelect(e.target.files)} />
            </div>
          ) : (
            <div className="space-y-4">
              <img src={preview!} alt="Preview" className="h-44 mx-auto object-contain rounded-xl border border-slate-200 dark:border-slate-800 p-2" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">Width (px)</label>
                  <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-2 border rounded-xl text-xs font-mono dark:bg-slate-950" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Height (px)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-2 border rounded-xl text-xs font-mono dark:bg-slate-950" />
                </div>
              </div>

              <Button onClick={handleResize} className="w-full bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl">
                Apply New Dimensions
              </Button>

              {resizedUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                  <p className="text-xs font-bold text-emerald-600">Resized Successfully!</p>
                  <a href={resizedUrl} download={`resized-${file.name}`} className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-6 py-2 rounded-xl">
                    <Download className="w-4 h-4" /> Download Resized Image
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

export default dynamic(() => Promise.resolve(ImageResizerPage), { ssr: false });