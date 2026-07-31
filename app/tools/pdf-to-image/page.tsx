"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft, Download, ShieldCheck, RefreshCw, Layers, Upload } from "lucide-react";

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
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport } as any).promise;
          extractedImages.push(canvas.toDataURL("image/jpeg", 0.85));
        }
      }

      setImages(extractedImages);
    } catch (e) {
      console.error(e);
      alert("Error processing PDF file. Please try another PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setImages([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> PDF to Image
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Extract PDF Pages as Images
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convert PDF pages into high quality JPG images instantly.
          </p>
        </div>

        {/* Outer White Box Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 rounded-2xl text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Click to Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Upload any PDF file to split into images</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleConvert(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="truncate max-w-xs sm:max-w-md">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={resetAll}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg hover:bg-red-100 transition"
                >
                  Choose Different File
                </button>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Extracting Pages into JPG...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3 shadow-sm"
                    >
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
                        <img
                          src={imgUrl}
                          alt={`Page ${index + 1}`}
                          className="h-44 w-full object-contain rounded"
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Page {index + 1}</p>
                      <a
                        href={imgUrl}
                        download={`page-${index + 1}.jpg`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition"
                      >
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