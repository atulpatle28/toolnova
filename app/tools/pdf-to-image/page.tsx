"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Download, ShieldCheck, RefreshCw, Layers } from "lucide-react";

function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setImages([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const extractedImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport } as any).promise;
          extractedImages.push(canvas.toDataURL("image/jpeg", 0.85));
        }
      }

      setImages(extractedImages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
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
            <ShieldCheck className="w-4 h-4" /> PDF to Image
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Extract PDF Pages as Images</h1>
          <p className="text-xs sm:text-sm text-slate-500">Convert PDF pages into high quality JPG images.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-emerald-500/5 space-y-4"
            >
              <Layers className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-base font-extrabold">Select PDF File</p>
              <input type="file" ref={fileInputRef} accept="application/pdf" className="hidden" onChange={(e) => handleConvert(e.target.files)} />
            </div>
          ) : (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2 py-10 text-xs font-bold text-emerald-600">
                  <RefreshCw className="w-5 h-5 animate-spin" /> Converting Pages...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                      <img src={imgUrl} alt={`Page ${index + 1}`} className="h-32 mx-auto object-contain rounded" />
                      <p className="text-xs font-bold">Page {index + 1}</p>
                      <a href={imgUrl} download={`page-${index + 1}.jpg`} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <Download className="w-3.5 h-3.5" /> Download JPG
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToImagePage), { ssr: false });