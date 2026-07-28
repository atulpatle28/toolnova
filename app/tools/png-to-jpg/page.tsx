"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Download, ShieldCheck, FileImage } from "lucide-react";

function PngToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !selectedFiles[0]) return;
    const f = selectedFiles[0];
    setFile(f);

    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      canvas.toBlob((blob) => {
        if (blob) setJpgUrl(URL.createObjectURL(blob));
      }, "image/jpeg", 0.9);
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
            <ShieldCheck className="w-4 h-4" /> PNG to JPG
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Convert PNG to JPG</h1>
          <p className="text-xs sm:text-sm text-slate-500">Convert PNG images into clean JPG files instant without uploading.</p>
        </div>

        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 rounded-2xl text-center cursor-pointer hover:bg-emerald-500/5 space-y-3"
          >
            <FileImage className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-extrabold">Select PNG Image</p>
            <input type="file" ref={fileInputRef} accept="image/png" className="hidden" onChange={(e) => handleConvert(e.target.files)} />
          </div>

          {jpgUrl && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
              <p className="text-xs font-bold text-emerald-600">Converted to JPG!</p>
              <a href={jpgUrl} download={`converted-${file?.name.replace(".png", "")}.jpg`} className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md">
                <Download className="w-4 h-4" /> Download JPG
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PngToJpgPage), { ssr: false });